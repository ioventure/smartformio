import { IRadioField } from "@interfaces/field.interface";
import { validateField } from "@utils/validation";
import { applyErrorState, clearErrorState } from "../validation.utils";
import { logger } from "@services/logger.service";

/**
 * Singleton RadioInputHandler Service
 * Attaches event handlers for radio input fields.
 */
export class RadioInputHandler {
  private static instance: RadioInputHandler;
  private readonly logContext = "RadioInputHandler";

  private constructor() {
    logger.info("RadioInputHandler singleton initialized", this.logContext);
  }

  /**
   * Get the singleton instance of RadioInputHandler
   */
  public static getInstance(): RadioInputHandler {
    if (!RadioInputHandler.instance) {
      RadioInputHandler.instance = new RadioInputHandler();
    }
    return RadioInputHandler.instance;
  }

  /**
   * Attaches event handlers for radio input fields.
   */
  public attachHandler(
    field: IRadioField,
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
}

// Export singleton instance
export const attachRadioHandler = (
  field: IRadioField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
) => {
  RadioInputHandler.getInstance().attachHandler(
    field,
    form,
    updateSubmitButtonState
  );
};
