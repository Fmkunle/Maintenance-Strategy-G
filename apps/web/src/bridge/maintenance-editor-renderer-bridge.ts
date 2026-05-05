import { renderCauseConfigEditor, renderEquipmentInfoEditor, renderExistingHierarchyNodeEditor } from "../features/workspace/editors"
import type { MaintenanceProductBridge } from "./product-bridge-types"

declare global {
  interface Window {
    __maintenanceProductBridge?: MaintenanceProductBridge
  }
}

/**
 * The legacy runtime still owns draft state and editor workflows.
 * This bridge only moves standalone editor HTML generation into typed modules.
 */
window.__maintenanceProductBridge = {
  ...(window.__maintenanceProductBridge || {}),
  workspaceRenderers: {
    ...(window.__maintenanceProductBridge?.workspaceRenderers || {}),
    editors: {
      renderEquipmentInfoEditor,
      renderCauseConfigEditor,
      renderExistingHierarchyNodeEditor,
    },
  },
}
