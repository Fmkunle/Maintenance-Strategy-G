import type {
  FailureModeDbJson,
  FailureModeEffectRow,
  FailureModeTaskRow,
  HierarchyNodeInfo,
  HierarchyNodeLike
} from "@maint/contracts"
import { findNodeInfo, getNearestAncestorNodeFromPath } from "../hierarchy/nodes"

const failureModeDbJsonNumberFormatter = new Intl.NumberFormat("en-AU", {
  maximumFractionDigits: 1
})

export const preservedFailureModeDbJsonFieldKeys = [
  "Failure Mode Cost Benefit Ratio",
  "Failure Mode Total Cost",
  "Failure Mode Effect Cost",
  "Failure Mode Corrective Down Time",
  "Failure Mode Corrective Event Count",
  "Failure Mode Corrective Cost",
  "Failure Mode Planned Cost",
  "Failure Mode Secondary Action Cost",
  "Failure Mode Inspection Cost",
  "Failure Mode Failure Rate",
  "Failure Mode Availability"
] as const

type PreservedFailureModeDbJsonFieldKey = (typeof preservedFailureModeDbJsonFieldKeys)[number]

export interface FailureModePersistenceNode extends HierarchyNodeLike {
  equipmentContext?: Record<string, unknown> | null
  failureConfig?: Record<string, unknown> | null
  cmConfig?: Record<string, unknown> | null
  pmConfig?: Record<string, unknown> | null
  insConfig?: Record<string, unknown> | null
  children?: FailureModePersistenceNode[]
}

export interface FailureModeDecisionComparisonSnapshot {
  correctiveEventCount?: number | null
  correctiveCost?: number | null
  plannedCost?: number | null
  secondaryActionCost?: number | null
  inspectionCost?: number | null
}

export interface FailureModeDecisionSnapshotResult {
  comparison?: FailureModeDecisionComparisonSnapshot | null
}

export interface FailureModeDbJsonBuilderDeps<TNode extends FailureModePersistenceNode = FailureModePersistenceNode> {
  normalizeCauseFailureConfig: (value: unknown) => Record<string, unknown>
  normalizeInsConfig: (value: unknown) => Record<string, unknown>
  normalizePmConfig: (value: unknown) => Record<string, unknown>
  normalizeCmConfig: (value: unknown) => Record<string, unknown>
  getSecondaryActionInspectionLinkState: (
    failureModeInfo: Pick<HierarchyNodeInfo<TNode>, "node" | "path">,
    inspectionNodeId: string,
    isSecondaryAction: boolean
  ) => { linkedInspectionName?: string | null } | null
  getInspectionSecondaryActionPmLinkState: (
    failureModeInfo: Pick<HierarchyNodeInfo<TNode>, "node" | "path">,
    inspectionNode: TNode
  ) => { hasSecondaryAction?: boolean | null; linkedPmName?: string | null } | null
  getNodeDescription: (node: TNode | null | undefined, fallback?: string) => string
  getNodeFullCode: (node: TNode | null | undefined, path?: TNode[]) => string
  getNodeCodeValue: (node: TNode | null | undefined, fallback?: string) => string
}

export interface FailureModeDecisionSnapshotDeps<TNode extends FailureModePersistenceNode = FailureModePersistenceNode> {
  normalizeCauseFailureConfig: (value: unknown) => Record<string, unknown>
  getFailureModeDecisionData: (failureModeInfo: HierarchyNodeInfo<TNode>, hierarchyNodes?: TNode[]) => FailureModeDecisionSnapshotResult | null
}

export type FailureModePersistenceMapperDeps<TNode extends FailureModePersistenceNode = FailureModePersistenceNode> =
  FailureModeDbJsonBuilderDeps<TNode> & FailureModeDecisionSnapshotDeps<TNode>

/**
 * Returns the failure-mode DB JSON currently attached to the nearest `cause` node.
 *
 * This stays path-based because the current workspace treats `path` as the canonical
 * context object when resolving effects, tasks, and selected-node strategy details.
 */
export const getFailureModeJsonForPath = <TNode extends FailureModePersistenceNode>(path: TNode[] = []): FailureModeDbJson | null => {
  const failureModeNode = getNearestAncestorNodeFromPath(path, "cause")
  const dbJson = failureModeNode?.failureConfig?.dbJson

  return dbJson && typeof dbJson === "object" ? (dbJson as FailureModeDbJson) : null
}

