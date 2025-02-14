import { FileField } from "../../interfaces/form.interface";
import { renderAttr, renderFieldLabel } from "../helper";

/**
 * Builds common attributes for file input.
 */
function buildCommonAttributes(field: FileField): string {
  const attrs = [
    renderAttr("placeholder", field.placeholder),
    field.required ? "required" : "",
    field.disabled ? "disabled" : "",
    field.className ? `class="${field.className}"` : "",
  ];

  return attrs.filter(Boolean).join(" ");
}

/**
 * Renders help and error text elements.
 */
function renderHelpAndError(field: FileField): string {
  return `
    ${
      field.helpText
        ? `<div part="help-text" data-help="${field.name}" style="display: block;">${field.helpText}</div>`
        : ""
    }
    <div part="error-text" data-error="${
      field.name
    }" style="display: none;"></div>
  `;
}

/**
 * Renders a file input field with validation support.
 */
export function renderFileInput(field: FileField): string {
  const attributes = buildCommonAttributes(field);

  return `
    <div class="field" part="field">
      ${renderFieldLabel(field, field.name)}
      <div class="input-wrapper" part="input-wrapper">
        <input 
          type="file" 
          id="${field.name}" 
          name="${field.name}" 
          ${attributes}
          part="input"
          exportparts="input, input-invalid"
        />
      </div>
      ${renderHelpAndError(field)}
    </div>
  `;
}
