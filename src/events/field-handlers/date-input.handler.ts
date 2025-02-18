import { DateField } from "@interfaces/field.interface";
import { validateField } from "@utils/validation";
import { applyErrorState, clearErrorState } from "../validation.utils";
import { logger } from "@services/logger.service";

/**
 * Singleton DateInputHandler Service
 * Attaches event handlers for date inputs.
 */
export class DateInputHandler {
  private static instance: DateInputHandler;
  private readonly logContext = "DateInputHandler";

  private constructor() {
    logger.info("DateInputHandler singleton initialized", this.logContext);
  }

  /**
   * Get the singleton instance of DateInputHandler
   */
  public static getInstance(): DateInputHandler {
    if (!DateInputHandler.instance) {
      DateInputHandler.instance = new DateInputHandler();
    }
    return DateInputHandler.instance;
  }

  /**
   * Attaches event handlers for date inputs.
   */
  public attachHandler(
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
}

// Export singleton instance
export const attachDateInputHandler = (
  field: DateField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
) => {
  DateInputHandler.getInstance().attachHandler(
    field,
    form,
    updateSubmitButtonState
  );
};
