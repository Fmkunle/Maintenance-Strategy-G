import { describe, expect, it } from "vitest"
import { renderInspectPanel } from "./inspect"
import { renderNodeActions } from "./actions"
import type { NodeActionsViewModel, NodeInspectPanelViewModel } from "./types"

describe("node-panel renderers", () => {
  it("renders inspect panel sections and values", () => {
    const viewModel: NodeInspectPanelViewModel = {
      sections: [
        {
          title: "Definition",
          gridVariant: "default",
          items: [
            { label: "Type", value: "Equipment", isWide: false, isEmpty: false },
            { label: "Path", value: "Area / System / Asset", isWide: true, isEmpty: false }
          ]
        },
        {
          title: "Context",
          gridVariant: "triple",
          items: [{ label: "Children", value: "3", isWide: false, isEmpty: false }]
        }
      ]
    }

    const html = renderInspectPanel(viewModel)

    expect(html).toContain("node-inspect-panel")
    expect(html).toContain("Definition")
    expect(html).toContain("node-inspect-panel__grid--triple")
    expect(html).toContain("Area / System / Asset")
  })

  it("renders inspect panel warning notices for task nodes", () => {
    const viewModel: NodeInspectPanelViewModel = {
      sections: [
        {
          title: "Task Details",
          gridVariant: "triple",
          items: [{ label: "Task Type", value: "PM", isWide: false, isEmpty: false }],
          notice: "Secondary action inspection link is missing."
        }
      ]
    }

    const html = renderInspectPanel(viewModel)

    expect(html).toContain('class="maintenance-notice"')
    expect(html).toContain("Secondary action inspection link is missing.")
  })

  it("renders inspect-mode actions with existing hooks", () => {
    const viewModel: NodeActionsViewModel = {
      kind: "inspect",
      editNodeId: "node-1"
    }

    const html = renderNodeActions(viewModel)

    expect(html).toContain('data-close-node-inspect="true"')
    expect(html).toContain('data-open-node-inspect-editor="node-1"')
  })

  it("renders selected-node actions with menu and edit hooks", () => {
    const viewModel: NodeActionsViewModel = {
      kind: "selected",
      equipmentInfoAction: { nodeId: "eq-1", menuOpen: true },
      failureModeNodeId: "cause-1",
      taskNodeId: "pm-1",
      taskFailureModeNodeId: "cause-2",
      deleteNodeId: "node-9"
    }

    const html = renderNodeActions(viewModel)

    expect(html).toContain('id="equipmentInfoMenuButton"')
    expect(html).toContain('data-toggle-equipment-info-menu="eq-1"')
    expect(html).toContain('data-open-equipment-info="view"')
    expect(html).toContain('data-open-failure-mode-config="cause-1"')
    expect(html).toContain('data-open-task-editor="pm-1"')
    expect(html).toContain('data-delete-node="node-9"')
  })

  it("renders hidden action state as empty markup", () => {
    const html = renderNodeActions({ kind: "hidden" })
    expect(html).toBe("")
  })
})
