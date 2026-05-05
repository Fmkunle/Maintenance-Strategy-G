import {
  applyFailureModeDecisionSnapshotsForHierarchy,
  buildFailureModeDbJson,
  formatFailureModeDerivedSnapshotValue,
  getEffectJsonEntryForNode,
  getFailureModeJsonForPath,
  getPreservedFailureModeDbJsonFields,
  getTaskJsonEntryForNode,
  refreshFailureModeDbJsonBaseForHierarchy,
  refreshFailureModeDbJsonForHierarchy
} from "@maint/domain"
import type { MaintenanceProductBridge } from "./product-bridge-types"

declare global {
  interface Window {
    __maintenanceProductBridge?: MaintenanceProductBridge
  }
}

/**
 * Failure-mode DB JSON mapping is still consumed by the legacy runtime, but the
 * mapping logic itself now lives in typed domain modules behind this bridge.
 */
window.__maintenanceProductBridge = {
  ...(window.__maintenanceProductBridge || {}),
  persistenceMappers: {
    getFailureModeJsonForPath,
    getEffectJsonEntryForNode,
    getTaskJsonEntryForNode,
    getPreservedFailureModeDbJsonFields,
    formatFailureModeDerivedSnapshotValue,
    buildFailureModeDbJson,
    refreshFailureModeDbJsonBaseForHierarchy,
    applyFailureModeDecisionSnapshotsForHierarchy,
    refreshFailureModeDbJsonForHierarchy
  }
}
