import { ISelectField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";

/**
 * Renders a select dropdown field based on the provided schema
 */
export function renderSelect(field: ISelectField): string {
  // Build input parts
  const inputParts = ["input", "input-select"];
  if (field.leadingIcon) {
    inputParts.push("input-leading-icon");
  }

  const input = `
    <div part="input-wrapper">
      ${field.leadingIcon ? `<span part="leading-icon">${field.leadingIcon}</span>` : ""}
      <select 
        part="${inputParts.join(" ")}" 
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
          .map((option) => {
            const value = typeof option === "string" ? option : option.value;
            const label = typeof option === "string" ? option : option.label;
            const selected = field.value === value ? "selected" : "";
            return `<option value="${value}" ${selected}>${label}</option>`;
          })
          .join("")}
      </select>
    </div>
  `;

  return renderFieldWrapper(field, input);
}
