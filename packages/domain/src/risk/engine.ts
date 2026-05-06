import type {
  FailureLikelihoodProfile,
  PreventivePathwayInput,
  RiskEvaluationRequest,
  RiskEvaluationResult
} from "@maint/contracts";
import { ANNUAL_HOURS, STRATEGY_MODEL_HORIZON_HOURS, clampNumber } from "@maint/shared";

export interface FailureLikelihoodInput {
  horizonHours?: number;
  etaHours?: number | null;
  betaValue?: number | null;
  gammaHours?: number | null;
  mttfHours?: number | null;
}

/**
 * Build a normalized likelihood profile from the configured reliability inputs.
 *
 * Why this lives in the domain layer:
 * - the same likelihood model is needed by the browser decision view
 * - the API must be able to calculate the same result server-side
 * - tests need a pure, DOM-free function to validate the formulas
 */
export const calculateExpectedFailureProfile = ({
  horizonHours = STRATEGY_MODEL_HORIZON_HOURS,
  etaHours = null,
  betaValue = null,
  gammaHours = 0,
  mttfHours = null
}: FailureLikelihoodInput): FailureLikelihoodProfile => {
  if (etaHours && etaHours > 0 && betaValue && betaValue > 0) {
    const adjustedHorizonHours = Math.max(0, horizonHours - Math.max(0, gammaHours || 0));
    const expectedFailureCount = adjustedHorizonHours > 0 ? Math.pow(adjustedHorizonHours / etaHours, betaValue) : 0;

    return {
      expectedFailureCount: Number.isFinite(expectedFailureCount) ? expectedFailureCount : 0,
      source: "weibull",
      etaHours,
      betaValue,
      gammaHours: gammaHours || 0,
      mttfHours
    };
  }

  if (mttfHours && mttfHours > 0) {
    return {
      expectedFailureCount: horizonHours / mttfHours,
      source: "mttf",
      etaHours,
      betaValue,
      gammaHours: gammaHours || 0,
      mttfHours
    };
  }

  return {
    expectedFailureCount: 1,
    source: "fallback",
    etaHours,
    betaValue,
    gammaHours: gammaHours || 0,
    mttfHours
  };
};

/**
 * Derive a usable interval from the failure profile.
 *
 * This supports parts of the product that need a timing reference even when the
 * user has only supplied a partial likelihood configuration.
 */
export const calculateReferenceFailureIntervalHours = (
  likelihoodProfile: FailureLikelihoodProfile,
  horizonHours = STRATEGY_MODEL_HORIZON_HOURS
): number => {
  const modeledInterval =
    likelihoodProfile.etaHours ||
    likelihoodProfile.mttfHours ||
    (likelihoodProfile.expectedFailureCount > 0 ? horizonHours / likelihoodProfile.expectedFailureCount : 0);

  return Math.max(1, modeledInterval || horizonHours);
};

/**
 * Calculate the probability that at least one failure occurs within the supplied time window.
 *
 * This function is reused by PM calculations because PM effectiveness depends on the
 * probability of failure before the next replacement cycle, not only on the long-horizon count.
 */
export const calculateCumulativeFailureProbability = (
  likelihoodProfile: FailureLikelihoodProfile,
  hours: number,
  horizonHours = STRATEGY_MODEL_HORIZON_HOURS
): number => {
  if (!Number.isFinite(hours) || hours <= 0) {
    return 0;
  }

  if (likelihoodProfile.source === "weibull" && likelihoodProfile.etaHours && likelihoodProfile.betaValue) {
    const adjustedHours = Math.max(0, hours - Math.max(0, likelihoodProfile.gammaHours || 0));
    if (adjustedHours <= 0) {
      return 0;
    }

    return clampNumber(1 - Math.exp(-Math.pow(adjustedHours / likelihoodProfile.etaHours, likelihoodProfile.betaValue)));
  }

  if (likelihoodProfile.mttfHours && likelihoodProfile.mttfHours > 0) {
    return clampNumber(1 - Math.exp(-hours / likelihoodProfile.mttfHours));
  }

  const fallbackInterval = calculateReferenceFailureIntervalHours(likelihoodProfile, horizonHours);
  return clampNumber(1 - Math.exp(-hours / fallbackInterval));
};

