import { ITextField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";
import { logger } from "@services/logger.service";

const LOG_CONTEXT = "TextInputRenderer";

/**
 * Renders a text input field based on the provided schema
 */
export function renderTextInput(field: ITextField): string {
  try {
    logger.debug(
      `Rendering ${field.type} input for field: ${field.name}`,
      LOG_CONTEXT
    );

    // Handle textarea separately as it's a different element
    if (field.type === "textarea") {
      logger.debug("Rendering as textarea", LOG_CONTEXT);
      const input = `
        <div part="input-wrapper">
          <textarea 
            part="input input-textarea" 
            ${renderAttr({
              name: field.name,
              placeholder: field.placeholder,
              required: field.required,
              readonly: field.readonly,
              disabled: field.disabled,
              "data-testid": `input-${field.name}`,
              minlength: field.minLength?.toString(),
              maxlength: field.maxLength?.toString(),
              "aria-label": field.label,
              "aria-required": field.required ? "true" : undefined,
              "aria-describedby": `help-${field.name} error-${field.name}`,
              "aria-invalid": "false",
            })}
          >${field.value || ""}</textarea>
        </div>
      `;
      return renderFieldWrapper(field, input);
    }

    // Handle specific attributes for different input types
    logger.debug(
      `Applying type-specific attributes for ${field.type}`,
      LOG_CONTEXT
    );
    const typeSpecificAttrs: Record<string, any> = {
      number: {
        min: field.min?.toString(),
        max: field.max?.toString(),
        step: "1",
        inputmode: "numeric",
      },
      email: {
        pattern: field.pattern || "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        autocomplete: "email",
        inputmode: "email",
      },
      password: {
        autocomplete: "new-password",
        minlength: field.minLength?.toString(),
      },
      text: {
        pattern: field.pattern,
        autocomplete: field.name === "username" ? "username" : "off",
      },
    };

    // Build input parts
    const inputParts = ["input"];
    if (field.type) {
      inputParts.push(`input-${field.type}`);
    }
    if (field.leadingIcon) {
      inputParts.push("input-leading-icon");
    }
    if (field.trailingIcon) {
      inputParts.push("input-trailing-icon");
    }

    logger.debug(
      `Building input with parts: ${inputParts.join(", ")}`,
      LOG_CONTEXT
    );

    const input = `
      <div part="input-wrapper">
        ${field.leadingIcon ? `<span part="leading-icon">${field.leadingIcon}</span>` : ""}
        <input 
          part="${inputParts.join(" ")}"
          ${renderAttr({
            type: field.type,
            name: field.name,
            placeholder: field.placeholder,
            required: field.required,
            readonly: field.readonly,
            disabled: field.disabled,
            "data-testid": `input-${field.name}`,
            minlength: field.minLength?.toString(),
            maxlength: field.maxLength?.toString(),
            "aria-label": field.label,
            "aria-required": field.required ? "true" : undefined,
            "aria-describedby": `help-${field.name} error-${field.name}`,
            "aria-invalid": "false",
            ...(typeSpecificAttrs[field.type] || {}),
            value: field.value,
          })} 
        />
        ${field.trailingIcon ? `<span part="trailing-icon">${field.trailingIcon}</span>` : ""}
      </div>
    `;

    logger.debug(`Input rendered successfully for ${field.name}`, LOG_CONTEXT);

    return renderFieldWrapper(field, input);
  } catch (error) {
    logger.error(
      `Error rendering ${field.type} input for ${field.name}`,
      error instanceof Error ? error : new Error(String(error)),
      LOG_CONTEXT
    );
    throw error;
  }
}
