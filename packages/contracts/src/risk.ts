import { z } from "zod";

export type FailureLikelihoodSource = "weibull" | "mttf" | "fallback";

export interface FailureLikelihoodProfile {
  expectedFailureCount: number;
  source: FailureLikelihoodSource;
  etaHours: number | null;
  betaValue: number | null;
  gammaHours: number;
  mttfHours: number | null;
}

export interface PreventivePathwayInput {
  preventedFraction: number;
  controlWindowHours?: number | null;
}

export interface RiskEvaluationResult {
  baselineFailureCount: number;
  baselineConsequenceCount: number;
  baselineExposure: number;
  combinedPreventedFraction: number;
  residualFailureCount: number;
  residualConsequenceCount: number;
  residualExposure: number;
  executionCost: number;
  totalExpectedCost: number;
  exposureReduction: number;
  combinedControlWindowHours: number;
}

export const failureLikelihoodInputSchema = z.object({
  horizonHours: z.number().positive(),
  etaHours: z.number().positive().nullable().optional(),
  betaValue: z.number().positive().nullable().optional(),
  gammaHours: z.number().nonnegative().nullable().optional(),
  mttfHours: z.number().positive().nullable().optional()
});

export const riskEvaluationRequestSchema = z.object({
  likelihood: failureLikelihoodInputSchema,
  perEventExposure: z.number().nonnegative(),
  isDormant: z.boolean().default(false),
  demandFrequencyPerYear: z.number().nonnegative().default(0),
  baseControlWindowHours: z.number().nonnegative().default(0),
  preventivePathways: z
    .array(
      z.object({
        preventedFraction: z.number().min(0).max(1),
        controlWindowHours: z.number().nonnegative().optional()
      })
    )
    .default([]),
  executionCost: z.number().nonnegative().default(0),
  correctiveCostPerEvent: z.number().nonnegative().default(0)
});

export type RiskEvaluationRequest = z.infer<typeof riskEvaluationRequestSchema>;
