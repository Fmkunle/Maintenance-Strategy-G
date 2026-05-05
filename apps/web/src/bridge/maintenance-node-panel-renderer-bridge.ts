import { renderInspectPanel, renderNodeActions } from "../features/workspace/node-panel"
import type { MaintenanceProductBridge } from "./product-bridge-types"

declare global {
  interface Window {
    __maintenanceProductBridge?: MaintenanceProductBridge
  }
}

/**
 * The legacy runtime still decides which right-pane mode is active.
 * This bridge only moves inspect/action HTML generation into typed modules.
 */
window.__maintenanceProductBridge = {
  ...(window.__maintenanceProductBridge || {}),
  workspaceRenderers: {
    ...(window.__maintenanceProductBridge?.workspaceRenderers || {}),
    nodePanel: {
      renderInspectPanel,
      renderNodeActions
    }
  }
}
