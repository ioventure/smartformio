import { ITextField } from "@interfaces/field.interface";
import { validateField } from "@utils/validation";
import { applyErrorState, clearErrorState } from "../validation.utils";
import { logger } from "@services/logger.service";

/**
 * Singleton TextInputHandler Service
 * Attaches validation event handlers for standard text-based inputs.
 */
export class TextInputHandler {
  private static instance: TextInputHandler;
  private readonly logContext = "TextInputHandler";

  private constructor() {
    logger.info("TextInputHandler singleton initialized", this.logContext);
  }

  /**
   * Get the singleton instance of TextInputHandler
   */
  public static getInstance(): TextInputHandler {
    if (!TextInputHandler.instance) {
      TextInputHandler.instance = new TextInputHandler();
    }
    return TextInputHandler.instance;
  }

  /**
   * Attaches validation event handlers for text inputs.
   */
  public attachHandler(
    field: ITextField,
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

    if (form.dataset.validateOnChange === "true") {
      inputs[0].addEventListener("input", () => {
        setTimeout(validateAndShowError, 0);
      });
    }
  }
}

// Export singleton instance
export const attachTextInputHandler = (
  field: ITextField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
) => {
  TextInputHandler.getInstance().attachHandler(
    field,
    form,
    updateSubmitButtonState
  );
};
