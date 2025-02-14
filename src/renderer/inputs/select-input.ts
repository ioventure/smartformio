import { SelectField } from "../../interfaces/form.interface";
import { renderFieldLabel } from "../helper";

/**
 * Builds common attributes for select input.
 */
function buildCommonAttributes(field: SelectField): string {
  const attrs = [
    field.required ? "required" : "",
    field.disabled ? "disabled" : "",
    field.className ? `class="${field.className}"` : "",
  ];

  return attrs.filter(Boolean).join(" ");
}

/**
 * Renders help and error text elements.
 */
function renderHelpAndError(field: SelectField): string {
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
 * Renders a select dropdown field with validation support.
 */
export function renderSelect(field: SelectField): string {
  const attributes = buildCommonAttributes(field);

  return `
    <div class="field" part="field">
      ${renderFieldLabel(field, field.name)}
      <div class="input-wrapper" part="input-wrapper">
        <select 
          id="${field.name}" 
          name="${field.name}" 
          ${attributes}
          part="input"
          exportparts="input, input-invalid"
        >
          <option value="">Select an option</option>
          ${field.options
            .map((option) => `<option value="${option}">${option}</option>`)
            .join("")}
        </select>
      </div>
      ${renderHelpAndError(field)}
    </div>
  `;
}
