import { SelectField } from "../../interfaces/form.interface";
import { renderFieldWrapper } from "../helper";

/**
 * Renders a select dropdown with validation support.
 */
export function renderSelect(field: SelectField): string {
  const attrs = [
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

  const options = field.options
    .map((option) => {
      const isSelected = option === field.defaultValue;
      return `<option value="${option}"${isSelected ? " selected" : ""}>${option}</option>`;
    })
    .join("");

  const selectHtml = `
    <select 
      id="${field.name}" 
      name="${field.name}" 
      ${attrs}
      part="input"
      exportparts="input, input-invalid"
    >
      <option value="">${field.placeholder || "Select an option"}</option>
      ${options}
    </select>
  `;

  return renderFieldWrapper(field, selectHtml);
}
