export type NodeInspectGridVariant = "default" | "triple"

export interface NodeInspectFieldViewModel {
  label: string
  value: string
  isWide: boolean
  isEmpty: boolean
}

export interface NodeInspectSectionViewModel {
  title: string
  gridVariant: NodeInspectGridVariant
  items: NodeInspectFieldViewModel[]
  notice?: string
}

export interface NodeInspectPanelViewModel {
  sections: NodeInspectSectionViewModel[]
}

export interface NodeInspectActionsViewModel {
  kind: "inspect"
  editNodeId: string
}

export interface NodeSelectedEquipmentInfoActionViewModel {
  nodeId: string
  menuOpen: boolean
}

export interface NodeSelectedActionsViewModel {
  kind: "selected"
  equipmentInfoAction: NodeSelectedEquipmentInfoActionViewModel | null
  failureModeNodeId: string
  taskNodeId: string
  taskFailureModeNodeId: string
  deleteNodeId: string
}

export interface NodeHiddenActionsViewModel {
  kind: "hidden"
}

export type NodeActionsViewModel = NodeHiddenActionsViewModel | NodeInspectActionsViewModel | NodeSelectedActionsViewModel
