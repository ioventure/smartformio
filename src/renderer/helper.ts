import { IBaseField } from "@interfaces/core.interface";
import { logger } from "@services/logger.service";

const LOG_CONTEXT = "FormRenderer:Helper";

type AttributeMap = Record<
  string,
  string | number | boolean | null | undefined
>;

/**
 * Renders HTML attributes from an attribute map.
 * @param attrs Object containing attribute names and values
 * @returns The rendered attributes string
 */
export function renderAttr(attrs: AttributeMap): string {
  try {
    logger.debug(
      `Rendering attributes: ${Object.keys(attrs).join(", ")}`,
      LOG_CONTEXT
    );

    const result = Object.entries(attrs)
      .map(([name, value]) => {
        if (typeof value === "boolean") {
          return value ? name : "";
        }
        if (value === null || value === undefined || value === "") {
          return "";
        }
        return `${name}="${value}"`;
      })
      .filter(Boolean)
      .join(" ");

    logger.debug("Rendered attributes successfully", LOG_CONTEXT);
    return result;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Error rendering attributes", err, LOG_CONTEXT);
    throw error;
  }
}

/**
 * Escapes HTML special characters in a string.
 * Uses a regex-based replacement for universal compatibility (SSR-friendly).
 * @param str The string to escape
 * @returns The escaped string
 */
function escapeHtml(str: string): string {
  try {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, "")
      .replace(/'/g, "&#039;");
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Error escaping HTML", err, LOG_CONTEXT);
    throw error;
  }
}

/**
 * Renders a field label with proper attributes and escaping.
 * @param field The field configuration
 * @param id The input ID to link the label to
 * @param isHidden Whether the label should be visually hidden
 * @returns The rendered label HTML or empty string if no label
 */
export function renderFieldLabel(
  field: IBaseField,
  id: string,
  isHidden?: boolean
): string {
  try {
    logger.debug(`Rendering label for field: ${field.name}`, LOG_CONTEXT);

    if (!field.label?.trim()) {
      logger.debug(`No label provided for field: ${field.name}`, LOG_CONTEXT);
      return "";
    }

    const labelId = `label-${field.name}`;
    const labelParts = ["label"];
    if (isHidden) {
      labelParts.push("label-hidden");
    }

    const escapedLabel = escapeHtml(field.label);

    logger.debug(
      `Label rendered successfully for field: ${field.name}`,
      LOG_CONTEXT
    );
    return `
      <label 
        id="${labelId}" 
        for="${id}" 
        part="${labelParts.join(" ")}"
      >${escapedLabel}</label>
    `;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(
      `Error rendering label for field: ${field.name}`,
      err,
      LOG_CONTEXT
    );
    throw error;
  }
}

/**
 * Renders help and error text elements within a message container.
 * @param field The field configuration
 * @returns The rendered message container HTML
 */
export function renderMessageContainer(field: IBaseField): string {
  try {
    logger.debug(
      `Rendering message container for field: ${field.name}`,
      LOG_CONTEXT
    );

    const helpId = `help-${field.name}`;
    const errorId = `error-${field.name}`;

    // Determine container parts based on content
    const containerParts = ["message-container"];
    if (!field.helpText) {
      containerParts.push("message-container-empty");
    }

    const result = `
      <div part="${containerParts.join(" ")}">
        ${
          field.helpText
            ? `
          <div 
            id="${helpId}" 
            part="help-text" 
            data-help="${field.name}"
          >${escapeHtml(field.helpText)}</div>
        `
            : ""
        }
        <div 
          id="${errorId}" 
          part="error-text" 
          data-error="${field.name}"
          role="alert" 
          aria-live="polite"
        ></div>
      </div>
    `;

    logger.debug(
      `Message container rendered successfully for field: ${field.name}`,
      LOG_CONTEXT
    );
    return result;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(
      `Error rendering message container for field: ${field.name}`,
      err,
      LOG_CONTEXT
    );
    throw error;
  }
}

/**
 * Renders common field wrapper elements.
 * Updates the inner input HTML to ensure that the aria-describedby attribute is set robustly.
 * @param field The field configuration
 * @param inputHtml The rendered input HTML
 * @returns The complete field HTML
 */
export function renderFieldWrapper(
  field: IBaseField,
  inputHtml: string
): string {
  try {
    logger.debug(`Rendering field wrapper for: ${field.name}`, LOG_CONTEXT);

    const fieldId = `field-${field.name}`;
    const labelId = `label-${field.name}`;
    const helpId = `help-${field.name}`;
    const errorId = `error-${field.name}`;

    // Build field parts
    const fieldParts = ["field"];
    if (field.required) {
      fieldParts.push("field-required");
    }
    if (field.disabled) {
      fieldParts.push("field-disabled");
    }

    const describedBy = [field.helpText ? helpId : null, errorId]
      .filter(Boolean)
      .join(" ");

    // Robustly inject or replace the aria-describedby attribute in the input HTML
    let modifiedInputHtml = inputHtml;
    if (/aria-describedby="/.test(inputHtml)) {
      // Replace existing aria-describedby value using a regex
      modifiedInputHtml = inputHtml.replace(
        /aria-describedby="[^"]*"/,
        `aria-describedby="${describedBy}"`
      );
    } else {
      // Insert aria-describedby attribute into the first input tag
      modifiedInputHtml = inputHtml.replace(
        /(<input\b[^>]*)(>)/,
        `$1 aria-describedby="${describedBy}"$2`
      );
    }

    const result = `
      <div 
        id="${fieldId}" 
        part="${fieldParts.join(" ")}" 
        role="group" 
        aria-labelledby="${labelId}"
      >
        ${renderFieldLabel(field, field.name, field.hiddenLabel)}
        <div part="input-container">
          ${modifiedInputHtml}
        </div>
        ${renderMessageContainer(field)}
      </div>
    `;

    logger.debug(
      `Field wrapper rendered successfully for: ${field.name}`,
      LOG_CONTEXT
    );
    return result;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(
      `Error rendering field wrapper for: ${field.name}`,
      err,
      LOG_CONTEXT
    );
    throw error;
  }
}
