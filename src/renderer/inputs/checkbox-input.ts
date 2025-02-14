import { CheckboxField } from "../../interfaces/form.interface";
import { renderFieldLabel } from "../helper";

/**
 * Builds common attributes for checkbox input.
 */
function buildCommonAttributes(field: CheckboxField): string {
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
function renderHelpAndError(field: CheckboxField): string {
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
 * Renders a checkbox group or single checkbox with validation support.
 */
export function renderCheckbox(field: CheckboxField): string {
  const attributes = buildCommonAttributes(field);

  if (field.options && Array.isArray(field.options)) {
    // Render checkbox group
    return `
      <div class="field" part="field">
        ${renderFieldLabel(field, field.name)}
        <div class="input-wrapper" part="input-wrapper">
          <div part="checkbox-group">
            ${field.options
              .map((option, index) => {
                const descriptionHtml =
                  field.descriptions && field.descriptions[index]
                    ? `<p part="checkbox-description">${field.descriptions[index]}</p>`
                    : "";
                return `
                  <label part="checkbox-container">
                    <input 
                      type="checkbox" 
                      id="${field.name}-${index}" 
                      name="${field.name}" 
                      value="${option}" 
                      ${attributes}
                      part="input"
                      exportparts="input, input-invalid"
                    />
                    <div>
                      <span part="checkbox-label">${option}</span>
                      ${descriptionHtml}
                    </div>
                  </label>
                `;
              })
              .join("")}
          </div>
        </div>
        ${renderHelpAndError(field)}
      </div>
    `;
  } else {
    // Render single checkbox
    const effectiveLabel = field.label || field.placeholder || "";
    const labelClass = field.labelPosition === "right" ? "right" : "left";
    const descriptionHtml = field.descriptions
      ? `<p part="checkbox-description">${field.descriptions}</p>`
      : "";

    return `
      <div class="field" part="field">
        <div class="input-wrapper" part="input-wrapper">
          <label for="${
            field.name
          }" part="checkbox-container" class="${labelClass}">
            <input 
              type="checkbox" 
              id="${field.name}" 
              name="${field.name}" 
              ${attributes}
              part="input"
              exportparts="input, input-invalid"
            />
            <div>
              <span part="checkbox-label">${effectiveLabel}</span>
              ${descriptionHtml}
            </div>
          </label>
        </div>
        ${renderHelpAndError(field)}
      </div>
    `;
  }
}