/**
 * Effect rows are position-based because the persisted `effects` array mirrors the
 * visible order of effect children rather than storing child ids in the DB JSON.
 */
export const getEffectJsonEntryForNode = <TNode extends FailureModePersistenceNode>(
  path: TNode[] = [],
  node: TNode | null = null
): FailureModeEffectRow | null => {
  const failureModeNode = getNearestAncestorNodeFromPath(path, "cause")
  const dbJson = getFailureModeJsonForPath(path)
  if (!failureModeNode || !dbJson || !Array.isArray(dbJson.effects) || !node) {
    return null
  }

  const effectChildren = (failureModeNode.children || []).filter((child) => child.type === "effect")
  const effectIndex = effectChildren.findIndex((child) => child.id === node.id)
  return effectIndex >= 0 ? dbJson.effects[effectIndex] || null : null
}

/**
 * Task rows are also position-based so the existing DB JSON contract can remain
 * unchanged while the domain layer takes ownership of the mapping logic.
 */
export const getTaskJsonEntryForNode = <TNode extends FailureModePersistenceNode>(
  path: TNode[] = [],
  node: TNode | null = null
): FailureModeTaskRow | null => {
  const failureModeNode = getNearestAncestorNodeFromPath(path, "cause")
  const dbJson = getFailureModeJsonForPath(path)
  if (!failureModeNode || !dbJson || !Array.isArray(dbJson.tasks) || !node) {
    return null
  }

  const taskChildren = (failureModeNode.children || []).filter((child) => ["cm", "pm", "ins"].includes(child.type))
  const taskIndex = taskChildren.findIndex((child) => child.id === node.id)
  return taskIndex >= 0 ? dbJson.tasks[taskIndex] || null : null
}

/**
 * The builder preserves these legacy snapshot/manual fields so a rebuild of
 * structural rows does not discard values that are derived or maintained elsewhere.
 */
export const getPreservedFailureModeDbJsonFields = <TNode extends FailureModePersistenceNode>(
  causeNode: TNode | null | undefined
): Partial<Pick<FailureModeDbJson, PreservedFailureModeDbJsonFieldKey>> => {
  const existingDbJson = causeNode?.failureConfig?.dbJson
  if (!existingDbJson || typeof existingDbJson !== "object") {
    return {}
  }

  return preservedFailureModeDbJsonFieldKeys.reduce((fields, key) => {
    fields[key] = Object.prototype.hasOwnProperty.call(existingDbJson, key)
      ? (existingDbJson as FailureModeDbJson)[key]
      : ""
    return fields
  }, {} as Partial<Pick<FailureModeDbJson, PreservedFailureModeDbJsonFieldKey>>)
}

/**
 * Snapshot values stay formatted as strings because the current DB JSON contract
 * is used directly by legacy table/edit surfaces without an intermediate serializer.
 */
export const formatFailureModeDerivedSnapshotValue = (value: unknown): string => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) {
    return ""
  }

  return failureModeDbJsonNumberFormatter.format(Math.max(0, numericValue))
}

export const getFailureModeRedundancyFactor = <TNode extends FailureModePersistenceNode>(equipmentNode: TNode | null): string => {
  if (!equipmentNode?.equipmentContext) {
    return ""
  }

  const { redundancyMode = "", redundancyPercent = "" } = equipmentNode.equipmentContext as Record<string, unknown>
  if (String(redundancyMode || "").trim() === "Custom" && String(redundancyPercent || "").trim()) {
    return `${redundancyPercent}%`
  }

  return String(redundancyMode || "").trim()
}

