import { FormFieldSchema } from "../../interfaces/form.interface";
import { renderAttr, renderFieldLabel } from "../helper";

/**
 * Renders a date input field.
 */
export function renderDateInput(field: FormFieldSchema): string {
  const placeholder = renderAttr("placeholder", field.placeholder);
  const labelHtml = renderFieldLabel(field, field.name);
  return `
    <div class="field" part="field">
      ${labelHtml}
      <input 
        type="date" 
        id="${field.name}" 
        name="${field.name}" 
        ${field.required ? "required" : ""} 
        ${placeholder}
        ${renderAttr("min", field.min)}
        ${renderAttr("max", field.max)}
        ${field.format ? `data-format="${field.format}" ` : ""}
        part="input"
      />
    </div>
  `;
}
