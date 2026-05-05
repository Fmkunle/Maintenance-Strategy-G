import type {
  StrategyAuditCellViewModel,
  StrategyAuditHeaderFilterPopoverViewModel,
  StrategyAuditHeaderViewModel,
  StrategyAuditRowViewModel,
  StrategyAuditToolbarViewModel,
  StrategyAuditWorkspaceViewModel
} from "./types"
import { escapeHtml, renderStrategyWorkspaceTabs } from "./shared"

const renderStrategyHeaderFilterPopover = (popover: StrategyAuditHeaderFilterPopoverViewModel | null): string => {
  if (!popover) {
    return ""
  }

  if (popover.kind === "boolean") {
    return `
      <div class="strategy-header-filter__popover" role="dialog" aria-label="Filter ${escapeHtml(popover.label)}">
        <label class="strategy-header-filter__field">
          <span>Show</span>
          <select data-strategy-header-filter="${escapeHtml(popover.columnKey)}">
            <option value="">All</option>
            <option value="true" ${popover.currentValue === "true" ? "selected" : ""}>Checked</option>
            <option value="false" ${popover.currentValue === "false" ? "selected" : ""}>Unchecked</option>
          </select>
        </label>
        <button class="secondary-button strategy-header-filter__clear" type="button" data-clear-strategy-header-filter="${escapeHtml(popover.columnKey)}">Clear</button>
      </div>
    `
  }

  if (popover.kind === "exact") {
    return `
      <div class="strategy-header-filter__popover" role="dialog" aria-label="Filter ${escapeHtml(popover.label)}">
        <label class="strategy-header-filter__field">
          <span>Match value</span>
          <select data-strategy-header-filter="${escapeHtml(popover.columnKey)}">
            <option value="">All</option>
            ${(popover.exactMatchOptions || [])
              .map(
                (option) => `<option value="${escapeHtml(option)}" ${popover.currentValue === option ? "selected" : ""}>${escapeHtml(option)}</option>`
              )
              .join("")}
          </select>
        </label>
        <button class="secondary-button strategy-header-filter__clear" type="button" data-clear-strategy-header-filter="${escapeHtml(popover.columnKey)}">Clear</button>
      </div>
    `
  }

  return `
    <div class="strategy-header-filter__popover" role="dialog" aria-label="Filter ${escapeHtml(popover.label)}">
      <label class="strategy-header-filter__field">
        <span>Contains</span>
        <input
          type="search"
          value="${escapeHtml(popover.currentValue)}"
          placeholder="Type to filter"
          data-strategy-header-filter-input="${escapeHtml(popover.columnKey)}"
        >
      </label>
      <button class="secondary-button strategy-header-filter__clear" type="button" data-clear-strategy-header-filter="${escapeHtml(popover.columnKey)}">Clear</button>
    </div>
  `
}

const renderStrategyTableHeader = (header: StrategyAuditHeaderViewModel): string => `
  <th scope="col" class="strategy-grid__head ${header.isFiltered ? "is-filtered" : ""}">
    <div class="strategy-grid__head-shell">
      <span class="strategy-grid__head-label">${escapeHtml(header.label)}</span>
      <div class="strategy-header-filter">
        <button
          class="strategy-header-filter__trigger ${header.isFiltered ? "is-filtered" : ""}"
          type="button"
          aria-label="Filter ${escapeHtml(header.label)}"
          aria-expanded="${header.isOpen ? "true" : "false"}"
          data-strategy-header-filter-toggle="${escapeHtml(header.key)}"
        >
          &#9662;
        </button>
        ${renderStrategyHeaderFilterPopover(header.filterPopover)}
      </div>
    </div>
  </th>
`

