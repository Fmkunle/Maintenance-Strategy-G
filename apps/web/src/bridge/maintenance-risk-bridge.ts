import {
  ANNUAL_HOURS,
  STRATEGY_MODEL_HORIZON_HOURS,
  calculateCumulativeFailureProbability,
  calculateDemandProbabilityForWindow,
  calculateDormantAverageExposureWindowHours,
  calculateExpectedFailureProfile,
  calculateInspectionPreventedFraction,
  calculatePmResidualFailureCount,
  combinePreventivePathways,
  calculateReferenceFailureIntervalHours,
  calculateRealizedConsequenceCount
} from "@maint/domain";
import type { MaintenanceProductBridge } from "./product-bridge-types";

declare global {
  interface Window {
    __maintenanceProductBridge?: MaintenanceProductBridge;
  }
}

/**
 * Bridge the new typed domain package into the legacy browser experience.
 *
 * This lets the current maintenance workspace keep its DOM-driven implementation
 * while the business logic starts moving into testable, reusable modules.
 */
window.__maintenanceProductBridge = {
  ...(window.__maintenanceProductBridge || {}),
  risk: {
    annualHours: ANNUAL_HOURS,
    strategyModelHorizonHours: STRATEGY_MODEL_HORIZON_HOURS,
    calculateExpectedFailureProfile,
    calculateReferenceFailureIntervalHours,
    calculateCumulativeFailureProbability,
    calculateDemandProbabilityForWindow,
    calculateDormantAverageExposureWindowHours,
    calculateRealizedConsequenceCount,
    calculatePmResidualFailureCount,
    calculateInspectionPreventedFraction,
    combinePreventivePathways
  }
};
