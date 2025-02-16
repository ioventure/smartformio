// events/field-handlers/checkbox-input.handler.ts

/**
 * Checkbox Input Handler
 *
 * Attaches event handlers for checkbox fields. This handler covers both:
 *  - Checkbox groups (when field.options is provided)
 *  - Single checkboxes (when field.options is undefined)
 *
 * It enforces the minimum/maximum selection requirements for groups and
 * validates a single checkbox based on its required state.
 */

import { CheckboxField } from "@interfaces/field.interface";
import { applyErrorState, clearErrorState } from "../validation.utils";

export function attachCheckboxHandler(
  field: CheckboxField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
): void {
  // Determine the selector based on whether this is a group or single checkbox.
  const selector = field.options
    ? `[name="${field.name}"], [name="${field.name}[]"]`
    : `[name="${field.name}"]`;
  const inputs = form.querySelectorAll(
    selector
  ) as NodeListOf<HTMLInputElement>;

  // Common error and help elements for the field.
  const errorElement = form.querySelector(
    `[data-error="${field.name}"]`
  ) as HTMLElement;
  const helpElement = form.querySelector(
    `[data-help="${field.name}"]`
  ) as HTMLElement;

  // If no inputs or error element found, nothing to attach.
  if (!inputs.length || !errorElement) return;

  if (field.options) {
    // --- Checkbox Group Logic ---
    // Assume there might be multiple checkboxes and use an additional hidden input if needed.
    const requiredInput = form.querySelector(
      `[data-required-group="${field.name}"]`
    ) as HTMLInputElement;

    inputs.forEach((input) => {
      input.addEventListener("change", () => {
        const checkedInputs = Array.from(inputs).filter((inp) => inp.checked);
        const checkedCount = checkedInputs.length;
        const minSelect =
          field.minSelect !== undefined
            ? field.minSelect
            : field.required
              ? 1
              : 0;
        const maxSelect =
          field.maxSelect !== undefined ? field.maxSelect : Infinity;

        if (checkedCount < minSelect) {
          applyErrorState(
            inputs,
            errorElement,
            helpElement,
            `Please select at least ${minSelect} option${minSelect > 1 ? "s" : ""}`
          );
          if (requiredInput) requiredInput.value = "";
        } else if (checkedCount > maxSelect) {
          applyErrorState(
            inputs,
            errorElement,
            helpElement,
            `Please select no more than ${maxSelect} option${maxSelect > 1 ? "s" : ""}`
          );
          if (requiredInput) requiredInput.value = "";
        } else {
          clearErrorState(inputs, errorElement, helpElement);
          if (requiredInput)
            requiredInput.value = checkedCount > 0 ? "true" : "";
        }

        if (field.maxSelect) {
          const canSelect = checkedCount < maxSelect;
          inputs.forEach((inp) => {
            (inp as HTMLInputElement).disabled =
              !(inp as HTMLInputElement).checked && !canSelect;
          });
        }
        updateSubmitButtonState();
      });
    });
  } else {
    // --- Single Checkbox Logic ---
    const input = inputs[0];
    input.addEventListener("change", () => {
      // For a single checkbox, if it's required, validate that it's checked.
      const isValid = field.required ? input.checked : true;
      if (!isValid) {
        applyErrorState(
          [input] as unknown as NodeListOf<HTMLInputElement>,
          errorElement,
          helpElement,
          "This field is required"
        );
      } else {
        clearErrorState(
          [input] as unknown as NodeListOf<HTMLInputElement>,
          errorElement,
          helpElement
        );
      }
      updateSubmitButtonState();
    });
  }
}
