import { RadioField } from "../../interfaces/form.interface";
import { renderFieldLabel } from "../helper";

/**
 * Builds common attributes for radio input.
 */
function buildCommonAttributes(field: RadioField): string {
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
function renderHelpAndError(field: RadioField): string {
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
 * Renders a radio button group with validation support.
 */
export function renderRadio(field: RadioField): string {
  const attributes = buildCommonAttributes(field);

  return `
    <div class="field" part="field">
      ${renderFieldLabel(field, field.name)}
      <div class="input-wrapper" part="input-wrapper">
        <div part="radio-group">
          ${field.options
            .map(
              (option) => `
                <label part="radio-label">
                  <input 
                    type="radio" 
                    name="${field.name}" 
                    value="${option}" 
                    ${attributes}
                    part="input"
                    exportparts="input, input-invalid"
                  />
                  <span>${option}</span>
                </label>
              `
            )
            .join("")}
        </div>
      </div>
      ${renderHelpAndError(field)}
    </div>
  `;
}