export const calculateDemandProbabilityForWindow = (
  demandFrequencyPerYear: number,
  windowHours: number,
  annualHours = ANNUAL_HOURS
): number => {
  if (!(demandFrequencyPerYear > 0) || !(windowHours > 0)) {
    return 0;
  }

  return clampNumber(1 - Math.exp(-(demandFrequencyPerYear / annualHours) * windowHours));
};

/**
 * Hidden failures are not realized across the whole control window on average.
 * The common approximation is that discovery or demand happens halfway through the
 * modeled window, which is why the domain package exposes this as a dedicated helper.
 */
export const calculateDormantAverageExposureWindowHours = (controlWindowHours: number): number => {
  if (!(controlWindowHours > 0)) {
    return 0;
  }

  return Math.max(1, controlWindowHours / 2);
};

export const calculateRealizedConsequenceCount = ({
  expectedFailureCount,
  isDormant,
  demandFrequencyPerYear,
  controlWindowHours,
  annualHours = ANNUAL_HOURS
}: {
  expectedFailureCount: number;
  isDormant: boolean;
  demandFrequencyPerYear: number;
  controlWindowHours: number;
  annualHours?: number;
}): number => {
  const modeledFailureCount = Math.max(0, expectedFailureCount || 0);

  if (!isDormant) {
    return modeledFailureCount;
  }

  const averageExposureWindowHours = calculateDormantAverageExposureWindowHours(controlWindowHours);
  return modeledFailureCount * calculateDemandProbabilityForWindow(demandFrequencyPerYear, averageExposureWindowHours, annualHours);
};

/**
 * PM effectiveness is modeled as repeated replacement cycles across the 10-year horizon.
 *
 * Each cycle contributes the probability that failure lands before the next planned PM.
 * Summing the cycle probabilities gives us a residual failure count that still respects
 * the MTTF / Weibull curve instead of using a coarse heuristic weight.
 */
export const calculatePmResidualFailureCount = ({
  likelihoodProfile,
  intervalHours,
  horizonHours = STRATEGY_MODEL_HORIZON_HOURS
}: {
  likelihoodProfile: FailureLikelihoodProfile;
  intervalHours: number;
  horizonHours?: number;
}): number => {
  if (!(intervalHours > 0)) {
    return 0;
  }

  const fullCycles = Math.floor(horizonHours / intervalHours);
  const remainderHours = Math.max(0, horizonHours - fullCycles * intervalHours);
  const cycleFailureProbability = calculateCumulativeFailureProbability(likelihoodProfile, intervalHours, horizonHours);
  const remainderFailureProbability = calculateCumulativeFailureProbability(likelihoodProfile, remainderHours, horizonHours);

  return Math.max(0, fullCycles * cycleFailureProbability + remainderFailureProbability);
};

export const calculatePmPreventedFraction = ({
  baselineFailureCount,
  residualFailureCount
}: {
  baselineFailureCount: number;
  residualFailureCount: number;
}): number => {
  if (!(baselineFailureCount > 0)) {
    return 0;
  }

  return clampNumber(1 - residualFailureCount / baselineFailureCount);
};

/**
 * INS + secondary PM uses a deliberately simple timing model for v1:
 * - the failure must still be within the usable timing window before functional failure
 * - the inspection must then successfully detect the issue
 *
 * We do not model lead time yet because the current product does not collect it.
 */
export const calculateInspectionPreventedFraction = ({
  referenceFailureIntervalHours,
  inspectionIntervalHours,
  pfIntervalHours,
  detectionProbability
}: {
  referenceFailureIntervalHours: number;
  inspectionIntervalHours: number;
  pfIntervalHours: number;
  detectionProbability: number;
}): number => {
  if (!(referenceFailureIntervalHours > 0) || !(inspectionIntervalHours > 0) || !(pfIntervalHours > 0)) {
    return 0;
  }

  const usableInspectionWindowHours = Math.max(0, referenceFailureIntervalHours - pfIntervalHours);
  if (!(usableInspectionWindowHours > 0)) {
    return 0;
  }

  const timingFactor = clampNumber(usableInspectionWindowHours / inspectionIntervalHours);
  return clampNumber(timingFactor * clampNumber(detectionProbability));
};

