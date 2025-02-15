import { TextField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";

/**
 * Renders a text input field based on the provided schema
 */
export function renderTextInput(field: TextField): string {
  const input = `
    <div part="input-wrapper">
      ${field.leadingIcon ? `<span part="leading-icon">${field.leadingIcon}</span>` : ""}
      <input part="input" ${renderAttr({
        type: field.type,
        name: field.name,
        placeholder: field.placeholder,
        required: field.required,
        readonly: field.readonly,
        disabled: field.disabled,
        class: field.className,
        "data-testid": `input-${field.name}`,
        minlength: field.minLength?.toString(),
        maxlength: field.maxLength?.toString(),
        min: field.min?.toString(),
        max: field.max?.toString(),
        pattern: field.pattern,
      })} />
      ${field.trailingIcon ? `<span part="trailing-icon">${field.trailingIcon}</span>` : ""}
    </div>
  `;

  return renderFieldWrapper(field, input);
}
