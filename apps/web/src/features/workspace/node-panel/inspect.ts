import { escapeHtml, getGridClassName, renderInspectField } from "./shared"
import type { NodeInspectPanelViewModel, NodeInspectSectionViewModel } from "./types"

const renderInspectSection = (section: NodeInspectSectionViewModel): string => `
  <section class="asset-child-creator__section">
    <header class="asset-child-creator__section-head">
      <strong class="asset-child-creator__section-title">${escapeHtml(section.title)}</strong>
    </header>
    <div class="${getGridClassName(section.gridVariant)}">
      ${section.items.map((item) => renderInspectField(item)).join("")}
    </div>
    ${section.notice ? `<div class="maintenance-notice" role="status">${escapeHtml(section.notice)}</div>` : ""}
  </section>
`

export const renderInspectPanel = (viewModel: NodeInspectPanelViewModel): string => `
  <section class="node-inspect-panel">
    ${viewModel.sections.map((section) => renderInspectSection(section)).join("")}
  </section>
`
