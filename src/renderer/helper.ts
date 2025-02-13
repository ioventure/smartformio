import { FormFieldSchema } from "../interfaces/form.interface";

/**
 * Helper function to conditionally render an attribute.
 */
export function renderAttr(
  attr: string,
  value: string | number | undefined
): string {
  return value ? `${attr}="${value}" ` : "";
}

/**
 * Renders a label for a field.
 * If no label is provided, it falls back to the placeholder.
 */
export function renderFieldLabel(
  field: FormFieldSchema,
  forId?: string,
  className?: string
): string {
  const effectiveLabel = field.label || field.placeholder;
  if (!effectiveLabel) return "";
  return `<label part="label" ${forId ? `for="${forId}"` : ""} ${
    className ? `class="${className}"` : ""
  }>${effectiveLabel}</label>`;
}
