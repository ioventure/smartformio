import { DateField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";

/**
 * Renders a date input field based on the provided schema
 */
export function renderDateInput(field: DateField): string {
  // Build date input parts
  const dateParts = ["input", "input-date"];
  if (field.leadingIcon) {
    dateParts.push("input-leading-icon");
  }

  const input = `
    <div part="input-wrapper">
      ${field.leadingIcon ? `<span part="leading-icon">${field.leadingIcon}</span>` : ""}
      <input 
        part="${dateParts.join(" ")}"
        type="date"
        ${renderAttr({
          name: field.name,
          required: field.required,
          readonly: field.readonly,
          disabled: field.disabled,
          min: field.min?.toString(),
          max: field.max?.toString(),
          "data-testid": `input-${field.name}`,
          "aria-label": field.label,
          "aria-required": field.required ? "true" : undefined,
          "aria-describedby": `help-${field.name} error-${field.name}`,
          "aria-invalid": "false",
          value: field.value,
        })}
      />
    </div>
  `;

  return renderFieldWrapper(field, input);
}
