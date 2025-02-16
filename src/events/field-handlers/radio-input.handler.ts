// events/field-handlers/radio-input.handler.ts

/**
 * Radio Input Handler
 *
 * Attaches event handlers for radio input fields,
 * ensuring at least one option is selected and updating error states.
 */

import { RadioField } from "@interfaces/field.interface";
import { validateField } from "@utils/validation";
import { applyErrorState, clearErrorState } from "../validation.utils";

export function attachRadioHandler(
  field: RadioField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
): void {
  const inputs = form.querySelectorAll(
    `[name="${field.name}"]`
  ) as NodeListOf<HTMLInputElement>;
  if (!inputs.length) return;

  const errorElement = form.querySelector(
    `[data-error="${field.name}"]`
  ) as HTMLElement;
  const helpElement = form.querySelector(
    `[data-help="${field.name}"]`
  ) as HTMLElement;
  if (!errorElement) return;

  const validateRadioGroup = () => {
    const selected = form.querySelector(`[name="${field.name}"]:checked`);
    const result = validateField(
      field,
      selected ? (selected as HTMLInputElement).value : ""
    );

    if (!result.isValid && result.message) {
      applyErrorState(inputs, errorElement, helpElement, result.message);
    } else {
      clearErrorState(inputs, errorElement, helpElement);
    }

    updateSubmitButtonState();
  };

  inputs.forEach((input) => {
    input.addEventListener("change", validateRadioGroup);
  });
}