export const buildFailureModeDbJson = <TNode extends FailureModePersistenceNode>(
  causeNode: TNode,
  path: TNode[] = [],
  deps: FailureModeDbJsonBuilderDeps<TNode>
): FailureModeDbJson => {
  const failureConfig = deps.normalizeCauseFailureConfig(causeNode?.failureConfig)
  const preservedFields = getPreservedFailureModeDbJsonFields(causeNode)
  const equipmentNode = getNearestAncestorNodeFromPath(path, "equipment")
  const equipmentPath =
    equipmentNode && Array.isArray(path)
      ? path.slice(0, path.findIndex((node) => node.id === equipmentNode.id) + 1)
      : []

  const effectRows: FailureModeEffectRow[] = (causeNode?.children || [])
    .filter((child) => child.type === "effect")
    .map((effectNode) => ({
      "Failure Mode Effect Effect": deps.getNodeDescription(effectNode as TNode),
      "Failure Mode Effect Redundancy Factor": getFailureModeRedundancyFactor(equipmentNode as TNode | null)
    }))

  const taskRows: FailureModeTaskRow[] = (causeNode?.children || [])
    .filter((child) => ["cm", "pm", "ins"].includes(child.type))
    .map((taskNode) => {
      if (taskNode.type === "ins") {
        const config = deps.normalizeInsConfig(taskNode.insConfig)
        const secondaryActionLinkState = deps.getInspectionSecondaryActionPmLinkState({ node: causeNode, path }, taskNode as TNode)
        return {
          "Task Name": deps.getNodeCodeValue(taskNode as TNode),
          "Task Strategy": "INS",
          "Scheduled Task Type": String(config.scheduledTaskType || "").trim(),
          "Scheduled Task Is Enabled": Boolean(config.isEnabled),
          "Scheduled Task Do Not Deliver": Boolean(config.doNotDeliver),
          "Scheduled Task Is Secondary Action": Boolean(secondaryActionLinkState?.hasSecondaryAction),
          "Scheduled Task Description": deps.getNodeDescription(taskNode as TNode),
          "Scheduled Task Secondary Inspection":
            Boolean(secondaryActionLinkState?.hasSecondaryAction) ? secondaryActionLinkState?.linkedPmName || "" : "",
          "Scheduled Task Interval": String(config.interval || "").trim(),
          "Scheduled Task Interval Short Description": String(config.intervalShortDescription || "").trim(),
          "Scheduled Task PF Interval": String(config.pfInterval || "").trim(),
          "Scheduled Task Detection Probability": String(config.detectionProbability || "").trim(),
          "Scheduled Task Duration": String(config.duration || "").trim(),
          "Scheduled Task Labor Labor": String(config.laborLabor || "").trim()
        }
      }

      const config =
        taskNode.type === "pm" ? deps.normalizePmConfig(taskNode.pmConfig) : deps.normalizeCmConfig(taskNode.cmConfig)

      return {
        "Task Name": deps.getNodeCodeValue(taskNode as TNode),
        "Task Strategy": taskNode.type.toUpperCase(),
        "Scheduled Task Type": String(config.type || "").trim(),
        "Scheduled Task Is Enabled": Boolean(config.isEnabled),
        "Scheduled Task Do Not Deliver": Boolean(config.doNotDeliver),
        "Scheduled Task Is Secondary Action": false,
        "Scheduled Task Description": deps.getNodeDescription(taskNode as TNode),
        "Scheduled Task Secondary Inspection": "",
        "Scheduled Task Interval": String(config.intervalHours || "").trim(),
        "Scheduled Task Interval Short Description": String(config.intervalShortDescription || "").trim(),
        "Scheduled Task PF Interval": String(config.pfInterval || "").trim(),
        "Scheduled Task Detection Probability": String(config.detectionProbability || "").trim(),
        "Scheduled Task Duration": String(config.durationHours || "").trim(),
        "Scheduled Task Labor Labor": String(config.labourDurationHours || "").trim()
      }
    })

  return {
    "Physical Asset Name": equipmentNode ? deps.getNodeFullCode(equipmentNode as TNode, equipmentPath as TNode[]) : "",
    "Physical Asset Description": equipmentNode ? deps.getNodeDescription(equipmentNode as TNode) : "",
    "Component Name": String(failureConfig.componentName || "").trim(),
    "Failure Mode Name": deps.getNodeFullCode(causeNode, path),
    "Failure Mode Description": deps.getNodeDescription(causeNode),
    "Failure Mode Is Dormant": Boolean(failureConfig.isDormant),
    "Failure Mode Demand Frequency": String(failureConfig.demandFrequency || "").trim(),
    "Failure Mode Distribution": String(failureConfig.distribution || "").trim(),
    "Failure Mode MTTF": String(failureConfig.mttf || "").trim(),
    "Failure Mode Eta 1": String(failureConfig.eta1 || "").trim(),
    "Failure Mode Beta 1": String(failureConfig.beta1 || "").trim(),
    "Failure Mode Gamma 1": String(failureConfig.gamma1 || "").trim(),
    "Failure Mode Alarm Is Enabled": Boolean(failureConfig.alarmIsEnabled),
    "Failure Mode Alarm Description": String(failureConfig.alarmDescription || "").trim(),
    "Failure Mode Alarm PF Interval": String(failureConfig.alarmPfInterval || "").trim(),
    "Failure Mode Alarm Detection Probability": String(failureConfig.alarmDetectionProbability || "").trim(),
    "Failure Mode Cost Benefit Ratio": preservedFields["Failure Mode Cost Benefit Ratio"] || "",
    "Failure Mode Total Cost": preservedFields["Failure Mode Total Cost"] || "",
    "Failure Mode Effect Cost": preservedFields["Failure Mode Effect Cost"] || "",
    "Failure Mode Corrective Down Time": preservedFields["Failure Mode Corrective Down Time"] || "",
    "Failure Mode Corrective Event Count": preservedFields["Failure Mode Corrective Event Count"] || "",
    "Failure Mode Corrective Cost": preservedFields["Failure Mode Corrective Cost"] || "",
    "Failure Mode Planned Cost": preservedFields["Failure Mode Planned Cost"] || "",
    "Failure Mode Secondary Action Cost": preservedFields["Failure Mode Secondary Action Cost"] || "",
    "Failure Mode Inspection Cost": preservedFields["Failure Mode Inspection Cost"] || "",
    "Failure Mode Failure Rate": preservedFields["Failure Mode Failure Rate"] || "",
    "Failure Mode Availability": preservedFields["Failure Mode Availability"] || "",
    effects: effectRows,
    tasks: taskRows
  }
}

