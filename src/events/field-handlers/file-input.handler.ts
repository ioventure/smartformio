// events/field-handlers/file-input.handler.ts

/**
 * File Input Handler
 *
 * Attaches change event handlers to file input fields,
 * updates the file name display if present, and validates the file input.
 */

import { FileField } from "@interfaces/field.interface";
import { validateField } from "@utils/validation";
import { applyErrorState, clearErrorState } from "../validation.utils";

export function attachFileInputHandler(
  field: FileField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
): void {
  const inputs = form.querySelectorAll(
    `[name="${field.name}"], [name="${field.name}[]"]`
  ) as NodeListOf<HTMLInputElement>;

  if (!inputs.length) return;

  const input = inputs[0];
  input.addEventListener("change", () => {
    // Update file name display if an element exists
    const fileNameElement = input.parentElement
      ?.nextElementSibling as HTMLElement;
    if (fileNameElement) {
      fileNameElement.textContent =
        input.files && input.files.length > 0
          ? Array.from(input.files)
              .map((file) => file.name)
              .join(", ")
          : "";
    }

    const valueToValidate =
      input.files && input.files.length > 0
        ? field.multiple
          ? Array.from(input.files)
          : input.files[0]
        : "";

    const result = validateField(field, valueToValidate);
    const errorElement = form.querySelector(
      `[data-error="${field.name}"]`
    ) as HTMLElement;
    const helpElement = form.querySelector(
      `[data-help="${field.name}"]`
    ) as HTMLElement;

    if (!result.isValid && result.message) {
      applyErrorState(inputs, errorElement, helpElement, result.message);
    } else {
      clearErrorState(inputs, errorElement, helpElement);
    }

    updateSubmitButtonState();
  });
}
