import { FormFieldSchema } from "../../interfaces/form.interface";

/**
 * Renders a checkbox field.
 */
export function renderCheckbox(field: FormFieldSchema): string {
  if (field.options && Array.isArray(field.options)) {
    // For a group of checkboxes, display each option with an optional per-option description.
    return `
      <div part="checkbox-group">
        ${(field.options || [])
          .map(
            (option, index) => `
            <label part="checkbox-container">
              <input 
                type="checkbox" 
                id="${field.name}-${index}" 
                name="${field.name}" 
                value="${option}" 
                ${field.required ? "required" : ""} 
                part="input-checkbox"
              />
              <div>
                <span part="checkbox-label">${option}</span>
                ${
                  field.descriptions && field.descriptions[index]
                    ? `<p part="checkbox-description">${field.descriptions[index]}</p>`
                    : ""
                }
              </div>
            </label>`
          )
          .join("")}
      </div>
    `;
  } else {
    // For a single checkbox, use inline label with a class based on labelPosition.
    const effectiveLabel = field.label || field.placeholder || "";
    const labelClass =
      field.labelPosition === "right"
        ? "inline-label right"
        : "inline-label left";
    return `
      <div part="checkbox-group">
        <label for="${
          field.name
        }" part="checkbox-container" class="${labelClass}">
          <input 
            type="checkbox" 
            id="${field.name}" 
            name="${field.name}" 
            ${field.required ? "required" : ""} 
            part="input-checkbox"
          />
          <div>
            <span part="checkbox-label">${effectiveLabel}</span>
            ${
              field.descriptions
                ? `<p part="checkbox-description">${field.descriptions}</p>`
                : ""
            }
          </div>
        </label>
      </div>
    `;
  }
}
