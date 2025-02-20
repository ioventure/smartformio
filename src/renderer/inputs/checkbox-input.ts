import { ICheckboxField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";
import { logger } from "@services/logger.service";

const LOG_CONTEXT = "CheckboxInputRenderer";

/**
 * Renders a checkbox input or group based on the provided schema
 */
export function renderCheckbox(field: ICheckboxField): string {
  try {
    logger.debug(
      `Rendering checkbox input for field: ${field.name}`,
      LOG_CONTEXT
    );

    // Handle single checkbox
    if (!field.options) {
      logger.debug("Rendering single checkbox", LOG_CONTEXT);
      const input = `
        <div part="checkbox-wrapper">
          <label part="checkbox-container">
            <input 
              type="checkbox" 
              part="checkbox-input" 
              ${renderAttr({
                name: field.name,
                required: field.required,
                disabled: field.disabled,
                "data-testid": `input-${field.name}`,
                "aria-label": field.label,
                "aria-required": field.required ? "true" : undefined,
                "aria-describedby": field.description
                  ? `description-${field.name}`
                  : undefined,
                "aria-invalid": "false",
                checked: field.value ? "true" : undefined,
              })} 
            />
            <div part="checkbox-content">
              <span part="checkbox-label">${field.label}</span>
              ${
                field.description
                  ? `<span part="checkbox-description" id="description-${field.name}">${field.description}</span>`
                  : ""
              }
            </div>
          </label>
        </div>
      `;
      logger.debug("Single checkbox rendered successfully", LOG_CONTEXT);
      return renderFieldWrapper(field, input);
    }

    // Handle checkbox group
    logger.debug(
      `Rendering checkbox group with ${field.options.length} options`,
      LOG_CONTEXT
    );

    const groupParts = ["checkbox-group"];
    if (field.display) {
      groupParts.push(`checkbox-group-${field.display}`);
    } else {
      groupParts.push("checkbox-group-vertical"); // default to vertical
    }

    logger.debug(
      `Building checkbox group with display: ${field.display || "vertical"}, ` +
        `minSelect: ${field.minSelect || "none"}, maxSelect: ${field.maxSelect || "none"}`,
      LOG_CONTEXT
    );

    const input = `
      <div 
        part="${groupParts.join(" ")}" 
        role="group" 
        aria-label="${field.label}"
        ${field.minSelect ? `data-min-select="${field.minSelect}"` : ""}
        ${field.maxSelect ? `data-max-select="${field.maxSelect}"` : ""}
      >
        ${
          field.required
            ? `
          <input 
            type="hidden" 
            name="${field.name}-required" 
            data-required-group="${field.name}" 
            required
          />
        `
            : ""
        }
        ${field.options
          .map((option, index) => {
            const value = typeof option === "string" ? option : option.value;
            const label = typeof option === "string" ? option : option.label;
            const description =
              typeof option === "string" ? undefined : option.description;
            const isChecked =
              Array.isArray(field.value) && field.value.includes(value);

            // Build aria-describedby by combining description and error container.
            let ariaDescribedBy = "";
            if (description) {
              ariaDescribedBy += `description-${field.name}-${index}`;
            }
            // Always add error element id so that error messages are announced.
            ariaDescribedBy +=
              (ariaDescribedBy ? " " : "") + `error-${field.name}`;

            return `
            <label part="checkbox-container">
              <input 
                type="checkbox" 
                part="checkbox-input" 
                ${renderAttr({
                  name: `${field.name}[]`,
                  value: value,
                  required: field.required,
                  disabled: field.disabled,
                  "data-testid": `input-${field.name}-${index}`,
                  "data-group": field.name,
                  "data-group-index": index.toString(),
                  "aria-label": label,
                  "aria-describedby": ariaDescribedBy,
                  "aria-invalid": "false",
                  checked: isChecked ? "true" : undefined,
                  "data-min-select": field.minSelect?.toString(),
                  "data-max-select": field.maxSelect?.toString(),
                })}
              />
              <div part="checkbox-content">
                <span part="checkbox-label">${label}</span>
                ${
                  description
                    ? `<span part="checkbox-description" id="description-${field.name}-${index}">${description}</span>`
                    : ""
                }
              </div>
            </label>
          `;
          })
          .join("")}
      </div>
    `;

    logger.debug(
      `Checkbox group rendered successfully for: ${field.name}`,
      LOG_CONTEXT
    );
    return renderFieldWrapper(field, input);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(
      `Error rendering checkbox input for: ${field.name}`,
      err,
      LOG_CONTEXT
    );
    throw error;
  }
}
