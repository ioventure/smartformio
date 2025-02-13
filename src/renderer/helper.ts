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
 * Uses the field's label if provided; if not, falls back to its placeholder.
 * Optionally assigns an id and CSS class.
 */
export function renderFieldLabel(
  field: FormFieldSchema,
  forId?: string,
  className?: string
): string {
  const effectiveLabel = field.label;
  if (!effectiveLabel) return "";
  return `<label part="label" ${forId ? `for="${forId}"` : ""} ${
    className ? `class="${className}"` : ""
  }>${effectiveLabel}</label>`;
}
