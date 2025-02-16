// events/field-handlers/select-input.handler.ts

/**
 * Select Input Handler
 *
 * Attaches event handlers for select elements (single or multiple).
 * Validates the selection and updates error states accordingly.
 */

import { SelectField } from "@interfaces/field.interface";
import { validateField } from "@utils/validation";
import { applyErrorState, clearErrorState } from "../validation.utils";

export function attachSelectHandler(
  field: SelectField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
): void {
  const select = form.querySelector(
    `[name="${field.name}"]`
  ) as HTMLSelectElement;
  if (!select) return;

  const errorElement = form.querySelector(
    `[data-error="${field.name}"]`
  ) as HTMLElement;
  const helpElement = form.querySelector(
    `[data-help="${field.name}"]`
  ) as HTMLElement;
  if (!errorElement) return;

  const validateSelect = () => {
    const result = validateField(field, select.value);

    if (!result.isValid && result.message) {
      applyErrorState(
        [select] as unknown as NodeListOf<HTMLInputElement>,
        errorElement,
        helpElement,
        result.message
      );
    } else {
      clearErrorState(
        [select] as unknown as NodeListOf<HTMLInputElement>,
        errorElement,
        helpElement
      );
    }

    updateSubmitButtonState();
  };

  select.addEventListener("change", validateSelect);
}
