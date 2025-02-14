import { RadioField } from "../../interfaces/form.interface";
import { renderFieldWrapper } from "../helper";

/**
 * Renders a radio button group with validation support.
 */
export function renderRadio(field: RadioField): string {
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

  const options = field.options
    .map((option) => {
      const isChecked = option === field.defaultValue;
      return `
      <label part="radio-label">
        <input 
          type="radio" 
          name="${field.name}" 
          value="${option}"
          ${isChecked ? "checked" : ""}
          ${commonAttrs}
          part="input"
          exportparts="input, input-invalid"
        />
        <span>${option}</span>
      </label>
    `;
    })
    .join("");

  const radioGroupHtml = `
    <div part="radio-group">
      ${options}
    </div>
  `;

  return renderFieldWrapper(field, radioGroupHtml);
}
