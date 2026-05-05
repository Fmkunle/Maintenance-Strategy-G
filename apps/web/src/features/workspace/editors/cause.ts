import { escapeHtml } from "./shared"
import type { CauseConfigEditorViewModel } from "./types"

export const renderCauseConfigEditor = (viewModel: CauseConfigEditorViewModel): string => `
  <section class="asset-child-creator__form cause-config-panel__form">
    <section class="asset-child-creator__section">
      <header class="asset-child-creator__section-head">
        <strong class="asset-child-creator__section-title">Definition</strong>
      </header>
      <div class="asset-child-creator__preview-grid">
        <div class="asset-child-creator__preview-item">
          <span>Name</span>
          <strong>${escapeHtml(viewModel.fullCode)}</strong>
        </div>
      </div>
      <label class="field field--full">
        <span>${viewModel.requiredComponentNameLabel}</span>
        <input
          id="causeConfigComponentNameInput"
          type="text"
          value="${escapeHtml(viewModel.componentName)}"
          placeholder="Enter component name"
          required
        >
      </label>
      <label class="field field--full">
        <span>${viewModel.requiredDescriptionLabel}</span>
        <input
          id="causeConfigDescriptionInput"
          type="text"
          value="${escapeHtml(viewModel.description)}"
          placeholder="Enter failure mode description"
          required
        >
      </label>
    </section>
    ${viewModel.fieldsMarkup}
    <div class="asset-child-creator__actions">
      <button id="resetCauseConfigButton" class="secondary-button" type="button">Cancel</button>
      <button id="saveCauseConfigButton" class="primary-button" type="button" ${viewModel.saveDisabled ? "disabled" : ""}>Save</button>
    </div>
  </section>
`
