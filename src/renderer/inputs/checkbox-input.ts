import { CheckboxField } from "../../interfaces/form.interface";

/**
 * Renders a checkbox field.
 */
export function renderCheckbox(field: CheckboxField): string {
  if (field.options && Array.isArray(field.options)) {
    // For a group of checkboxes with individual labels and optional descriptions.
    return `
      <div part="checkbox-group">
        ${field.options
          .map((option, index) => {
            const descriptionHtml =
              field.descriptions && field.descriptions[index]
                ? `<p part="checkbox-description">${field.descriptions[index]}</p>`
                : "";
            return `
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
                ${descriptionHtml}
              </div>
            </label>
          `;
          })
          .join("")}
      </div>
    `;
  } else {
    // For a single checkbox.
    const effectiveLabel = field.label || field.placeholder || "";
    const labelClass =
      field.labelPosition === "right"
        ? "inline-label right"
        : "inline-label left";
    const descriptionHtml = field.descriptions
      ? `<p part="checkbox-description">${field.descriptions}</p>`
      : "";
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
            ${descriptionHtml}
          </div>
        </label>
      </div>
    `;
  }
}
