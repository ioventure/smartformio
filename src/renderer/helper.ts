import { BaseField } from "../interfaces/form.interface";

/**
 * Renders an HTML attribute if the value is defined.
 *
 * @param name - The attribute name
 * @param value - The attribute value
 * @returns Formatted attribute string or empty string if value is undefined
 * @example
 * renderAttr("placeholder", "Enter text") // returns 'placeholder="Enter text"'
 * renderAttr("required", undefined) // returns ''
 */
export function renderAttr(
  name: string,
  value: string | number | undefined
): string {
  try {
    if (value === undefined || value === null) {
      return "";
    }
    return `${name}="${value}"`;
  } catch (error) {
    console.error(`Error rendering attribute ${name}:`, error);
    return "";
  }
}

/**
 * Renders a field label with optional screen reader only class.
 *
 * @param field - The field configuration
 * @param forId - The ID of the input this label is for
 * @param srOnlyClass - Optional class name for screen reader only labels
 * @returns HTML string for the label
 * @example
 * renderFieldLabel(field, "username") // returns '<label for="username">Username</label>'
 */
export function renderFieldLabel(
  field: BaseField,
  forId: string,
  srOnlyClass: string = ""
): string {
  try {
    if (!field.label) {
      return "";
    }

    const className = srOnlyClass ? ` class="${srOnlyClass}"` : "";
    return `<label for="${forId}" part="label"${className}>${field.label}</label>`;
  } catch (error) {
    console.error(`Error rendering label for ${forId}:`, error);
    return "";
  }
}

/**
 * Sanitizes a string for safe HTML insertion.
 * Prevents XSS by escaping special characters.
 *
 * @param value - The string to sanitize
 * @returns Sanitized string safe for HTML insertion
 * @example
 * sanitizeHtml('<script>alert("xss")</script>')
 * // returns '<script>alert("xss")</script>'
 */
export function sanitizeHtml(value: string): string {
  try {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
  } catch (error) {
    console.error("Error sanitizing HTML:", error);
    return "";
  }
}

/**
 * Generates a unique ID for form elements.
 *
 * @param prefix - Optional prefix for the ID
 * @returns Unique ID string
 * @example
 * generateId('field') // returns 'field-1234567890'
 */
export function generateId(prefix: string = "field"): string {
  try {
    return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
  } catch (error) {
    console.error("Error generating ID:", error);
    return `${prefix}-fallback`;
  }
}

/**
 * Debounces a function call.
 *
 * @param func - The function to debounce
 * @param wait - Time to wait in milliseconds
 * @returns Debounced function
 * @example
 * const debouncedValidate = debounce(validateField, 200);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
