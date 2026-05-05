import { renderStrategyWorkspace } from "../features/workspace/strategy"
import type { MaintenanceProductBridge } from "./product-bridge-types"

declare global {
  interface Window {
    __maintenanceProductBridge?: MaintenanceProductBridge
  }
}

/**
 * The legacy runtime still decides when the strategy workspace should render.
 * This bridge only moves HTML generation into typed web feature modules.
 */
window.__maintenanceProductBridge = {
  ...(window.__maintenanceProductBridge || {}),
  workspaceRenderers: {
    ...(window.__maintenanceProductBridge?.workspaceRenderers || {}),
    strategy: {
      renderStrategyWorkspace
    }
  }
}
