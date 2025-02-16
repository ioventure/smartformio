// events/field-handlers/date-input.handler.ts

/**
 * Date Input Handler
 *
 * Attaches event handlers for date inputs.
 * Triggers the native date picker on click and validates on change.
 */

import { DateField } from "@interfaces/field.interface";
import { validateField } from "@utils/validation";
import { applyErrorState, clearErrorState } from "../validation.utils";

export function attachDateInputHandler(
  field: DateField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
): void {
  const inputs = form.querySelectorAll(
    `[name="${field.name}"], [name="${field.name}[]"]`
  ) as NodeListOf<HTMLInputElement>;

  if (!inputs.length) return;

  const input = inputs[0];
  input.addEventListener("click", () => {
    input.showPicker?.();
  });

  input.addEventListener("change", () => {
    const result = validateField(field, input.value);
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
