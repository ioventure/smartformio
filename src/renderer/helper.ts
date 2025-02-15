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
 * @param className Optional CSS class name
 * @returns The rendered label HTML or empty string if no label
 */
export function renderFieldLabel(
  field: BaseField,
  id: string,
  className?: string
): string {
  if (!field.label?.trim()) {
    return "";
  }

  const classAttr = className ? ` class="${className}"` : "";
  const escapedLabel = escapeHtml(field.label);

  return `
    <label for="${id}" part="label"${classAttr}>${escapedLabel}</label>
  `;
}

/**
 * Renders a help text element.
 * @param field The field configuration
 * @returns The rendered help text HTML or empty string if no help text
 */
export function renderHelpText(field: BaseField): string {
  if (!field.helpText) {
    return "";
  }

  return `
    <div part="help-text" data-help="${field.name}" style="display: block;">
      ${escapeHtml(field.helpText)}
    </div>
  `;
}

/**
 * Renders an error text element.
 * @param field The field configuration
 * @returns The rendered error text HTML
 */
export function renderErrorText(field: BaseField): string {
  return `
    <div part="error-text" data-error="${field.name}" style="display: none;"></div>
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
  return `
    <div class="field" part="field">
      ${renderFieldLabel(field, field.name, field.hiddenLabel ? "sr-only" : "")}
      ${inputHtml}
      ${renderHelpText(field)}
      ${renderErrorText(field)}
    </div>
  `;
}
