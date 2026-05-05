import { describe, expect, it } from "vitest"
import type { FailureModeDbJson, HierarchyNodeInfo } from "@maint/contracts"
import {
  applyFailureModeDecisionSnapshotsForHierarchy,
  buildFailureModeDbJson,
  formatFailureModeDerivedSnapshotValue,
  getEffectJsonEntryForNode,
  getFailureModeJsonForPath,
  getTaskJsonEntryForNode,
  refreshFailureModeDbJsonForHierarchy,
  type FailureModePersistenceNode
} from "../src"

const createMapperDeps = () => ({
  normalizeCauseFailureConfig: (value: unknown) => ({
    componentName: "",
    demandFrequency: "",
    distribution: "",
    mttf: "",
    eta1: "",
    beta1: "",
    gamma1: "",
    isDormant: false,
    alarmIsEnabled: false,
    alarmDescription: "",
    alarmPfInterval: "",
    alarmDetectionProbability: "",
    ...(typeof value === "object" && value ? (value as Record<string, unknown>) : {})
  }),
  normalizeInsConfig: (value: unknown) => ({
    scheduledTaskType: "",
    isEnabled: false,
    doNotDeliver: false,
    interval: "",
    intervalShortDescription: "",
    pfInterval: "",
    detectionProbability: "",
    duration: "",
    laborLabor: "",
    ...(typeof value === "object" && value ? (value as Record<string, unknown>) : {})
  }),
  normalizePmConfig: (value: unknown) => ({
    type: "",
    isEnabled: false,
    doNotDeliver: false,
    isSecondaryAction: false,
    secondaryActionInspectionNodeId: "",
    intervalHours: "",
    intervalShortDescription: "",
    pfInterval: "",
    detectionProbability: "",
    durationHours: "",
    labourDurationHours: "",
    ...(typeof value === "object" && value ? (value as Record<string, unknown>) : {})
  }),
  normalizeCmConfig: (value: unknown) => ({
    type: "",
    isEnabled: false,
    doNotDeliver: false,
    intervalHours: "",
    intervalShortDescription: "",
    pfInterval: "",
    detectionProbability: "",
    durationHours: "",
    labourDurationHours: "",
    ...(typeof value === "object" && value ? (value as Record<string, unknown>) : {})
  }),
  getSecondaryActionInspectionLinkState: () => ({ linkedInspectionName: "INS-001" }),
  getNodeDescription: (node: FailureModePersistenceNode | null | undefined, fallback = "") =>
    String(node?.description || "").trim() || fallback,
  getNodeFullCode: (node: FailureModePersistenceNode | null | undefined, path: FailureModePersistenceNode[] = []) =>
    String(node?.name || "").trim() || path.map((entry) => String(entry.code || "").trim()).filter(Boolean).join("-"),
  getNodeCodeValue: (node: FailureModePersistenceNode | null | undefined, fallback = "") =>
    String(node?.code || "").trim() || fallback,
  getFailureModeDecisionData: (_info: HierarchyNodeInfo<FailureModePersistenceNode>) => ({
    comparison: {
      correctiveEventCount: 2.25,
      correctiveCost: 1200,
      plannedCost: 3400.5,
      secondaryActionCost: 500,
      inspectionCost: 275.25
    }
  })
})

const buildHierarchy = (): FailureModePersistenceNode[] => [
  {
    id: "equipment-1",
    type: "equipment",
    code: "EQ01",
    name: "EQ01",
    description: "Conveyor motor",
    equipmentContext: {
      redundancyMode: "Custom",
      redundancyPercent: "25"
    },
    children: [
      {
        id: "cause-1",
        type: "cause",
        code: "FM01",
        name: "FM01",
        description: "Motor overheating",
        failureConfig: {
          componentName: "Motor",
          demandFrequency: "12",
          distribution: "Age related",
          mttf: "1000",
          eta1: "1",
          beta1: "2",
          gamma1: "3",
          isDormant: false,
          alarmIsEnabled: true,
          alarmDescription: "High temp alarm",
          alarmPfInterval: "24",
          alarmDetectionProbability: "0.6",
          dbJson: {
            "Failure Mode Cost Benefit Ratio": "1.2",
            "Failure Mode Total Cost": "1000",
            "Failure Mode Effect Cost": "800",
            "Failure Mode Corrective Down Time": "8",
            "Failure Mode Corrective Event Count": "9",
            "Failure Mode Corrective Cost": "10",
            "Failure Mode Planned Cost": "11",
            "Failure Mode Secondary Action Cost": "12",
            "Failure Mode Inspection Cost": "13",
            "Failure Mode Failure Rate": "14",
            "Failure Mode Availability": "15",
            effects: [],
            tasks: []
          } satisfies FailureModeDbJson
        },
        children: [
          { id: "effect-1", type: "effect", code: "E1", description: "Primary effect", children: [] },
          { id: "effect-2", type: "effect", code: "E2", description: "Secondary effect", children: [] },
          {
            id: "ins-1",
            type: "ins",
            code: "INS-001",
            description: "Inspect motor",
            insConfig: {
              scheduledTaskType: "Inspection",
              isEnabled: true,
              interval: "24",
              intervalShortDescription: "monthly",
              pfInterval: "48",
              detectionProbability: "0.8",
              duration: "1",
              laborLabor: "1"
            },
            children: []
          },
          {
            id: "pm-1",
            type: "pm",
            code: "PM-001",
            description: "Replace motor",
            pmConfig: {
              type: "PM",
              isEnabled: true,
              doNotDeliver: false,
              isSecondaryAction: true,
              secondaryActionInspectionNodeId: "ins-1",
              intervalHours: "100",
              intervalShortDescription: "quarterly",
              pfInterval: "72",
              detectionProbability: "0.4",
              durationHours: "5",
              labourDurationHours: "3"
            },
            children: []
          },
          {
            id: "cm-1",
            type: "cm",
            code: "CM-001",
            description: "Repair motor",
            cmConfig: {
              type: "CM",
              isEnabled: false,
              doNotDeliver: true,
              intervalHours: "",
              intervalShortDescription: "",
              pfInterval: "",
              detectionProbability: "",
              durationHours: "4",
              labourDurationHours: "2"
            },
            children: []
          }
        ]
      }
    ]
  }
]

