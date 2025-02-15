import { SelectField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";

/**
 * Renders a select dropdown field based on the provided schema
 */
export function renderSelect(field: SelectField): string {
  const input = `
    <div part="input-wrapper">
      <select part="input" ${renderAttr({
        name: field.name,
        required: field.required,
        disabled: field.disabled,
        class: field.className,
        "data-testid": `input-${field.name}`,
      })}>
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
