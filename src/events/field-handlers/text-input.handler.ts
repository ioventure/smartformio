// events/field-handlers/text-input.handler.ts

/**
 * Text Input Handler
 *
 * Attaches validation event handlers for standard text-based inputs
 * (e.g., text, email, password). Listens to blur and input events to trigger validation.
 */

import {
  FormFieldSchema,
  FileField,
  TextField,
} from "@interfaces/field.interface";
import { validateField } from "@utils/validation";
import { applyErrorState, clearErrorState } from "../validation.utils";

/**
 * Type guard for file fields (to exclude them from text logic).
 */
function isFileField(field: FormFieldSchema): field is FileField {
  return field.type === "file";
}

export function attachTextInputHandler(
  field: TextField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
): void {
  const inputs = form.querySelectorAll(
    `[name="${field.name}"], [name="${field.name}[]"]`
  ) as NodeListOf<HTMLInputElement>;

  if (!inputs.length) return;

  const errorElement = form.querySelector(
    `[data-error="${field.name}"]`
  ) as HTMLElement;
  const helpElement = form.querySelector(
    `[data-help="${field.name}"]`
  ) as HTMLElement;
  if (!errorElement) return;

  const validateAndShowError = () => {
    const input = inputs[0];
    const result = validateField(field, input.value);

    if (!result.isValid && result.message) {
      applyErrorState(inputs, errorElement, helpElement, result.message);
    } else {
      clearErrorState(inputs, errorElement, helpElement);
    }

    updateSubmitButtonState();
  };

  inputs[0].addEventListener("blur", validateAndShowError);

  if (form.dataset.validateOnChange === "true" && !isFileField(field)) {
    inputs[0].addEventListener("input", () => {
      setTimeout(validateAndShowError, 0);
    });
  }
}