export const combinePreventivePathways = ({
  pathways,
  baseControlWindowHours,
  horizonHours = STRATEGY_MODEL_HORIZON_HOURS
}: {
  pathways: PreventivePathwayInput[];
  baseControlWindowHours: number;
  horizonHours?: number;
}): { combinedPreventedFraction: number; combinedControlWindowHours: number } => {
  const normalizedPathways = pathways.filter((pathway) => pathway.preventedFraction > 0);
  const combinedPreventedFraction = normalizedPathways.length
    ? 1 - normalizedPathways.reduce((remainingRisk, pathway) => remainingRisk * (1 - clampNumber(pathway.preventedFraction)), 1)
    : 0;

  const combinedControlWindowHours = normalizedPathways.length
    ? normalizedPathways.reduce(
        (smallestWindow, pathway) => Math.min(smallestWindow, pathway.controlWindowHours || baseControlWindowHours || horizonHours),
        baseControlWindowHours || horizonHours
      )
    : baseControlWindowHours || horizonHours;

  return {
    combinedPreventedFraction,
    combinedControlWindowHours
  };
};

export const createOutcomeMetricsFromResidualFailureCount = ({
  baselineFailureCount,
  residualFailureCount,
  perEventExposure,
  isDormant,
  demandFrequencyPerYear,
  controlWindowHours,
  executionCost
}: {
  baselineFailureCount: number;
  residualFailureCount: number;
  perEventExposure: number;
  isDormant: boolean;
  demandFrequencyPerYear: number;
  controlWindowHours: number;
  executionCost: number;
}): RiskEvaluationResult => {
  const residualConsequenceCount = calculateRealizedConsequenceCount({
    expectedFailureCount: residualFailureCount,
    isDormant,
    demandFrequencyPerYear,
    controlWindowHours
  });
  const baselineConsequenceCount = calculateRealizedConsequenceCount({
    expectedFailureCount: baselineFailureCount,
    isDormant,
    demandFrequencyPerYear,
    controlWindowHours
  });
  const baselineExposure = baselineConsequenceCount * perEventExposure;
  const residualExposure = residualConsequenceCount * perEventExposure;
  const exposureReduction = Math.max(0, baselineExposure - residualExposure);

  return {
    baselineFailureCount,
    baselineConsequenceCount,
    baselineExposure,
    combinedPreventedFraction: baselineFailureCount > 0 ? clampNumber(1 - residualFailureCount / baselineFailureCount) : 0,
    residualFailureCount,
    residualConsequenceCount,
    residualExposure,
    executionCost,
    totalExpectedCost: residualExposure + executionCost,
    exposureReduction,
    combinedControlWindowHours: controlWindowHours
  };
};

/**
 * API-friendly evaluation helper used by the first backend slice.
 *
 * This intentionally works with already-normalized numeric inputs so both the browser
 * bridge and the API can stay thin and spend their effort on mapping UI/request data
 * into a shared domain contract.
 */
export const evaluateRiskScenario = (request: RiskEvaluationRequest): RiskEvaluationResult => {
  const likelihoodProfile = calculateExpectedFailureProfile(request.likelihood);
  const pathwayOutcome = combinePreventivePathways({
    pathways: request.preventivePathways,
    baseControlWindowHours: request.baseControlWindowHours,
    horizonHours: request.likelihood.horizonHours
  });
  const residualFailureCount = Math.max(0, likelihoodProfile.expectedFailureCount * (1 - pathwayOutcome.combinedPreventedFraction));
  const executionCost = request.executionCost + residualFailureCount * request.correctiveCostPerEvent;

  const outcome = createOutcomeMetricsFromResidualFailureCount({
    baselineFailureCount: likelihoodProfile.expectedFailureCount,
    residualFailureCount,
    perEventExposure: request.perEventExposure,
    isDormant: request.isDormant,
    demandFrequencyPerYear: request.demandFrequencyPerYear,
    controlWindowHours: pathwayOutcome.combinedControlWindowHours,
    executionCost
  });

  return {
    ...outcome,
    combinedPreventedFraction: pathwayOutcome.combinedPreventedFraction,
    combinedControlWindowHours: pathwayOutcome.combinedControlWindowHours
  };
};
