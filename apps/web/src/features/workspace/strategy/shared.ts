import type {
  StrategyWorkspaceEmptyStateViewModel,
  StrategyWorkspaceSectionHeaderViewModel,
  StrategyWorkspaceTabsViewModel
} from "./types"

export const escapeHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

export const renderStrategyWorkspaceTabs = (tabs: StrategyWorkspaceTabsViewModel): string => `
  <div class="strategy-workspace__tabs" role="tablist" aria-label="Strategy workspace view">
    <button
      class="strategy-workspace__tab ${tabs.activeView === "decision" ? "is-active" : ""}"
      type="button"
      role="tab"
      aria-selected="${tabs.activeView === "decision" ? "true" : "false"}"
      data-strategy-view="decision"
    >
      Decision
    </button>
    <button
      class="strategy-workspace__tab ${tabs.activeView === "audit" ? "is-active" : ""}"
      type="button"
      role="tab"
      aria-selected="${tabs.activeView === "audit" ? "true" : "false"}"
      data-strategy-view="audit"
    >
      Audit
    </button>
  </div>
`

export const renderWorkspaceSectionHeader = (header: StrategyWorkspaceSectionHeaderViewModel): string => `
  <div class="strategy-surface__header">
    <strong>${escapeHtml(header.title)}</strong>
    <span>${escapeHtml(header.subtitle)}</span>
  </div>
`

export const renderWorkspaceEmptyState = (
  emptyState: StrategyWorkspaceEmptyStateViewModel,
  className = "asset-workspace-empty asset-workspace-empty--soft"
): string => `
  <article class="${className}">
    <strong>${escapeHtml(emptyState.title)}</strong>
    <p>${escapeHtml(emptyState.description)}</p>
  </article>
`
