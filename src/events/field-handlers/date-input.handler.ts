/**
 * @file Date input field handler implementation
 * @module FieldHandlers/Date
 * @description Manages event handling and validation for date input fields.
 */

import { IDateField } from "@interfaces/field.interface";
import { validateField } from "@utils/validation";
import { applyErrorState, clearErrorState } from "@events/validation.utils";
import { logger } from "@services/logger.service";

/**
 * Date format configuration
 * @constant
 */
const DATE_CONFIG = {
  DEFAULT_FORMAT: "YYYY-MM-DD",
  ARIA_LABEL: "Use the date picker or enter date in {format} format",
} as const;

/**
 * Singleton handler for date input fields
 * @class DateInputHandler
 * @description Manages event handling and validation for date input fields.
 * Provides date picker functionality and validation based on field configuration.
 *
 * Features:
 * - Native date picker integration
 * - Date format validation
 * - Min/Max date validation
 * - Required field validation
 * - Error state management
 * - Accessibility support
 *
 * @example
 * ```typescript
 * // Using the handler
 * attachDateInputHandler(field, form, updateSubmitState);
 * ```
 */
export class DateInputHandler {
  private static instance: DateInputHandler;
  private static readonly LOG_CONTEXT = "DateInputHandler";

  private constructor() {
    logger.info(
      "DateInputHandler singleton initialized",
      DateInputHandler.LOG_CONTEXT
    );
  }

  /**
   * Gets the singleton instance of DateInputHandler
   * @returns {DateInputHandler} The singleton instance
   */
  public static getInstance(): DateInputHandler {
    if (!DateInputHandler.instance) {
      DateInputHandler.instance = new DateInputHandler();
    }
    return DateInputHandler.instance;
  }

  /**
   * Attaches event handlers to date input field
   * @param {IDateField} field - The date field configuration
   * @param {HTMLFormElement} form - The parent form element
   * @param {Function} updateSubmitButtonState - Callback to update form submit button state
   */
  public attachHandler(
    field: IDateField,
    form: HTMLFormElement,
    updateSubmitButtonState: () => void
  ): void {
    const { inputs, errorElement, helpElement } = this.getFormElements(
      field,
      form
    );

    if (!this.validateElements(field, inputs, errorElement)) {
      return;
    }

    const input = inputs[0];
    this.setupDateInput(field, input);
    this.attachEventHandlers(
      field,
      input,
      errorElement,
      helpElement,
      updateSubmitButtonState
    );
  }

  /**
   * Gets required form elements for the date field
   * @private
   */
  private getFormElements(field: IDateField, form: HTMLFormElement) {
    const selector = `[name="${field.name}"], [name="${field.name}[]"]`;

    return {
      inputs: form.querySelectorAll(selector) as NodeListOf<HTMLInputElement>,
      errorElement: form.querySelector(
        `[data-error="${field.name}"]`
      ) as HTMLElement,
      helpElement: form.querySelector(
        `[data-help="${field.name}"]`
      ) as HTMLElement,
    };
  }

  /**
   * Validates that required elements exist
   * @private
   */
  private validateElements(
    field: IDateField,
    inputs: NodeListOf<HTMLInputElement>,
    errorElement: HTMLElement
  ): boolean {
    if (!inputs.length || !errorElement) {
      logger.warn(
        `Required elements not found for date field: ${field.name}`,
        DateInputHandler.LOG_CONTEXT
      );
      return false;
    }
    return true;
  }

  /**
   * Sets up date input with initial configuration
   * @private
   */
  private setupDateInput(field: IDateField, input: HTMLInputElement): void {
    // Set min/max dates if configured
    if (field.min) input.min = this.formatDateValue(field.min);
    if (field.max) input.max = this.formatDateValue(field.max);

    // Set ARIA attributes
    const format = field.format || DATE_CONFIG.DEFAULT_FORMAT;
    input.setAttribute(
      "aria-label",
      DATE_CONFIG.ARIA_LABEL.replace("{format}", format)
    );

    if (field.required) {
      input.setAttribute("aria-required", "true");
    }

    // Set input mode and pattern for mobile devices
    input.inputMode = "numeric";
    input.setAttribute("pattern", "\\d{4}-\\d{2}-\\d{2}");
  }

  /**
   * Formats date value for input min/max attributes
   * @private
   */
  private formatDateValue(value: string | number): string {
    if (typeof value === "number") {
      return new Date(value).toISOString().split("T")[0];
    }
    return value;
  }

  /**
   * Attaches event handlers to date input
   * @private
   */
  private attachEventHandlers(
    field: IDateField,
    input: HTMLInputElement,
    errorElement: HTMLElement,
    helpElement: HTMLElement,
    updateSubmitButtonState: () => void
  ): void {
    // Show native date picker on click/focus
    input.addEventListener("click", () => {
      input.showPicker?.();
    });

    input.addEventListener("focus", () => {
      input.showPicker?.();
    });

    // Validate on change
    const validateDate = () => {
      const result = validateField(field, input.value);

      if (!result.isValid && result.message) {
        applyErrorState(
          [input] as unknown as NodeListOf<HTMLInputElement>,
          errorElement,
          helpElement,
          result.message
        );
        input.setAttribute("aria-invalid", "true");
      } else {
        clearErrorState(
          [input] as unknown as NodeListOf<HTMLInputElement>,
          errorElement,
          helpElement
        );
        input.setAttribute("aria-invalid", "false");
      }

      updateSubmitButtonState();
    };

    input.addEventListener("change", validateDate);
    input.addEventListener("blur", validateDate);

    // Initial validation
    validateDate();
  }
}

/**
 * Attaches date input handler to the form
 * @param {IDateField} field - The date field configuration
 * @param {HTMLFormElement} form - The parent form element
 * @param {Function} updateSubmitButtonState - Callback to update form submit button state
 */
export const attachDateInputHandler = (
  field: IDateField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
): void => {
  DateInputHandler.getInstance().attachHandler(
    field,
    form,
    updateSubmitButtonState
  );
};
