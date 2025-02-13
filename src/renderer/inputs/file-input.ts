import { FileField } from "../../interfaces/form.interface";
import { renderAttr, renderFieldLabel } from "../helper";

/**
 * Renders a file input field.
 */
export function renderFileInput(field: FileField): string {
  const placeholder = renderAttr("placeholder", field.placeholder);
  const labelHtml = renderFieldLabel(field, field.name);
  const requiredAttr = field.required ? "required" : "";
  return `
    <div class="field" part="field">
      ${labelHtml}
      <input 
        type="file" 
        id="${field.name}" 
        name="${field.name}" 
        ${requiredAttr}
        ${placeholder}
        part="input"
      />
    </div>
  `;
}
