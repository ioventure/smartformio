import { RadioField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";

/**
 * Renders a radio button group based on the provided schema
 */
export function renderRadio(field: RadioField): string {
  const input = `
    <div part="radio-group">
      ${field.options
        .map(
          (option, index) => `
        <div part="radio-container">
          <input type="radio" part="input" ${renderAttr({
            name: field.name,
            value: option,
            id: `${field.name}-${index}`,
            required: field.required,
            disabled: field.disabled,
            class: field.className,
            "data-testid": `input-${field.name}-${index}`,
          })} />
          <label part="radio-label" for="${field.name}-${index}">${option}</label>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  return renderFieldWrapper(field, input);
}
