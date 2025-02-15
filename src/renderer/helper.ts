import { BaseField } from "@interfaces/core.interface";

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
  return Object.entries(attrs)
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
}

/**
 * Escapes HTML special characters in a string.
 * @param str The string to escape
 * @returns The escaped string
 */
function escapeHtml(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Renders a field label with proper attributes and escaping.
 * @param field The field configuration
 * @param id The input ID to link the label to
 * @param isHidden Whether the label should be visually hidden
 * @returns The rendered label HTML or empty string if no label
 */
export function renderFieldLabel(
  field: BaseField,
  id: string,
  isHidden?: boolean
): string {
  if (!field.label?.trim()) {
    return "";
  }

  const labelId = `label-${field.name}`;
  const labelParts = ["label"];
  if (isHidden) {
    labelParts.push("label-hidden");
  }

  const escapedLabel = escapeHtml(field.label);

  return `
    <label 
      id="${labelId}" 
      for="${id}" 
      part="${labelParts.join(" ")}"
    >${escapedLabel}</label>
  `;
}

/**
 * Renders help and error text elements within a message container.
 * @param field The field configuration
 * @returns The rendered message container HTML
 */
export function renderMessageContainer(field: BaseField): string {
  const helpId = `help-${field.name}`;
  const errorId = `error-${field.name}`;

  return `
    <div part="message-container">
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
}

/**
 * Renders common field wrapper elements.
 * @param field The field configuration
 * @param inputHtml The rendered input HTML
 * @returns The complete field HTML
 */
export function renderFieldWrapper(
  field: BaseField,
  inputHtml: string
): string {
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

  const describedBy = [field.helpText && helpId, errorId]
    .filter(Boolean)
    .join(" ");

  return `
    <div 
      id="${fieldId}" 
      part="${fieldParts.join(" ")}" 
      role="group" 
      aria-labelledby="${labelId}"
    >
      ${renderFieldLabel(field, field.name, field.hiddenLabel)}
      <div part="input-container">
        ${inputHtml.replace(
          'aria-describedby="',
          `aria-describedby="${describedBy}" `
        )}
      </div>
      ${renderMessageContainer(field)}
    </div>
  `;
}
