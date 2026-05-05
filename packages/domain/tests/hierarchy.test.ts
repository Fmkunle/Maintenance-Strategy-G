import { describe, expect, it } from "vitest"
import {
  extractLocalCodeSegment,
  findNodeInfo,
  getFirstNode,
  getFullCodeFromPath,
  getNearestAncestorNodeFromPath,
  getParentFullCodeFromPath,
  getParentPath,
  joinInheritedCode,
  removeNodeFromHierarchy
} from "../src"

const hierarchy = [
  {
    id: "plant-1",
    type: "plant",
    code: "MEX",
    children: [
      {
        id: "equipment-1",
        type: "equipment",
        code: "CV01",
        children: [
          {
            id: "cause-1",
            type: "cause",
            code: "1A.1",
            children: [{ id: "pm-1", type: "pm", code: "PM01", children: [] }]
          }
        ]
      }
    ]
  }
]

describe("hierarchy helpers", () => {
  it("finds a nested node and returns ancestry context", () => {
    const nodeInfo = findNodeInfo(hierarchy, "pm-1")

    expect(nodeInfo?.node.id).toBe("pm-1")
    expect(nodeInfo?.parent?.id).toBe("cause-1")
    expect(nodeInfo?.path.map((node) => node.id)).toEqual(["plant-1", "equipment-1", "cause-1", "pm-1"])
  })

  it("resolves the nearest ancestor from a node path", () => {
    const nodeInfo = findNodeInfo(hierarchy, "pm-1")
    const ancestor = getNearestAncestorNodeFromPath(nodeInfo?.path || [], "cause")

    expect(ancestor?.id).toBe("cause-1")
  })

  it("rebuilds a full inherited code from the node path", () => {
    const nodeInfo = findNodeInfo(hierarchy, "pm-1")

    expect(getFullCodeFromPath(nodeInfo?.path || [])).toBe("MEX-CV01.1A.1.PM01")
  })

  it("derives the parent path and parent full code", () => {
    const nodeInfo = findNodeInfo(hierarchy, "pm-1")
    const parentPath = getParentPath(nodeInfo?.path || [])

    expect(parentPath.map((node) => node.id)).toEqual(["plant-1", "equipment-1", "cause-1"])
    expect(getParentFullCodeFromPath(nodeInfo?.path || [])).toBe("MEX-CV01.1A.1")
  })

  it("extracts a local code segment from an inherited code", () => {
    expect(extractLocalCodeSegment("MEX-CV01.1A.1.PM01", "MEX-CV01.1A.1", "pm")).toBe("PM01")
    expect(extractLocalCodeSegment("MEX-CV01", "", "equipment")).toBe("MEX-CV01")
  })

  it("removes a node from the hierarchy without disturbing siblings", () => {
    const updatedHierarchy = removeNodeFromHierarchy(hierarchy, "cause-1")

    expect(findNodeInfo(updatedHierarchy, "cause-1")).toBeNull()
    expect(findNodeInfo(updatedHierarchy, "equipment-1")?.node.id).toBe("equipment-1")
  })

  it("returns the first leafward node for fallback selection", () => {
    expect(getFirstNode(hierarchy)?.id).toBe("pm-1")
  })

  it("joins inherited codes using strategy separators for strategy nodes", () => {
    expect(joinInheritedCode("MEX-CV01", "1A.1", "cause")).toBe("MEX-CV01.1A.1")
    expect(joinInheritedCode("MEX", "CV01", "equipment")).toBe("MEX-CV01")
  })
})
