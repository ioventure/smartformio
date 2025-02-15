import { CheckboxField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";

/**
 * Renders a checkbox input or group based on the provided schema
 */
export function renderCheckbox(field: CheckboxField): string {
  // If options are provided, render a checkbox group
  if (field.options && field.options.length > 0) {
    const input = `
      <div part="checkbox-group">
        ${field.options
          .map(
            (option, index) => `
          <div part="checkbox-container">
            <input type="checkbox" part="input" ${renderAttr({
              name: `${field.name}[]`,
              value: option,
              id: `${field.name}-${index}`,
              required: field.required,
              disabled: field.disabled,
              class: field.className,
              "data-testid": `input-${field.name}-${index}`,
            })} />
            <label part="checkbox-label" for="${field.name}-${index}">
              ${option}
              ${
                field.descriptions?.[index]
                  ? `<span part="checkbox-description">${field.descriptions[index]}</span>`
                  : ""
              }
            </label>
          </div>
        `
          )
          .join("")}
      </div>
    `;
    return renderFieldWrapper(field, input);
  }

  // Otherwise, render a single checkbox
  const input = `
    <div part="checkbox-container">
      <input type="checkbox" part="input" ${renderAttr({
        name: field.name,
        id: field.name,
        required: field.required,
        disabled: field.disabled,
        class: field.className,
        "data-testid": `input-${field.name}`,
      })} />
      <label part="checkbox-label" for="${field.name}">
        ${field.label || ""}
        ${
          field.descriptions?.[0]
            ? `<span part="checkbox-description">${field.descriptions[0]}</span>`
            : ""
        }
      </label>
    </div>
  `;

  return renderFieldWrapper(field, input);
}
