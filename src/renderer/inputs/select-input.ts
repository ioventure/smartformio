import { SelectField } from "../../interfaces/form.interface";
import { renderFieldLabel } from "../helper";

/**
 * Renders a select dropdown field.
 */
export function renderSelect(field: SelectField): string {
  const labelHtml = renderFieldLabel(field, field.name);
  const requiredAttr = field.required ? "required" : "";
  return `
    <div class="field" part="field">
      ${labelHtml}
      <select 
        id="${field.name}" 
        name="${field.name}" 
        ${requiredAttr}
        part="select"
      >
        ${field.options
          .map((option) => `<option value="${option}">${option}</option>`)
          .join("")}
      </select>
    </div>
  `;
}
