import * as Domain from "@maint/domain"
import type { CauseConfigEditorViewModel, EquipmentInfoEditorViewModel, ExistingHierarchyEditorViewModel } from "../features/workspace/editors/types"
import type { NodeActionsViewModel, NodeInspectPanelViewModel } from "../features/workspace/node-panel/types"
import type { StrategyWorkspaceViewModel } from "../features/workspace/strategy/types"

export interface MaintenanceRiskBridge {
  annualHours: number
  strategyModelHorizonHours: number
  calculateExpectedFailureProfile: typeof Domain.calculateExpectedFailureProfile
  calculateReferenceFailureIntervalHours: typeof Domain.calculateReferenceFailureIntervalHours
  calculateCumulativeFailureProbability: typeof Domain.calculateCumulativeFailureProbability
  calculateDemandProbabilityForWindow: typeof Domain.calculateDemandProbabilityForWindow
  calculateDormantAverageExposureWindowHours: typeof Domain.calculateDormantAverageExposureWindowHours
  calculateRealizedConsequenceCount: typeof Domain.calculateRealizedConsequenceCount
  calculatePmResidualFailureCount: typeof Domain.calculatePmResidualFailureCount
  calculateInspectionPreventedFraction: typeof Domain.calculateInspectionPreventedFraction
  combinePreventivePathways: typeof Domain.combinePreventivePathways
}

export interface MaintenanceHierarchyBridge {
  findNodeInfo: typeof Domain.findNodeInfo
  getFirstNode: typeof Domain.getFirstNode
  removeNodeFromHierarchy: typeof Domain.removeNodeFromHierarchy
  isCodeLikeHierarchyValue: typeof Domain.isCodeLikeHierarchyValue
  getHierarchySeparatorForType: typeof Domain.getHierarchySeparatorForType
  joinInheritedCode: typeof Domain.joinInheritedCode
  extractLocalCodeSegment: typeof Domain.extractLocalCodeSegment
  getFullCodeFromPath: typeof Domain.getFullCodeFromPath
  getParentPath: typeof Domain.getParentPath
  getParentFullCodeFromPath: typeof Domain.getParentFullCodeFromPath
  getNearestAncestorNodeFromPath: typeof Domain.getNearestAncestorNodeFromPath
}

export interface MaintenancePersistenceMapperBridge {
  getFailureModeJsonForPath: typeof Domain.getFailureModeJsonForPath
  getEffectJsonEntryForNode: typeof Domain.getEffectJsonEntryForNode
  getTaskJsonEntryForNode: typeof Domain.getTaskJsonEntryForNode
  getPreservedFailureModeDbJsonFields: typeof Domain.getPreservedFailureModeDbJsonFields
  formatFailureModeDerivedSnapshotValue: typeof Domain.formatFailureModeDerivedSnapshotValue
  buildFailureModeDbJson: typeof Domain.buildFailureModeDbJson
  refreshFailureModeDbJsonBaseForHierarchy: typeof Domain.refreshFailureModeDbJsonBaseForHierarchy
  applyFailureModeDecisionSnapshotsForHierarchy: typeof Domain.applyFailureModeDecisionSnapshotsForHierarchy
  refreshFailureModeDbJsonForHierarchy: typeof Domain.refreshFailureModeDbJsonForHierarchy
}

export interface MaintenanceStrategyWorkspaceRendererBridge {
  renderStrategyWorkspace: (viewModel: StrategyWorkspaceViewModel) => string
}

export interface MaintenanceNodePanelRendererBridge {
  renderInspectPanel: (viewModel: NodeInspectPanelViewModel) => string
  renderNodeActions: (viewModel: NodeActionsViewModel) => string
}

export interface MaintenanceEditorRendererBridge {
  renderEquipmentInfoEditor: (viewModel: EquipmentInfoEditorViewModel) => string
  renderCauseConfigEditor: (viewModel: CauseConfigEditorViewModel) => string
  renderExistingHierarchyNodeEditor: (viewModel: ExistingHierarchyEditorViewModel) => string
}

export interface MaintenanceWorkspaceRenderersBridge {
  strategy?: MaintenanceStrategyWorkspaceRendererBridge
  nodePanel?: MaintenanceNodePanelRendererBridge
  editors?: MaintenanceEditorRendererBridge
}

export interface MaintenanceProductBridge {
  risk?: MaintenanceRiskBridge
  hierarchy?: MaintenanceHierarchyBridge
  persistenceMappers?: MaintenancePersistenceMapperBridge
  workspaceRenderers?: MaintenanceWorkspaceRenderersBridge
}
