import { IRadioField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";
import { logger } from "@services/logger.service";

const LOG_CONTEXT = "RadioInputRenderer";

/**
 * Renders a radio button group based on the provided schema
 */
export function renderRadio(field: IRadioField): string {
  try {
    logger.debug(`Rendering radio group for field: ${field.name}`, LOG_CONTEXT);

    const groupParts = ["radio-group"];
    if (field.display) {
      groupParts.push(`radio-group-${field.display}`);
    } else {
      groupParts.push("radio-group-vertical"); // default to vertical
    }

    logger.debug(
      `Building radio group with ${field.options.length} options, display: ${field.display || "vertical"}`,
      LOG_CONTEXT
    );

    const input = `
    <div part="${groupParts.join(" ")}" role="radiogroup" aria-label="${field.label}">
      ${field.options
        .map((option, index) => {
          const value = typeof option === "string" ? option : option.value;
          const label = typeof option === "string" ? option : option.label;
          const checked = field.value === value ? "checked" : "";

          return `
            <label part="radio-container">
              <input 
                type="radio" 
                part="radio-input" 
                ${renderAttr({
                  name: field.name,
                  value: value,
                  required: field.required,
                  disabled: field.disabled,
                  "data-testid": `input-${field.name}-${index}`,
                  "aria-label": label,
                  checked,
                })} 
              />
              <span part="radio-label">${label}</span>
            </label>
          `;
        })
        .join("")}
    </div>
  `;

    logger.debug(
      `Radio group rendered successfully for: ${field.name}`,
      LOG_CONTEXT
    );
    return renderFieldWrapper(field, input);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(
      `Error rendering radio group for: ${field.name}`,
      err,
      LOG_CONTEXT
    );
    throw error;
  }
}
