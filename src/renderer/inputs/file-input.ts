import { FileField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";

/**
 * Renders a file input field based on the provided schema
 */
export function renderFileInput(field: FileField): string {
  // Build input parts
  const inputParts = ["input", "input-file"];
  if (field.leadingIcon) {
    inputParts.push("input-leading-icon");
  }

  // Default button text based on multiple property
  const defaultButtonText = field.multiple ? "Upload Files" : "Upload File";

  const input = `
    <div part="input-wrapper">
      ${field.leadingIcon ? `<span part="leading-icon">${field.leadingIcon}</span>` : ""}
      <input 
        type="file" 
        part="${inputParts.join(" ")}" 
        ${renderAttr({
          name: field.name,
          required: field.required,
          disabled: field.disabled,
          "data-testid": `input-${field.name}`,
          accept: field.accept,
          multiple: field.multiple,
          "aria-label": field.label,
          "aria-required": field.required ? "true" : undefined,
          "aria-describedby": `help-${field.name} error-${field.name}`,
          "aria-invalid": "false",
          title: field.buttonText || defaultButtonText
        })} 
      />
      <span part="file-name"></span>
    </div>
  `;

  return renderFieldWrapper(field, input);
}
