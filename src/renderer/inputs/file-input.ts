import { FormFieldSchema } from "../../interfaces/form.interface";
import { renderAttr, renderFieldLabel } from "../helper";

/**
 * Renders a file input field.
 */
export function renderFileInput(field: FormFieldSchema): string {
  const placeholder = renderAttr("placeholder", field.placeholder);
  const labelHtml = renderFieldLabel(field, field.name);
  return `
    <div class="field" part="field">
      ${labelHtml}
      <input 
        type="file" 
        id="${field.name}" 
        name="${field.name}" 
        ${field.required ? "required" : ""} 
        ${placeholder}
        part="input"
      />
    </div>
  `;
}
