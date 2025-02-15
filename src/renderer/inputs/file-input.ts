import { FileField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";

/**
 * Renders a file input field based on the provided schema
 */
export function renderFileInput(field: FileField): string {
  const input = `
    <div part="input-wrapper">
      <input type="file" part="input" ${renderAttr({
        name: field.name,
        required: field.required,
        disabled: field.disabled,
        class: field.className,
        "data-testid": `input-${field.name}`,
        accept: field.accept,
        multiple: field.multiple,
      })} />
    </div>
  `;

  return renderFieldWrapper(field, input);
}
