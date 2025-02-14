import { FileField } from "../../interfaces/form.interface";
import { renderFieldLabel } from "../helper";

/**
 * Renders a file input field with validation support.
 */
export function renderFileInput(field: FileField): string {
  if (!field) {
    return `<div class="field error" part="field">
              <p part="error-text">Field configuration is missing.</p>
            </div>`;
  }

  const attrs = [
    field.required ? "required" : "",
    field.disabled ? "disabled" : "",
    field.className ? `class="${field.className}"` : "",
    field.accept ? `accept="${field.accept}"` : "",
    field.multiple ? "multiple" : "",
    // ARIA attributes
    field.required ? 'aria-required="true"' : 'aria-required="false"',
    field.disabled ? 'aria-disabled="true"' : "",
    field.helpText ? `aria-describedby="help-${field.name}"` : "",
    `aria-labelledby="label-${field.name}"`,
    'aria-invalid="false"',
    // Validation
    field.validationMessage
      ? `validationMessage="${field.validationMessage}"`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <div class="field" part="field">
      ${renderFieldLabel(field, field.name, field.hiddenLabel ? "sr-only" : "")}
      <div class="input-wrapper" part="input-wrapper">
        <input 
          type="file" 
          id="${field.name}" 
          name="${field.name}" 
          ${attrs}
          part="input"
          exportparts="input, input-invalid"
        />
      </div>
      ${field.helpText ? `<div part="help-text" id="help-${field.name}" data-help="${field.name}" style="display: block;">${field.helpText}</div>` : ""}
      <div part="error-text" id="error-${field.name}" data-error="${field.name}" style="display: none;"></div>
    </div>
  `;
}
