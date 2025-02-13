import { FormFieldSchema } from "../../interfaces/form.interface";
import { renderFieldLabel } from "../helper";

/**
 * Renders a select dropdown field.
 */
export function renderSelect(field: FormFieldSchema): string {
  const labelHtml = renderFieldLabel(field, field.name);
  return `
    <div class="field" part="field">
      ${labelHtml}
      <select 
        id="${field.name}" 
        name="${field.name}" 
        ${field.required ? "required" : ""} 
        part="select"
      >
        ${(field.options || [])
          .map((option) => `<option value="${option}">${option}</option>`)
          .join("")}
      </select>
    </div>
  `;
}
