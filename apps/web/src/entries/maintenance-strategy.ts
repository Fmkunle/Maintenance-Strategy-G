import "../../../../styles.css";
import "../bridge/maintenance-risk-bridge";
import "../bridge/maintenance-hierarchy-bridge";
import "../bridge/maintenance-persistence-mapper-bridge";
import "../bridge/maintenance-editor-renderer-bridge";
import "../bridge/maintenance-node-panel-renderer-bridge";
import "../bridge/maintenance-workspace-renderer-bridge";

window.__maintenanceLaunchMode = "new";
window.__maintenanceAssetVersion = "product-web-maintenance";

/**
 * The large maintenance workspace is still driven by the legacy runtime during
 * this phase. The key change is that its domain formulas now have a typed bridge
 * available, so future extraction can happen without breaking the UI.
 */
await import("../../../../maintenance-strategy.js");
