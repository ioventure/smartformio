/**
 * @file Text input field handler implementation
 * @module FieldHandlers/Text
 * @description Manages event handling and validation for text-based input fields.
 */

import { ITextField } from "@interfaces/field.interface";
import { validateField } from "@utils/validation";
import { applyErrorState, clearErrorState } from "@events/validation.utils";
import { logger } from "@services/logger.service";

/**
 * Input types supported by the text input handler
 * @constant
 */
const TEXT_INPUT_TYPES = {
  TEXT: "text",
  EMAIL: "email",
  PASSWORD: "password",
  NUMBER: "number",
  TEXTAREA: "textarea",
} as const;

/**
 * Error messages for text input validation
 * @constant
 */
const ERROR_MESSAGES = {
  PATTERN_MISMATCH: "Please match the requested format",
  LENGTH_TOO_SHORT: (min: number) =>
    `Please enter at least ${min} character${min > 1 ? "s" : ""}`,
  LENGTH_TOO_LONG: (max: number) =>
    `Please enter no more than ${max} character${max > 1 ? "s" : ""}`,
  VALUE_TOO_SMALL: (min: number) =>
    `Please enter a number greater than or equal to ${min}`,
  VALUE_TOO_LARGE: (max: number) =>
    `Please enter a number less than or equal to ${max}`,
} as const;

/**
 * Type guard for HTMLInputElement
 * @private
 */
function isInputElement(element: HTMLElement): element is HTMLInputElement {
  return element.tagName.toLowerCase() === "input";
}

/**
 * Type guard for HTMLTextAreaElement
 * @private
 */
function isTextAreaElement(
  element: HTMLElement
): element is HTMLTextAreaElement {
  return element.tagName.toLowerCase() === "textarea";
}

/**
 * Singleton handler for text input fields
 * @class TextInputHandler
 * @description Manages event handling and validation for text-based input fields.
 * Supports various input types with comprehensive validation.
 *
 * Features:
 * - Real-time validation
 * - Pattern matching
 * - Min/Max length validation
 * - Numeric range validation
 * - Error state management
 * - Accessibility support
 *
 * @example
 * ```typescript
 * // Using the handler
 * attachTextInputHandler(field, form, updateSubmitState);
 * ```
 */
export class TextInputHandler {
  private static instance: TextInputHandler;
  private static readonly LOG_CONTEXT = "TextInputHandler";

  private constructor() {
    logger.info(
      "TextInputHandler singleton initialized",
      TextInputHandler.LOG_CONTEXT
    );
  }

  /**
   * Gets the singleton instance of TextInputHandler
   * @returns {TextInputHandler} The singleton instance
   */
  public static getInstance(): TextInputHandler {
    if (!TextInputHandler.instance) {
      TextInputHandler.instance = new TextInputHandler();
    }
    return TextInputHandler.instance;
  }

  /**
   * Attaches event handlers to text input field
   * @param {ITextField} field - The text field configuration
   * @param {HTMLFormElement} form - The parent form element
   * @param {Function} updateSubmitButtonState - Callback to update form submit button state
   */
  public attachHandler(
    field: ITextField,
    form: HTMLFormElement,
    updateSubmitButtonState: () => void
  ): void {
    const { input, errorElement, helpElement } = this.getFormElements(
      field,
      form
    );

    if (!this.validateElements(field, input, errorElement)) {
      return;
    }

    this.setupTextField(field, input);
    this.attachEventHandlers(
      field,
      form,
      input,
      errorElement,
      helpElement,
      updateSubmitButtonState
    );
  }

