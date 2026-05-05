import { escapeHtml } from "./shared"
import type { NodeActionsViewModel } from "./types"

const renderSelectedActions = (viewModel: Extract<NodeActionsViewModel, { kind: "selected" }>): string => `
  ${
    viewModel.equipmentInfoAction
      ? `
        <div class="maintenance-panel__menu">
          <button
            id="equipmentInfoMenuButton"
            class="secondary-button maintenance-info-action"
            type="button"
            aria-expanded="${viewModel.equipmentInfoAction.menuOpen ? "true" : "false"}"
            data-toggle-equipment-info-menu="${escapeHtml(viewModel.equipmentInfoAction.nodeId)}"
          >
            Info
          </button>
          ${
            viewModel.equipmentInfoAction.menuOpen
              ? `
                <div class="maintenance-panel__menu-popover" role="menu" aria-label="Equipment actions">
                  <button class="maintenance-panel__menu-item" type="button" role="menuitem" data-open-equipment-info="view" data-equipment-node="${escapeHtml(
                    viewModel.equipmentInfoAction.nodeId
                  )}">
                    View equipment info
                  </button>
                  <button class="maintenance-panel__menu-item" type="button" role="menuitem" data-open-equipment-info="edit" data-equipment-node="${escapeHtml(
                    viewModel.equipmentInfoAction.nodeId
                  )}">
                    Edit equipment info
                  </button>
                </div>
              `
              : ""
          }
        </div>
      `
      : ""
  }
  ${
    viewModel.failureModeNodeId
      ? `
        <button
          class="secondary-button"
          type="button"
          data-open-failure-mode-config="${escapeHtml(viewModel.failureModeNodeId)}"
        >
          Edit failure mode
        </button>
      `
      : ""
  }
  ${
    viewModel.taskNodeId
      ? `
        <button
          class="secondary-button"
          type="button"
          data-open-task-editor="${escapeHtml(viewModel.taskNodeId)}"
        >
          Edit task
        </button>
      `
      : ""
  }
  ${
    viewModel.taskFailureModeNodeId
      ? `
        <button
          class="secondary-button"
          type="button"
          data-open-failure-mode-config="${escapeHtml(viewModel.taskFailureModeNodeId)}"
        >
          Edit failure mode
        </button>
      `
      : ""
  }
  ${
    viewModel.deleteNodeId
      ? `
        <button
          id="deleteSelectedNodeButton"
          class="secondary-button maintenance-delete-action"
          type="button"
          data-delete-node="${escapeHtml(viewModel.deleteNodeId)}"
        >
          Delete
        </button>
      `
      : ""
  }
`

export const renderNodeActions = (viewModel: NodeActionsViewModel): string => {
  if (viewModel.kind === "hidden") {
    return ""
  }

  if (viewModel.kind === "inspect") {
    return `
      <button class="secondary-button" type="button" data-close-node-inspect="true">Back</button>
      <button class="primary-button" type="button" data-open-node-inspect-editor="${escapeHtml(viewModel.editNodeId)}">Edit</button>
    `
  }

  return renderSelectedActions(viewModel)
}
