import { ISelectField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";
import { logger } from "@services/logger.service";

const LOG_CONTEXT = "SelectInputRenderer";

/**
 * Renders a select dropdown field based on the provided schema
 */
export function renderSelect(field: ISelectField): string {
  try {
    logger.debug(
      `Rendering select input for field: ${field.name}`,
      LOG_CONTEXT
    );

    // Build input parts
    const inputParts = ["input", "input-select"];
    if (field.leadingIcon) {
      inputParts.push("input-leading-icon");
    }

    logger.debug(
      `Building select with ${field.options.length} options`,
      LOG_CONTEXT
    );

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

    logger.debug(
      `Select input rendered successfully for: ${field.name}`,
      LOG_CONTEXT
    );
    return renderFieldWrapper(field, input);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(
      `Error rendering select input for: ${field.name}`,
      err,
      LOG_CONTEXT
    );
    throw error;
  }
}
