import { IBaseField } from "@interfaces/core.interface";

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
 * Uses a regex-based replacement for universal compatibility (SSR-friendly).
 * @param str The string to escape
 * @returns The escaped string
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
export function renderMessageContainer(field: IBaseField): string {
  const helpId = `help-${field.name}`;
  const errorId = `error-${field.name}`;

  // Determine container parts based on content
  const containerParts = ["message-container"];
  if (!field.helpText) {
    containerParts.push("message-container-empty");
  }

  return `
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

  return `
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
}
