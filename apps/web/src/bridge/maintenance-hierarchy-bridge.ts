import {
  extractLocalCodeSegment,
  findNodeInfo,
  getFirstNode,
  getFullCodeFromPath,
  getHierarchySeparatorForType,
  getNearestAncestorNodeFromPath,
  getParentFullCodeFromPath,
  getParentPath,
  isCodeLikeHierarchyValue,
  joinInheritedCode,
  removeNodeFromHierarchy
} from "@maint/domain"
import type { MaintenanceProductBridge } from "./product-bridge-types"

declare global {
  interface Window {
    __maintenanceProductBridge?: MaintenanceProductBridge
  }
}

/**
 * Hierarchy helpers are the first low-risk extraction seam after the risk engine.
 *
 * The legacy runtime still owns app state and DOM orchestration, but its tree and
 * code-path helpers can now come from the typed domain package through this bridge.
 */
window.__maintenanceProductBridge = {
  ...(window.__maintenanceProductBridge || {}),
  hierarchy: {
    findNodeInfo,
    getFirstNode,
    removeNodeFromHierarchy,
    isCodeLikeHierarchyValue,
    getHierarchySeparatorForType,
    joinInheritedCode,
    extractLocalCodeSegment,
    getFullCodeFromPath,
    getParentPath,
    getParentFullCodeFromPath,
    getNearestAncestorNodeFromPath
  }
}
