import { DateField } from "../../interfaces/form.interface";
import { renderAttr, renderFieldLabel } from "../helper";

/**
 * Builds common attributes for date input.
 */
function buildCommonAttributes(field: DateField): string {
  if (!field) {
    return "";
  }

  const attrs = [
    renderAttr("placeholder", field.placeholder),
    field.required ? "required" : "",
    field.disabled ? "disabled" : "",
    field.className ? `class="${field.className}"` : "",
  ];

  // Add date-specific validation attributes
  if (field.min) attrs.push(renderAttr("min", field.min));
  if (field.max) attrs.push(renderAttr("max", field.max));
  if (field.format) attrs.push(`data-format="${field.format}"`);

  return attrs.filter(Boolean).join(" ");
}

/**
 * Renders help and error text elements.
 */
function renderHelpAndError(field: DateField): string {
  return `
    ${
      field.helpText
        ? `<div part="help-text" data-help="${field.name}" style="display: block;">${field.helpText}</div>`
        : ""
    }
    <div part="error-text" data-error="${field.name}" style="display: none;"></div>
  `;
}

/**
 * Renders a date input field with validation support.
 */
export function renderDateInput(field: DateField): string {
  if (!field) {
    return `<div class="field error" part="field">
              <p part="error-text">Field configuration is missing.</p>
            </div>`;
  }

  const attributes = buildCommonAttributes(field);

  return `
    <div class="field" part="field">
      ${renderFieldLabel(field, field.name)}
      <div class="input-wrapper" part="input-wrapper">
        <input 
          type="date" 
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
