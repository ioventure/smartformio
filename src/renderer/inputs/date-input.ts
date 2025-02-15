import { DateField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";

/**
 * Renders a date input field based on the provided schema
 */
export function renderDateInput(field: DateField): string {
  const input = `
    <div part="input-wrapper">
      <input type="date" part="input" ${renderAttr({
        name: field.name,
        required: field.required,
        readonly: field.readonly,
        disabled: field.disabled,
        class: field.className,
        "data-testid": `input-${field.name}`,
        min: field.min?.toString(),
        max: field.max?.toString(),
        format: field.format,
      })} />
    </div>
  `;

  return renderFieldWrapper(field, input);
}
