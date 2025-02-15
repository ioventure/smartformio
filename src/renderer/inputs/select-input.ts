import { SelectField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";

/**
 * Renders a select dropdown field based on the provided schema
 */
export function renderSelect(field: SelectField): string {
  // Build select parts
  const selectParts = ["input", "input-select"];
  if (field.leadingIcon) {
    selectParts.push("input-leading-icon");
  }

  const input = `
    <div part="input-wrapper">
      ${field.leadingIcon ? `<span part="leading-icon">${field.leadingIcon}</span>` : ""}
      <select 
        part="${selectParts.join(" ")}" 
        ${renderAttr({
          name: field.name,
          required: field.required,
          disabled: field.disabled,
          "data-testid": `input-${field.name}`,
          "aria-label": field.label,
          "aria-required": field.required ? "true" : undefined,
          "aria-describedby": `help-${field.name} error-${field.name}`,
          "aria-invalid": "false",
        })}
      >
        ${field.options
          .map(
            (option) => `
          <option value="${option}">${option}</option>
        `
          )
          .join("")}
      </select>
    </div>
  `;

  return renderFieldWrapper(field, input);
}
