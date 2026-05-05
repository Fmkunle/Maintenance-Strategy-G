import type {
  StrategyComparisonPanelViewModel,
  StrategyDecisionCardViewModel,
  StrategyDecisionExpandedDetailViewModel,
  StrategyDecisionWorkspaceViewModel,
  StrategyFailureModeSelectorItemViewModel
} from "./types"
import { escapeHtml, renderStrategyWorkspaceTabs } from "./shared"

const renderFailureModeSelector = (items: StrategyFailureModeSelectorItemViewModel[]): string => `
  <section class="strategy-failure-selector" aria-label="Failure modes">
    <div class="strategy-failure-selector__list" role="list">
      ${items
        .map(
          (item) => `
            <button
              class="strategy-failure-pill ${item.isSelected ? "is-active" : ""}"
              type="button"
              data-select-failure-mode="${escapeHtml(item.nodeId)}"
            >
              <strong>${escapeHtml(item.title)}</strong>
              <span>${escapeHtml(item.exposureLabel)}</span>
            </button>
          `
        )
        .join("")}
    </div>
  </section>
`

const renderComparisonPanel = (comparison: StrategyComparisonPanelViewModel | null): string => {
  if (!comparison) {
    return ""
  }

  return `
    <aside class="strategy-comparison-panel">
      <div class="strategy-comparison-panel__header">
        <strong>${escapeHtml(comparison.title)}</strong>
      </div>
      <div class="strategy-comparison-panel__grid">
        ${comparison.stats
          .map(
            (stat) => `
              <article class="strategy-impact-stat">
                <span>${escapeHtml(stat.label)}</span>
                <strong>${escapeHtml(stat.value)}</strong>
              </article>
            `
          )
          .join("")}
      </div>
      <div class="strategy-impact-bar" aria-label="Baseline versus residual exposure">
        <div class="strategy-impact-bar__track">
          <span class="strategy-impact-bar__baseline"></span>
          <span class="strategy-impact-bar__residual" style="width:${comparison.residualWidthPercent}%;"></span>
        </div>
        <div class="strategy-impact-bar__legend">
          <span>${escapeHtml(comparison.untreatedLabel)}</span>
          <span>${escapeHtml(comparison.residualLabel)}</span>
        </div>
      </div>
    </aside>
  `
}

const renderStrategyDecisionCard = (card: StrategyDecisionCardViewModel): string => `
  <article
    class="strategy-option-card strategy-option-card--${card.status} ${card.isRecommendedLead ? "strategy-option-card--recommended" : ""} ${card.isSelected ? "is-selected" : ""} ${card.isExpanded ? "is-expanded" : ""}"
    data-strategy-task-row="${escapeHtml(card.taskNodeId)}"
  >
    <div class="strategy-option-card__header">
      <div class="strategy-option-card__identity">
        <div class="strategy-option-card__badges">
          <span class="strategy-option-card__status">${escapeHtml(card.statusLabel)}</span>
          <span class="strategy-option-card__type">${escapeHtml(card.strategyType)}</span>
          ${card.isRecommendedLead ? '<span class="strategy-option-card__recommended-badge">Recommended</span>' : ""}
        </div>
        <h4>${escapeHtml(card.title)}</h4>
      </div>
      <label class="strategy-option-card__toggle" aria-label="Toggle task inclusion">
        <input
          type="checkbox"
          data-strategy-task-node="${escapeHtml(card.taskNodeId)}"
          data-strategy-column="scheduledTaskIsEnabled"
          ${card.isEnabled ? "checked" : ""}
        >
        <span>${escapeHtml(card.inclusionLabel)}</span>
      </label>
    </div>
    <div class="strategy-option-card__metrics">
      <div>
        <span>${escapeHtml(card.residualLabel)}</span>
        <strong>${escapeHtml(card.residualValue)}</strong>
      </div>
      <div>
        <span>10-year cost</span>
        <strong>${escapeHtml(card.costValue)}</strong>
      </div>
    </div>
    <div class="strategy-option-card__actions">
      <button
        class="secondary-button strategy-option-card__action"
        type="button"
        data-strategy-card-expand="${escapeHtml(card.taskNodeId)}"
        aria-expanded="${card.isExpanded ? "true" : "false"}"
        aria-controls="${escapeHtml(card.detailId)}"
      >
        ${card.isExpanded ? "Hide details" : "View details"}
      </button>
    </div>
  </article>
`

const renderStrategyDecisionDetails = (detail: StrategyDecisionExpandedDetailViewModel): string => `
  <section class="strategy-option-details" id="${escapeHtml(detail.detailId)}">
    <div class="strategy-option-details__header">
      <span>${escapeHtml(detail.titleLabel)}</span>
      <strong>${escapeHtml(detail.title)}</strong>
    </div>
    ${
      detail.whyStatement
        ? `
          <div class="strategy-option-details__section">
            <span>Why this task helps</span>
            <p>${escapeHtml(detail.whyStatement)}</p>
          </div>
        `
        : ""
    }
    ${
      detail.tradeoffStatement
        ? `
          <div class="strategy-option-details__section">
            <span>Trade-off</span>
            <p>${escapeHtml(detail.tradeoffStatement)}</p>
          </div>
        `
        : ""
    }
    ${
      detail.weaknessFlags.length
        ? `
          <div class="strategy-option-details__section">
            <span>Watch-outs</span>
            <div class="strategy-option-details__flags">
              ${detail.weaknessFlags
                .map((flag) => `<span class="strategy-option-card__flag">${escapeHtml(flag)}</span>`)
                .join("")}
            </div>
          </div>
        `
        : ""
    }
    <div class="strategy-option-details__section">
      <span>Technical details</span>
      <dl class="strategy-option-card__detail-grid">
        ${detail.metrics
          .map(
            (metric) => `
              <div><dt>${escapeHtml(metric.label)}</dt><dd>${escapeHtml(metric.value)}</dd></div>
            `
          )
          .join("")}
      </dl>
    </div>
    <div class="strategy-option-details__actions">
      <button class="secondary-button strategy-option-card__action" type="button" data-open-task-editor="${escapeHtml(detail.editTaskNodeId)}">
        Edit task
      </button>
    </div>
  </section>
`

export const renderDecisionWorkspace = (viewModel: StrategyDecisionWorkspaceViewModel): string => `
  ${renderStrategyWorkspaceTabs(viewModel.tabs)}
  ${renderFailureModeSelector(viewModel.selectorItems)}
  <div class="strategy-workspace">
    <div class="strategy-workspace__main">
      <section class="strategy-option-stack" aria-label="Maintenance options">
        <div class="strategy-option-stack__list">
          ${viewModel.cards.map((card) => renderStrategyDecisionCard(card)).join("")}
        </div>
        ${
          viewModel.expandedDetail
            ? `
              <div class="strategy-option-stack__details">
                ${renderStrategyDecisionDetails(viewModel.expandedDetail)}
              </div>
            `
            : ""
        }
      </section>
    </div>
    ${renderComparisonPanel(viewModel.comparison)}
  </div>
`
