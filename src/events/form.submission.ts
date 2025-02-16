// events/form.submission.ts

/**
 * Form Submission
 *
 * Collects form data based on the provided schema and validates remaining fields.
 * Ensures that any file inputs or checkbox groups are handled correctly.
 */

import { FormSchema } from "@interfaces/core.interface";
import { FormFieldSchema } from "@interfaces/field.interface";
import { validateForm } from "@utils/validation";

/**
 * Collects form data based on the provided schema.
 * @param form The HTMLFormElement from which to collect data.
 * @param schema The FormSchema defining the fields.
 * @returns A data object mapping field names to values.
 */
export function collectFormData(
  form: HTMLFormElement,
  schema: FormSchema
): Record<string, any> {
  const formData = new FormData(form);
  const data: Record<string, any> = {};
  const checkboxGroups = new Set<string>();

  // First pass: identify checkbox groups and initialize arrays
  formData.forEach((_value, key) => {
    if (key.endsWith("[]")) {
      const groupName = key.slice(0, -2);
      checkboxGroups.add(groupName);
      data[groupName] = [];
    }
  });

  // Second pass: process form data
  formData.forEach((value, key) => {
    if (key.endsWith("-required")) return; // Skip hidden required inputs

    const field = schema.fields.find(
      (f) => f.name === key || `${f.name}[]` === key
    );
    if (!field) return;

    if (field.type === "file") {
      const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
      data[key] = field.multiple
        ? input.files
          ? Array.from(input.files)
          : []
        : input.files && input.files.length > 0
          ? input.files[0]
          : "";
    } else if (checkboxGroups.has(key.replace("[]", ""))) {
      const groupName = key.replace("[]", "");
      data[groupName].push(value);
    } else if (field.type === "checkbox" && !field.options) {
      // Single checkbox
      const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
      data[key] = input.checked;
    } else {
      data[key] = value;
    }
  });

  // Ensure file inputs are present even if no file was selected
  schema.fields.forEach((field: FormFieldSchema) => {
    if (field.type === "file" && !(field.name in data)) {
      data[field.name] = field.multiple ? [] : "";
    }
  });

  return data;
}

/**
 * Validates remaining fields by running overall form validation.
 * Updates the corresponding error/help elements.
 * @param form HTMLFormElement
 * @param schema FormSchema
 * @param data The collected form data
 * @returns True if there are validation errors, false otherwise.
 */
export function validateRemainingFields(
  form: HTMLFormElement,
  schema: FormSchema,
  data: Record<string, any>
): boolean {
  let hasErrors = false;
  const validationResults = validateForm(schema, data);

  Object.entries(validationResults).forEach(([fieldName, result]) => {
    const errorElement = form.querySelector(
      `[data-error="${fieldName}"]`
    ) as HTMLElement;
    const helpElement = form.querySelector(
      `[data-help="${fieldName}"]`
    ) as HTMLElement;
    const inputs = form.querySelectorAll(
      `[name="${fieldName}"], [name="${fieldName}[]"]`
    ) as NodeListOf<HTMLInputElement>;

    if (!result.isValid && result.message) {
      hasErrors = true;
      errorElement.textContent = result.message;
      errorElement.setAttribute("part", "error-text error-text-visible");
      if (helpElement) {
        helpElement.setAttribute("part", "help-text help-text-hidden");
      }
      inputs.forEach((input) => {
        const inputParts = input.getAttribute("part")?.split(" ") || [];
        if (!inputParts.includes("input-invalid")) {
          inputParts.push("input-invalid");
        }
        input.setAttribute("part", inputParts.join(" "));
        input.setAttribute("aria-invalid", "true");
      });
    } else {
      errorElement.textContent = "";
      errorElement.setAttribute("part", "error-text");
      if (helpElement) {
        helpElement.setAttribute("part", "help-text");
      }
      inputs.forEach((input) => {
        const inputParts =
          input
            .getAttribute("part")
            ?.split(" ")
            .filter((p) => p !== "input-invalid") || [];
        input.setAttribute("part", inputParts.join(" "));
        input.setAttribute("aria-invalid", "false");
      });
    }
  });

  return hasErrors;
}
