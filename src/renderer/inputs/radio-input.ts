import { RadioField } from "../../interfaces/form.interface";
import { renderFieldLabel } from "../helper";

/**
 * Renders a radio button group.
 */
export function renderRadio(field: RadioField): string {
  const labelHtml = renderFieldLabel(field, field.name);
  const requiredAttr = field.required ? "required" : "";
  return `
    <div class="field" part="field">
      ${labelHtml}
      ${field.options
        .map(
          (option) => `
        <label part="label" class="inline-label">
          <input 
            type="radio" 
            name="${field.name}" 
            value="${option}" 
            ${requiredAttr}
            part="input"
          />
          <span>${option}</span>
        </label>
      `
        )
        .join("")}
    </div>
  `;
}
