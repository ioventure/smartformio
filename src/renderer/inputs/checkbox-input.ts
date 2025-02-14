import { CheckboxField } from "../../interfaces/form.interface";
import { renderFieldWrapper } from "../helper";

/**
 * Renders a checkbox input or group with validation support.
 */
export function renderCheckbox(field: CheckboxField): string {
  const commonAttrs = [
    field.required ? "required" : "",
    field.disabled ? "disabled" : "",
    field.className ? `class="${field.className}"` : "",
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

  // Single checkbox
  if (!field.options) {
    const checkboxHtml = `
      <label for="${field.name}" part="checkbox-container" class="${field.labelPosition || "left"}">
        <input 
          type="checkbox" 
          id="${field.name}" 
          name="${field.name}" 
          ${commonAttrs}
          part="input"
          exportparts="input, input-invalid"
        />
        <div>
          <span part="checkbox-label"${field.hiddenLabel ? ' class="sr-only"' : ""}>${field.label}</span>
        </div>
      </label>
    `;
    return renderFieldWrapper({ ...field, label: "" }, checkboxHtml);
  }

  // Checkbox group
  const options = field.options
    .map((option, index) => {
      const description = field.descriptions?.[index];
      return `
      <label part="checkbox-container" class="${field.labelPosition || "left"}">
        <input 
          type="checkbox" 
          name="${field.name}" 
          value="${option}"
          ${commonAttrs}
          part="input"
          exportparts="input, input-invalid"
        />
        <div>
          <span part="checkbox-label">${option}</span>
          ${description ? `<span part="checkbox-description">${description}</span>` : ""}
        </div>
      </label>
    `;
    })
    .join("");

  const checkboxGroupHtml = `
    <div part="checkbox-group">
      ${options}
    </div>
  `;

  return renderFieldWrapper(field, checkboxGroupHtml);
}
