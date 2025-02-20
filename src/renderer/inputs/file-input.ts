import { IFileField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";
import { logger } from "@services/logger.service";
const LOG_CONTEXT = "FileInputRenderer";

/**
 * Renders a file input field based on the provided schema
 */
export function renderFileInput(field: IFileField): string {
  try {
    logger.debug(`Rendering file input for field: ${field.name}`, LOG_CONTEXT);

    // Build input parts
    const inputParts = ["input", "input-file"];
    if (field.leadingIcon) {
      inputParts.push("input-leading-icon");
    }

    logger.debug(`Building file input`, LOG_CONTEXT);

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
        })} 
      />
    </div>
  `;

    logger.debug(
      `File input rendered successfully for: ${field.name}`,
      LOG_CONTEXT
    );
    return renderFieldWrapper(field, input);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(
      `Error rendering file input for: ${field.name}`,
      err,
      LOG_CONTEXT
    );
    throw error;
  }
}
