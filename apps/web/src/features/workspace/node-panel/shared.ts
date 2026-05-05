import type { NodeInspectFieldViewModel, NodeInspectGridVariant } from "./types"

export const escapeHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

export const getGridClassName = (gridVariant: NodeInspectGridVariant): string =>
  gridVariant === "triple" ? "node-inspect-panel__grid node-inspect-panel__grid--triple" : "node-inspect-panel__grid"

export const renderInspectField = (field: NodeInspectFieldViewModel): string => `
  <div class="node-inspect-panel__item ${field.isWide ? "node-inspect-panel__item--wide" : ""}">
    <span class="node-inspect-panel__label">${escapeHtml(field.label)}</span>
    <strong class="node-inspect-panel__value ${field.isEmpty ? "is-empty" : ""}">${escapeHtml(field.value)}</strong>
  </div>
`
