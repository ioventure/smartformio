import { IDateField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";
import { logger } from "@services/logger.service";

const LOG_CONTEXT = "DateInputRenderer";

/**
 * Renders a date input field based on the provided schema
 */
export function renderDateInput(field: IDateField): string {
  try {
    logger.debug(`Rendering date input for field: ${field.name}`, LOG_CONTEXT);

    // Build date input parts
    const dateParts = ["input", "input-date"];
    if (field.leadingIcon) {
      dateParts.push("input-leading-icon");
    }

    logger.debug(
      `Building date input with constraints: min=${field.min || "none"}, max=${field.max || "none"}`,
      LOG_CONTEXT
    );

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

    logger.debug(
      `Date input rendered successfully for: ${field.name}`,
      LOG_CONTEXT
    );
    return renderFieldWrapper(field, input);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(
      `Error rendering date input for: ${field.name}`,
      err,
      LOG_CONTEXT
    );
    throw error;
  }
}
