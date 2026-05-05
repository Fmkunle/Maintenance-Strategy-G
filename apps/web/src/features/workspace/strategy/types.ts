export type StrategyWorkspaceMode = "decision" | "audit"

export interface StrategyWorkspaceTabsViewModel {
  activeView: StrategyWorkspaceMode
}

export interface StrategyWorkspaceEmptyStateViewModel {
  title: string
  description: string
}

export interface StrategyWorkspaceSectionHeaderViewModel {
  title: string
  subtitle: string
}

export interface StrategyFailureModeSelectorItemViewModel {
  nodeId: string
  title: string
  exposureLabel: string
  isSelected: boolean
}

export interface StrategyComparisonStatViewModel {
  label: string
  value: string
}

export interface StrategyComparisonPanelViewModel {
  title: string
  stats: StrategyComparisonStatViewModel[]
  residualWidthPercent: number
  untreatedLabel: string
  residualLabel: string
}

export interface StrategyDecisionDetailMetricViewModel {
  label: string
  value: string
}

export interface StrategyDecisionExpandedDetailViewModel {
  detailId: string
  titleLabel: string
  title: string
  whyStatement: string
  tradeoffStatement: string
  weaknessFlags: string[]
  metrics: StrategyDecisionDetailMetricViewModel[]
  editTaskNodeId: string
}

export interface StrategyDecisionCardViewModel {
  taskNodeId: string
  status: string
  statusLabel: string
  strategyType: string
  isRecommendedLead: boolean
  isSelected: boolean
  isExpanded: boolean
  title: string
  isEnabled: boolean
  inclusionLabel: string
  residualLabel: string
  residualValue: string
  costValue: string
  detailId: string
}

export interface StrategyDecisionWorkspaceViewModel {
  tabs: StrategyWorkspaceTabsViewModel
  selectorItems: StrategyFailureModeSelectorItemViewModel[]
  cards: StrategyDecisionCardViewModel[]
  expandedDetail: StrategyDecisionExpandedDetailViewModel | null
  comparison: StrategyComparisonPanelViewModel | null
}

export interface StrategyAuditHeaderFilterPopoverViewModel {
  kind: "boolean" | "exact" | "contains"
  columnKey: string
  label: string
  currentValue: string
  exactMatchOptions?: string[]
}

export interface StrategyAuditHeaderViewModel {
  key: string
  label: string
  isFiltered: boolean
  isOpen: boolean
  filterPopover: StrategyAuditHeaderFilterPopoverViewModel | null
}

export interface StrategyAuditOptionsColumnViewModel {
  key: string
  label: string
  isVisible: boolean
  canMoveLeft: boolean
  canMoveRight: boolean
}

export interface StrategyAuditToolbarViewModel {
  searchQuery: string
  filteredCount: number
  totalCount: number
  optionsOpen: boolean
  orderedColumns: StrategyAuditOptionsColumnViewModel[]
}

export interface StrategyAuditCellViewModel {
  kind: "editableCheckbox" | "editableText" | "readonlyCheckbox" | "readonlyText"
  taskNodeId: string
  columnKey: string
  value: string
  checked: boolean
  disabled: boolean
  inputType: "text" | "number"
}

export interface StrategyAuditRowViewModel {
  taskNodeId: string
  isSelected: boolean
  cells: StrategyAuditCellViewModel[]
}

export interface StrategyAuditWorkspaceViewModel {
  tabs: StrategyWorkspaceTabsViewModel
  toolbar: StrategyAuditToolbarViewModel
  header: StrategyWorkspaceSectionHeaderViewModel
  headers: StrategyAuditHeaderViewModel[]
  rows: StrategyAuditRowViewModel[]
}

export type StrategyWorkspaceViewModel =
  | {
      kind: "noSelection"
      emptyState: StrategyWorkspaceEmptyStateViewModel
    }
  | {
      kind: "noFailureModes"
      tabs: StrategyWorkspaceTabsViewModel
      emptyState: StrategyWorkspaceEmptyStateViewModel
    }
  | {
      kind: "noRows"
      tabs: StrategyWorkspaceTabsViewModel
      header: StrategyWorkspaceSectionHeaderViewModel
      emptyState: StrategyWorkspaceEmptyStateViewModel
    }
  | {
      kind: "decision"
      decision: StrategyDecisionWorkspaceViewModel
    }
  | {
      kind: "audit"
      audit: StrategyAuditWorkspaceViewModel
    }