describe("persistence mappers", () => {
  it("returns the attached failure-mode DB JSON for a path", () => {
    const hierarchy = buildHierarchy()
    const causePath = [hierarchy[0], hierarchy[0].children?.[0]].filter(Boolean) as FailureModePersistenceNode[]

    expect(getFailureModeJsonForPath(causePath)?.["Failure Mode Total Cost"]).toBe("1000")
  })

  it("resolves effect and task rows by child ordering", () => {
    const hierarchy = buildHierarchy()
    const deps = createMapperDeps()
    const causeNode = hierarchy[0].children?.[0] as FailureModePersistenceNode
    const causePath = [hierarchy[0], causeNode]
    causeNode.failureConfig = {
      ...(causeNode.failureConfig || {}),
      dbJson: buildFailureModeDbJson(causeNode, causePath, deps)
    }

    expect(getEffectJsonEntryForNode([...causePath, causeNode.children?.[1] as FailureModePersistenceNode], causeNode.children?.[1] as FailureModePersistenceNode)?.["Failure Mode Effect Effect"]).toBe("Secondary effect")
    expect(getTaskJsonEntryForNode([...causePath, causeNode.children?.[3] as FailureModePersistenceNode], causeNode.children?.[3] as FailureModePersistenceNode)?.["Task Name"]).toBe("PM-001")
  })

  it("rebuilds DB JSON while preserving legacy snapshot fields", () => {
    const hierarchy = buildHierarchy()
    const deps = createMapperDeps()
    const causeNode = hierarchy[0].children?.[0] as FailureModePersistenceNode
    const dbJson = buildFailureModeDbJson(causeNode, [hierarchy[0], causeNode], deps)

    expect(dbJson["Failure Mode Description"]).toBe("Motor overheating")
    expect(dbJson["Failure Mode Corrective Cost"]).toBe("10")
    expect(dbJson.effects).toHaveLength(2)
    expect(dbJson.tasks).toHaveLength(3)
    expect(dbJson.tasks[1]["Scheduled Task Secondary Inspection"]).toBe("INS-001")
  })

  it("formats and applies derived snapshot values into the db json contract", () => {
    const hierarchy = buildHierarchy()
    const deps = createMapperDeps()
    const causeNode = hierarchy[0].children?.[0] as FailureModePersistenceNode
    causeNode.failureConfig = {
      ...(causeNode.failureConfig || {}),
      dbJson: buildFailureModeDbJson(causeNode, [hierarchy[0], causeNode], deps)
    }

    applyFailureModeDecisionSnapshotsForHierarchy(hierarchy, hierarchy, deps)

    const dbJson = causeNode.failureConfig?.dbJson as FailureModeDbJson
    expect(dbJson["Failure Mode Corrective Event Count"]).toBe(formatFailureModeDerivedSnapshotValue(2.25))
    expect(dbJson["Failure Mode Planned Cost"]).toBe(formatFailureModeDerivedSnapshotValue(3400.5))
    expect(dbJson["Failure Mode Inspection Cost"]).toBe(formatFailureModeDerivedSnapshotValue(275.25))
  })

  it("refreshes base rows and derived snapshots across the hierarchy", () => {
    const hierarchy = buildHierarchy()
    const deps = createMapperDeps()

    refreshFailureModeDbJsonForHierarchy(hierarchy, deps)

    const causeNode = hierarchy[0].children?.[0] as FailureModePersistenceNode
    const dbJson = causeNode.failureConfig?.dbJson as FailureModeDbJson
    expect(dbJson.tasks[0]["Task Name"]).toBe("INS-001")
    expect(dbJson["Failure Mode Secondary Action Cost"]).toBe(formatFailureModeDerivedSnapshotValue(500))
  })
})