  /**
   * Gets required form elements for the text field
   * @private
   */
  private getFormElements(field: ITextField, form: HTMLFormElement) {
    const selector = `[name="${field.name}"], [name="${field.name}[]"]`;
    const input = form.querySelector(selector) as
      | HTMLInputElement
      | HTMLTextAreaElement;

    return {
      input,
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
    field: ITextField,
    input: HTMLInputElement | HTMLTextAreaElement | null,
    errorElement: HTMLElement
  ): boolean {
    if (!input || !errorElement) {
      logger.warn(
        `Required elements not found for text field: ${field.name}`,
        TextInputHandler.LOG_CONTEXT
      );
      return false;
    }
    return true;
  }

  /**
   * Sets up text field with initial configuration
   * @private
   */
  private setupTextField(
    field: ITextField,
    input: HTMLInputElement | HTMLTextAreaElement
  ): void {
    // Set input type and attributes
    if (isInputElement(input)) {
      input.type = field.type;

      // Set validation attributes for input elements
      if (field.pattern) {
        input.pattern = field.pattern;
        input.setAttribute("title", ERROR_MESSAGES.PATTERN_MISMATCH);
      }

      if (field.type === TEXT_INPUT_TYPES.NUMBER) {
        if (field.min !== undefined) {
          input.min = field.min.toString();
          input.setAttribute(
            "title",
            ERROR_MESSAGES.VALUE_TOO_SMALL(field.min)
          );
        }
        if (field.max !== undefined) {
          input.max = field.max.toString();
          input.setAttribute(
            "title",
            ERROR_MESSAGES.VALUE_TOO_LARGE(field.max)
          );
        }
      }
    }

    // Set common attributes
    if (field.minLength) {
      input.minLength = field.minLength;
      input.setAttribute(
        "title",
        ERROR_MESSAGES.LENGTH_TOO_SHORT(field.minLength)
      );
    }

    if (field.maxLength) {
      input.maxLength = field.maxLength;
      input.setAttribute(
        "title",
        ERROR_MESSAGES.LENGTH_TOO_LONG(field.maxLength)
      );
    }

    // Set ARIA attributes
    input.setAttribute("aria-label", field.label || field.name);
    if (field.required) {
      input.setAttribute("aria-required", "true");
    }

    // Set up icons if present
    this.setupIcons(field, input);
  }

  /**
   * Sets up leading and trailing icons
   * @private
   */
  private setupIcons(
    field: ITextField,
    input: HTMLInputElement | HTMLTextAreaElement
  ): void {
    const wrapper = input.parentElement;
    if (!wrapper) return;

    if (field.leadingIcon) {
      wrapper.setAttribute("role", "group");
      wrapper.setAttribute(
        "aria-label",
        `${field.label || field.name} with ${field.leadingIcon} icon at start`
      );
    }

    if (field.trailingIcon) {
      wrapper.setAttribute("role", "group");
      wrapper.setAttribute(
        "aria-label",
        `${field.label || field.name} with ${field.trailingIcon} icon at end`
      );
    }
  }

  /**
   * Attaches event handlers to text field
   * @private
   */
  private attachEventHandlers(
    field: ITextField,
    form: HTMLFormElement,
    input: HTMLInputElement | HTMLTextAreaElement,
    errorElement: HTMLElement,
    helpElement: HTMLElement,
    updateSubmitButtonState: () => void
  ): void {
    const validateAndShowError = () => {
      const result = validateField(field, input.value);
      this.updateValidationState(input, errorElement, helpElement, result);
      updateSubmitButtonState();
    };

    // Handle blur event for all fields
    input.addEventListener("blur", validateAndShowError);

    // Handle real-time validation if enabled
    if (form.dataset.validateOnChange === "true") {
      let validationTimeout: NodeJS.Timeout;
      input.addEventListener("input", () => {
        // Debounce validation to avoid excessive updates
        clearTimeout(validationTimeout);
        validationTimeout = setTimeout(validateAndShowError, 300);
      });
    }

    // Handle special cases for number inputs
    if (isInputElement(input) && field.type === TEXT_INPUT_TYPES.NUMBER) {
      this.attachNumberInputHandlers(field, input);
    }

    // Initial validation
    validateAndShowError();
  }

  /**
   * Attaches special handlers for number inputs
   * @private
   */
  private attachNumberInputHandlers(
    field: ITextField,
    input: HTMLInputElement
  ): void {
    // Prevent non-numeric characters
    input.addEventListener("keypress", (event) => {
      const isNumber = /[0-9]/.test(event.key);
      const isDot = event.key === "." && !input.value.includes(".");
      const isMinus =
        event.key === "-" &&
        field.min !== undefined &&
        field.min < 0 &&
        input.selectionStart === 0 &&
        !input.value.includes("-");

      if (!isNumber && !isDot && !isMinus) {
        event.preventDefault();
      }
    });

    // Handle increment/decrement keys
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        const step = event.shiftKey ? 10 : 1;
        const currentValue = parseFloat(input.value) || 0;
        const newValue =
          event.key === "ArrowUp" ? currentValue + step : currentValue - step;

        if (this.isValidNumberValue(newValue, field)) {
          input.value = newValue.toString();
          input.dispatchEvent(new Event("input"));
        }
      }
    });
  }

  /**
   * Validates a number value against field constraints
   * @private
   */
  private isValidNumberValue(value: number, field: ITextField): boolean {
    if (field.min !== undefined && value < field.min) return false;
    if (field.max !== undefined && value > field.max) return false;
    return true;
  }

  /**
   * Updates validation state and error display
   * @private
   */
  private updateValidationState(
    input: HTMLInputElement | HTMLTextAreaElement,
    errorElement: HTMLElement,
    helpElement: HTMLElement,
    result: { isValid: boolean; message?: string }
  ): void {
    if (!result.isValid && result.message) {
      applyErrorState(
        [input] as unknown as NodeListOf<HTMLInputElement>,
        errorElement,
        helpElement,
        result.message
      );
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-errormessage", errorElement.id || "");
    } else {
      clearErrorState(
        [input] as unknown as NodeListOf<HTMLInputElement>,
        errorElement,
        helpElement
      );
      input.setAttribute("aria-invalid", "false");
      input.removeAttribute("aria-errormessage");
    }
  }
}

/**
 * Attaches text input handler to the form
 * @param {ITextField} field - The text field configuration
 * @param {HTMLFormElement} form - The parent form element
 * @param {Function} updateSubmitButtonState - Callback to update form submit button state
 */
export const attachTextInputHandler = (
  field: ITextField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
): void => {
  TextInputHandler.getInstance().attachHandler(
    field,
    form,
    updateSubmitButtonState
  );
};
