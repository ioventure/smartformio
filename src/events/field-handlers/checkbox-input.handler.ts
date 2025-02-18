import { CheckboxField } from "@interfaces/field.interface";
import { applyErrorState, clearErrorState } from "../validation.utils";
import { logger } from "@services/logger.service";

/**
 * Singleton CheckboxInputHandler Service
 * Attaches event handlers for checkbox fields.
 */
export class CheckboxInputHandler {
  private static instance: CheckboxInputHandler;
  private readonly logContext = "CheckboxInputHandler";

  private constructor() {
    logger.info("CheckboxInputHandler singleton initialized", this.logContext);
  }

  /**
   * Get the singleton instance of CheckboxInputHandler
   */
  public static getInstance(): CheckboxInputHandler {
    if (!CheckboxInputHandler.instance) {
      CheckboxInputHandler.instance = new CheckboxInputHandler();
    }
    return CheckboxInputHandler.instance;
  }

  /**
   * Attaches event handlers for checkbox fields.
   */
  public attachHandler(
    field: CheckboxField,
    form: HTMLFormElement,
    updateSubmitButtonState: () => void
  ): void {
    const selector = field.options
      ? `[name="${field.name}"], [name="${field.name}[]"]`
      : `[name="${field.name}"]`;
    const inputs = form.querySelectorAll(
      selector
    ) as NodeListOf<HTMLInputElement>;

    const errorElement = form.querySelector(
      `[data-error="${field.name}"]`
    ) as HTMLElement;
    const helpElement = form.querySelector(
      `[data-help="${field.name}"]`
    ) as HTMLElement;

    if (!inputs.length || !errorElement) return;

    if (field.options) {
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
      const input = inputs[0];
      input.addEventListener("change", () => {
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
}

// Export singleton instance
export const attachCheckboxHandler = (
  field: CheckboxField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
) => {
  CheckboxInputHandler.getInstance().attachHandler(
    field,
    form,
    updateSubmitButtonState
  );
};
