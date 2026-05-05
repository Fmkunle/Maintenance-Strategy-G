import type { EditorSelectOptionViewModel } from "./types"

export const escapeHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

export const renderSelectOptions = (options: EditorSelectOptionViewModel[]): string =>
  options
    .map(
      (option) =>
        `<option value="${escapeHtml(option.value)}" ${option.selected ? "selected" : ""} ${option.disabled ? "disabled" : ""}>${escapeHtml(
          option.label
        )}</option>`
    )
    .join("")
