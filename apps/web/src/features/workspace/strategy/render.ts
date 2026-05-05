import { renderAuditWorkspace } from "./audit"
import { renderDecisionWorkspace } from "./decision"
import { escapeHtml, renderStrategyWorkspaceTabs, renderWorkspaceEmptyState, renderWorkspaceSectionHeader } from "./shared"
import type { StrategyWorkspaceViewModel } from "./types"

export const renderStrategyWorkspace = (viewModel: StrategyWorkspaceViewModel): string => {
  switch (viewModel.kind) {
    case "noSelection":
      return renderWorkspaceEmptyState(viewModel.emptyState)
    case "noFailureModes":
      return `
        ${renderStrategyWorkspaceTabs(viewModel.tabs)}
        <section class="strategy-workspace-empty">
          <strong>${escapeHtml(viewModel.emptyState.title)}</strong>
          <p>${escapeHtml(viewModel.emptyState.description)}</p>
        </section>
      `
    case "noRows":
      return `
        <section class="strategy-draft-list__section">
          ${renderStrategyWorkspaceTabs(viewModel.tabs)}
          ${renderWorkspaceSectionHeader(viewModel.header)}
          ${renderWorkspaceEmptyState(viewModel.emptyState)}
        </section>
      `
    case "decision":
      return renderDecisionWorkspace(viewModel.decision)
    case "audit":
      return renderAuditWorkspace(viewModel.audit)
    default:
      return ""
  }
}
