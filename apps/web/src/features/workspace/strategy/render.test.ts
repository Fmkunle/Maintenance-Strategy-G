import { describe, expect, it } from "vitest"
import { renderStrategyWorkspace } from "./render"
import type { StrategyWorkspaceViewModel } from "./types"

describe("strategy workspace renderers", () => {
  it("renders decision view hooks", () => {
    const viewModel: StrategyWorkspaceViewModel = {
      kind: "decision",
      decision: {
        tabs: { activeView: "decision" },
        selectorItems: [{ nodeId: "fm-1", title: "FM-1", exposureLabel: "$100K 10-year exposure", isSelected: true }],
        cards: [
          {
            taskNodeId: "pm-1",
            status: "enabled",
            statusLabel: "Enabled",
            strategyType: "PM",
            isRecommendedLead: true,
            isSelected: true,
            isExpanded: true,
            title: "Replace motor",
            isEnabled: true,
            inclusionLabel: "Included",
            residualLabel: "10-year residual exposure",
            residualValue: "$10K",
            costValue: "$5K",
            detailId: "strategy-option-details-drawer"
          }
        ],
        expandedDetail: {
          detailId: "strategy-option-details-drawer",
          titleLabel: "Task details",
          title: "Replace motor",
          whyStatement: "Why",
          tradeoffStatement: "Trade-off",
          weaknessFlags: ["Watch-out"],
          metrics: [{ label: "Task code", value: "PM-1" }],
          editTaskNodeId: "pm-1"
        },
        comparison: {
          title: "Selection",
          stats: [{ label: "Included", value: "1 / 1" }],
          residualWidthPercent: 20,
          untreatedLabel: "Untreated",
          residualLabel: "After selection"
        }
      }
    }

    const html = renderStrategyWorkspace(viewModel)

    expect(html).toContain('data-strategy-view="decision"')
    expect(html).toContain('data-select-failure-mode="fm-1"')
    expect(html).toContain('data-strategy-card-expand="pm-1"')
    expect(html).toContain('data-open-task-editor="pm-1"')
    expect(html).toContain("Recommended")
  })

  it("renders audit view hooks", () => {
    const viewModel: StrategyWorkspaceViewModel = {
      kind: "audit",
      audit: {
        tabs: { activeView: "audit" },
        toolbar: {
          searchQuery: "motor",
          filteredCount: 1,
          totalCount: 2,
          optionsOpen: true,
          orderedColumns: [
            { key: "scheduledTaskIsEnabled", label: "Enabled", isVisible: true, canMoveLeft: false, canMoveRight: true }
          ]
        },
        header: { title: "Audit table", subtitle: "1 visible row | Raw field view" },
        headers: [
          {
            key: "scheduledTaskIsEnabled",
            label: "Enabled",
            isFiltered: false,
            isOpen: false,
            filterPopover: null
          }
        ],
        rows: [
          {
            taskNodeId: "pm-1",
            isSelected: true,
            cells: [
              {
                kind: "editableCheckbox",
                taskNodeId: "pm-1",
                columnKey: "scheduledTaskIsEnabled",
                value: "",
                checked: true,
                disabled: false,
                inputType: "text"
              }
            ]
          }
        ]
      }
    }

    const html = renderStrategyWorkspace(viewModel)

    expect(html).toContain('id="strategyTableSearchInput"')
    expect(html).toContain('id="strategyTableOptionsButton"')
    expect(html).toContain('data-strategy-column-visibility="scheduledTaskIsEnabled"')
    expect(html).toContain('data-strategy-task-node="pm-1"')
    expect(html).toContain('data-strategy-column="scheduledTaskIsEnabled"')
    expect(html).toContain('data-strategy-task-row="pm-1"')
  })

  it("renders the no-rows state with tabs preserved", () => {
    const viewModel: StrategyWorkspaceViewModel = {
      kind: "noRows",
      tabs: { activeView: "decision" },
      header: { title: "Strategies", subtitle: "No strategy rows yet" },
      emptyState: {
        title: "No strategy rows under this selection yet",
        description: "Select another asset or add hierarchy children to keep building the strategy structure."
      }
    }

    const html = renderStrategyWorkspace(viewModel)
    expect(html).toContain("No strategy rows yet")
    expect(html).toContain('data-strategy-view="decision"')
  })
})
