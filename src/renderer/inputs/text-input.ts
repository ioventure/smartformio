import { FormFieldSchema } from "../../interfaces/form.interface";
import { renderAttr, renderFieldLabel } from "../helper";

/**
 * Renders text-like input fields (text, email, password, number).
 */
export function renderTextInput(field: FormFieldSchema): string {
  const placeholder = renderAttr("placeholder", field.placeholder);
  const labelHtml = renderFieldLabel(field, field.name);
  return `
    <div class="field" part="field">
      ${labelHtml}
      <input 
        type="${field.type}" 
        id="${field.name}" 
        name="${field.name}" 
        ${field.required ? "required" : ""} 
        ${placeholder}
        part="input"
      />
    </div>
  `;
}
