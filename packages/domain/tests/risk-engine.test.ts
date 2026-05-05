import { describe, expect, it } from "vitest";
import {
  calculateExpectedFailureProfile,
  calculateInspectionPreventedFraction,
  calculatePmPreventedFraction,
  calculatePmResidualFailureCount,
  combinePreventivePathways
} from "../src/risk";
import { STRATEGY_MODEL_HORIZON_HOURS } from "@maint/shared";

describe("risk engine", () => {
  it("calculates a repeated-event MTTF profile", () => {
    const profile = calculateExpectedFailureProfile({
      horizonHours: STRATEGY_MODEL_HORIZON_HOURS,
      mttfHours: 1000
    });

    expect(profile.source).toBe("mttf");
    expect(profile.expectedFailureCount).toBeCloseTo(87.6, 1);
  });

  it("calculates inspection prevention from PF timing and detection probability", () => {
    const preventedFraction = calculateInspectionPreventedFraction({
      inspectionIntervalHours: 100,
      pfIntervalHours: 50,
      detectionProbability: 0.8
    });

    expect(preventedFraction).toBeCloseTo(0.4, 4);
  });

  it("calculates PM residual failures from cycle probability", () => {
    const profile = calculateExpectedFailureProfile({
      horizonHours: STRATEGY_MODEL_HORIZON_HOURS,
      mttfHours: 2000
    });
    const residualFailureCount = calculatePmResidualFailureCount({
      likelihoodProfile: profile,
      intervalHours: 1000,
      horizonHours: STRATEGY_MODEL_HORIZON_HOURS
    });

    expect(residualFailureCount).toBeGreaterThan(0);
    expect(calculatePmPreventedFraction({ baselineFailureCount: profile.expectedFailureCount, residualFailureCount })).toBeGreaterThan(0);
  });

  it("stacks enabled preventive paths complementarily", () => {
    const combined = combinePreventivePathways({
      pathways: [
        { preventedFraction: 0.8, controlWindowHours: 100 },
        { preventedFraction: 0.6, controlWindowHours: 80 }
      ],
      baseControlWindowHours: 120
    });

    expect(combined.combinedPreventedFraction).toBeCloseTo(0.92, 2);
    expect(combined.combinedControlWindowHours).toBe(80);
  });
});
