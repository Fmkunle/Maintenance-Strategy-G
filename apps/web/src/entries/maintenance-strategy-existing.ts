import "../../../../styles.css";
import "../bridge/maintenance-risk-bridge";
import "../bridge/maintenance-hierarchy-bridge";
import "../bridge/maintenance-persistence-mapper-bridge";
import "../bridge/maintenance-editor-renderer-bridge";
import "../bridge/maintenance-node-panel-renderer-bridge";
import "../bridge/maintenance-workspace-renderer-bridge";

window.__maintenanceLaunchMode = "existing";
window.__maintenanceAssetVersion = "product-web-maintenance-existing";

await import("../../../../maintenance-strategy.js");