const renderStrategyTableToolbar = (toolbar: StrategyAuditToolbarViewModel): string => `
  <div class="strategy-table-toolbar">
    <label class="strategy-table-toolbar__search">
      <span>Search</span>
      <input
        id="strategyTableSearchInput"
        type="search"
        value="${escapeHtml(toolbar.searchQuery)}"
        placeholder="Filter by asset, failure mode, component, or task"
      >
    </label>
    <div class="strategy-table-toolbar__summary">
      <strong>${toolbar.filteredCount}</strong>
      <span>of ${toolbar.totalCount} rows</span>
    </div>
    <div class="strategy-table-toolbar__options">
      <button
        id="strategyTableOptionsButton"
        class="secondary-button strategy-table-toolbar__button"
        type="button"
        aria-expanded="${toolbar.optionsOpen ? "true" : "false"}"
      >
        Table options
      </button>
      ${
        toolbar.optionsOpen
          ? `
            <div class="strategy-table-options" role="dialog" aria-label="Table options">
              <div class="strategy-table-options__header">
                <strong>Columns</strong>
                <button id="strategyTableResetColumnsButton" class="secondary-button strategy-table-options__reset" type="button">
                  Reset
                </button>
              </div>
              <div class="strategy-table-options__list">
                ${toolbar.orderedColumns
                  .map(
                    (column) => `
                      <div class="strategy-table-options__row">
                        <label class="strategy-table-options__toggle">
                          <input
                            type="checkbox"
                            data-strategy-column-visibility="${escapeHtml(column.key)}"
                            ${column.isVisible ? "checked" : ""}
                          >
                          <span>${escapeHtml(column.label)}</span>
                        </label>
                        <div class="strategy-table-options__move">
                          <button
                            class="secondary-button strategy-table-options__move-button"
                            type="button"
                            data-strategy-column-move="${escapeHtml(column.key)}"
                            data-direction="left"
                            ${column.canMoveLeft ? "" : "disabled"}
                          >
                            &larr;
                          </button>
                          <button
                            class="secondary-button strategy-table-options__move-button"
                            type="button"
                            data-strategy-column-move="${escapeHtml(column.key)}"
                            data-direction="right"
                            ${column.canMoveRight ? "" : "disabled"}
                          >
                            &rarr;
                          </button>
                        </div>
                      </div>
                    `
                  )
                  .join("")}
              </div>
            </div>
          `
          : ""
      }
    </div>
  </div>
`

const renderStrategyAuditCell = (cell: StrategyAuditCellViewModel): string => {
  if (cell.kind === "editableCheckbox") {
    return `
      <td class="strategy-grid__cell strategy-grid__cell--checkbox">
        <input
          class="strategy-grid__checkbox"
          type="checkbox"
          data-strategy-task-node="${escapeHtml(cell.taskNodeId)}"
          data-strategy-column="${escapeHtml(cell.columnKey)}"
          ${cell.checked ? "checked" : ""}
          ${cell.disabled ? "disabled" : ""}
        >
      </td>
    `
  }

  if (cell.kind === "editableText") {
    return `
      <td class="strategy-grid__cell strategy-grid__cell--editable">
        <input
          class="strategy-grid__field"
          type="${cell.inputType === "number" ? "number" : "text"}"
          value="${escapeHtml(cell.value)}"
          data-strategy-task-node="${escapeHtml(cell.taskNodeId)}"
          data-strategy-column="${escapeHtml(cell.columnKey)}"
          ${cell.inputType === "number" ? 'step="any"' : ""}
        >
      </td>
    `
  }

  if (cell.kind === "readonlyCheckbox") {
    return `
      <td class="strategy-grid__cell strategy-grid__cell--checkbox">
        <input class="strategy-grid__checkbox" type="checkbox" ${cell.checked ? "checked" : ""} disabled>
      </td>
    `
  }

  return `
    <td class="strategy-grid__cell" title="${escapeHtml(cell.value)}">
      <span class="strategy-grid__text ${cell.value ? "" : "is-empty"}">${escapeHtml(cell.value)}</span>
    </td>
  `
}

const renderStrategyAuditRow = (row: StrategyAuditRowViewModel): string => `
  <tr class="strategy-grid__row ${row.isSelected ? "is-selected" : ""}" data-strategy-task-row="${escapeHtml(row.taskNodeId)}">
    ${row.cells.map((cell) => renderStrategyAuditCell(cell)).join("")}
  </tr>
`

export const renderAuditWorkspace = (viewModel: StrategyAuditWorkspaceViewModel): string => `
  ${renderStrategyWorkspaceTabs(viewModel.tabs)}
  <section class="strategy-draft-list__section strategy-draft-list__section--table">
    ${renderStrategyTableToolbar(viewModel.toolbar)}
    <div class="strategy-surface__header strategy-surface__header--spread">
      <div>
        <strong>${escapeHtml(viewModel.header.title)}</strong>
        <span>${escapeHtml(viewModel.header.subtitle)}</span>
      </div>
    </div>
    <div class="strategy-grid__viewport">
      <table class="strategy-grid" aria-label="Strategy audit table">
        <thead>
          <tr>
            ${viewModel.headers.map((header) => renderStrategyTableHeader(header)).join("")}
          </tr>
        </thead>
        <tbody>
          ${
            viewModel.rows.length
              ? viewModel.rows.map((row) => renderStrategyAuditRow(row)).join("")
              : `
                <tr class="strategy-grid__empty-row">
                  <td class="strategy-grid__empty-cell" colspan="${viewModel.headers.length}">
                    No rows match the current strategy filters.
                  </td>
                </tr>
              `
          }
        </tbody>
      </table>
    </div>
    <div class="strategy-grid__scrollbar" aria-hidden="true">
      <div class="strategy-grid__scrollbar-inner"></div>
    </div>
  </section>
`
