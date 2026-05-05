import { escapeHtml, renderSelectOptions } from "./shared"
import type { EquipmentInfoEditorViewModel } from "./types"

export const renderEquipmentInfoEditor = (viewModel: EquipmentInfoEditorViewModel): string => `
  <section class="asset-child-creator__form">
    <section class="asset-child-creator__section">
      <header class="asset-child-creator__section-head">
        <strong class="asset-child-creator__section-title">Definition</strong>
      </header>
      <div class="asset-child-creator__row-grid">
        <label class="field">
          <span>${viewModel.requiredNameLabel}</span>
          <div class="hierarchy-code-field ${viewModel.parentPrefix ? "has-prefix" : ""}">
            <span class="hierarchy-code-field__prefix">${escapeHtml(viewModel.parentPrefix)}</span>
            <input id="equipmentInfoCodeSegmentInput" type="text" value="${escapeHtml(viewModel.codeSegment)}" placeholder="Enter code segment" required>
          </div>
        </label>
        <label class="field">
          <span>${viewModel.requiredDescriptionLabel}</span>
          <input id="equipmentInfoDescriptionInput" type="text" value="${escapeHtml(viewModel.description)}" placeholder="Enter description, e.g. Main Belt Conveyor" required>
        </label>
      </div>
    </section>
    <section class="asset-child-creator__section">
      <header class="asset-child-creator__section-head">
        <strong class="asset-child-creator__section-title">Equipment Context</strong>
      </header>
      <div class="asset-child-creator__row-grid">
        <label class="field">
          <span>Equipment Function</span>
          <input id="equipmentInfoFunctionInput" type="text" value="${escapeHtml(viewModel.equipmentFunction)}" placeholder="Enter equipment function">
        </label>
        <label class="field">
          <span>Type of Equipment</span>
          <input id="equipmentInfoTypeInput" type="text" value="${escapeHtml(viewModel.equipmentType)}" placeholder="Enter equipment type">
        </label>
      </div>
      <label class="field field--full">
        <span>Operating Context</span>
        <textarea id="equipmentInfoOperatingContextInput" rows="3" placeholder="Add operating context">${escapeHtml(viewModel.operatingContext)}</textarea>
      </label>
    </section>
    <section class="asset-child-creator__section">
      <header class="asset-child-creator__section-head">
        <strong class="asset-child-creator__section-title">Consequence</strong>
      </header>
      <div class="asset-child-creator__row-grid">
        <label class="field">
          <span>Effect</span>
          <select id="equipmentInfoEffectInput">
            <option value="">Select effect</option>
            ${renderSelectOptions(viewModel.effectPerHourDownOptions)}
          </select>
        </label>
        <label class="field">
          <span>Demand Frequency</span>
          <select id="equipmentInfoDemandFrequencyInput">
            <option value="">Select demand frequency</option>
            ${renderSelectOptions(viewModel.demandFrequencyOptions)}
          </select>
        </label>
      </div>
      <div class="asset-child-creator__row-grid asset-child-creator__row-grid--triple">
        <label class="field">
          <span>Redundancy</span>
          <select id="equipmentInfoRedundancyModeInput">
            ${renderSelectOptions(viewModel.redundancyOptions)}
          </select>
        </label>
        ${
          viewModel.redundancyMode === "Custom"
            ? `<label class="field">
                <span>Redundancy %</span>
                <input id="equipmentInfoRedundancyPercentInput" type="number" min="0" max="100" step="1" value="${escapeHtml(viewModel.redundancyPercent)}" placeholder="Enter percent">
              </label>`
            : `<div class="asset-child-creator__placeholder-cell" aria-hidden="true"></div>`
        }
        <label class="field">
          <span>Major Accident Event Category (MAE)</span>
          <select id="equipmentInfoMaeCategoryInput">
            ${renderSelectOptions(viewModel.maeCategoryOptions)}
          </select>
        </label>
      </div>
      <div class="asset-child-creator__row-grid">
        <label class="field">
          <span>Criticality</span>
          <select id="equipmentInfoCriticalityInput">
            <option value="">Select criticality</option>
            ${renderSelectOptions(viewModel.criticalityOptions)}
          </select>
        </label>
      </div>
    </section>
    <section class="asset-child-creator__section">
      <header class="asset-child-creator__section-head">
        <strong class="asset-child-creator__section-title">Linked References</strong>
        <span class="asset-child-creator__section-note">Connections will activate once FMEA and baseline strategy modules are enabled.</span>
      </header>
      <div class="asset-child-creator__references-grid">
        <button class="asset-child-creator__disabled-action" type="button" disabled>Link to FMEA</button>
        <label class="asset-child-creator__reference-field">
          <span>Baseline Strategy</span>
          <select disabled>
            <option>Available later</option>
          </select>
        </label>
        <button class="asset-child-creator__disabled-action" type="button" disabled>Attach Manuals</button>
      </div>
    </section>
    <div class="asset-child-creator__actions">
      <button id="cancelEquipmentInfoEditButton" class="secondary-button" type="button">Cancel</button>
      <button id="saveEquipmentInfoButton" class="primary-button" type="button" ${viewModel.saveDisabled ? "disabled" : ""}>Save</button>
    </div>
  </section>
`
