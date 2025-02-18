import { ISelectField } from "@interfaces/field.interface";
import { validateField } from "@utils/validation";
import { applyErrorState, clearErrorState } from "../validation.utils";
import { logger } from "@services/logger.service";

/**
 * Singleton SelectInputHandler Service
 * Attaches event handlers for select elements.
 */
export class SelectInputHandler {
  private static instance: SelectInputHandler;
  private readonly logContext = "SelectInputHandler";

  private constructor() {
    logger.info("SelectInputHandler singleton initialized", this.logContext);
  }

  /**
   * Get the singleton instance of SelectInputHandler
   */
  public static getInstance(): SelectInputHandler {
    if (!SelectInputHandler.instance) {
      SelectInputHandler.instance = new SelectInputHandler();
    }
    return SelectInputHandler.instance;
  }

  /**
   * Attaches event handlers for select elements.
   */
  public attachHandler(
    field: ISelectField,
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
}

// Export singleton instance
export const attachSelectHandler = (
  field: ISelectField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
) => {
  SelectInputHandler.getInstance().attachHandler(
    field,
    form,
    updateSubmitButtonState
  );
};