export const refreshFailureModeDbJsonBaseForHierarchy = <TNode extends FailureModePersistenceNode>(
  nodes: TNode[],
  parentPath: TNode[] = [],
  deps: FailureModeDbJsonBuilderDeps<TNode>
): void => {
  nodes.forEach((node) => {
    const path = [...parentPath, node]
    if (node.type === "cause") {
      node.failureConfig = {
        ...deps.normalizeCauseFailureConfig(node.failureConfig),
        dbJson: buildFailureModeDbJson(node, path, deps)
      }
    }

    if (Array.isArray(node.children) && node.children.length) {
      refreshFailureModeDbJsonBaseForHierarchy(node.children as TNode[], path, deps)
    }
  })
}

export const applyFailureModeDecisionSnapshotsForHierarchy = <TNode extends FailureModePersistenceNode>(
  nodes: TNode[],
  hierarchyNodes: TNode[] = nodes,
  deps: FailureModeDecisionSnapshotDeps<TNode>
): void => {
  nodes.forEach((node) => {
    if (node.type === "cause") {
      const failureModeInfo = findNodeInfo(hierarchyNodes, node.id)
      const decisionData = failureModeInfo ? deps.getFailureModeDecisionData(failureModeInfo, hierarchyNodes) : null
      if (decisionData?.comparison && node.failureConfig?.dbJson && typeof node.failureConfig.dbJson === "object") {
        node.failureConfig = {
          ...deps.normalizeCauseFailureConfig(node.failureConfig),
          dbJson: {
            ...(node.failureConfig.dbJson as FailureModeDbJson),
            "Failure Mode Corrective Event Count": formatFailureModeDerivedSnapshotValue(decisionData.comparison.correctiveEventCount),
            "Failure Mode Corrective Cost": formatFailureModeDerivedSnapshotValue(decisionData.comparison.correctiveCost),
            "Failure Mode Planned Cost": formatFailureModeDerivedSnapshotValue(decisionData.comparison.plannedCost),
            "Failure Mode Secondary Action Cost": formatFailureModeDerivedSnapshotValue(decisionData.comparison.secondaryActionCost),
            "Failure Mode Inspection Cost": formatFailureModeDerivedSnapshotValue(decisionData.comparison.inspectionCost)
          }
        }
      }
    }

    if (Array.isArray(node.children) && node.children.length) {
      applyFailureModeDecisionSnapshotsForHierarchy(node.children as TNode[], hierarchyNodes, deps)
    }
  })
}

export const refreshFailureModeDbJsonForHierarchy = <TNode extends FailureModePersistenceNode>(
  nodes: TNode[],
  deps: FailureModePersistenceMapperDeps<TNode>
): void => {
  refreshFailureModeDbJsonBaseForHierarchy(nodes, [], deps)
  applyFailureModeDecisionSnapshotsForHierarchy(nodes, nodes, deps)
}
