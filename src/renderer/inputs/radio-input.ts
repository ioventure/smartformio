import { FormFieldSchema } from "../../interfaces/form.interface";
import { renderFieldLabel } from "../helper";

/**
 * Renders a radio button group.
 */
export function renderRadio(field: FormFieldSchema): string {
  const labelHtml = renderFieldLabel(field, field.name);
  return `
    <div class="field" part="field">
      ${labelHtml}
      ${(field.options || [])
        .map(
          (option) => `
          <label part="label" class="inline-label">
            <input 
              type="radio" 
              name="${field.name}" 
              value="${option}" 
              ${field.required ? "required" : ""} 
              part="input"
            />
            <span>${option}</span>
          </label>`
        )
        .join("")}
    </div>
  `;
}
