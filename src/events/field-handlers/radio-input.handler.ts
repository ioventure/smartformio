/**
 * @file Radio input field handler implementation
 * @module FieldHandlers/Radio
 * @description Manages event handling and validation for radio input fields.
 */

import { IRadioField } from "@interfaces/field.interface";
import { validateField } from "@utils/validation";
import { applyErrorState, clearErrorState } from "@events/validation.utils";
import { logger } from "@services/logger.service";

/**
 * Error messages for radio validation
 * @constant
 */
const ERROR_MESSAGES = {
  REQUIRED: "Please select an option",
} as const;

/**
 * Singleton handler for radio input fields
 * @class RadioInputHandler
 * @description Manages event handling and validation for radio button groups.
 * Handles selection state, validation, and accessibility features.
 *
 * Features:
 * - Radio group validation
 * - Required field validation
 * - Error state management
 * - Keyboard navigation support
 * - Accessibility support
 *
 * @example
 * ```typescript
 * // Using the handler
 * attachRadioHandler(field, form, updateSubmitState);
 * ```
 */
export class RadioInputHandler {
  private static instance: RadioInputHandler;
  private static readonly LOG_CONTEXT = "RadioInputHandler";

  private constructor() {
    logger.info(
      "RadioInputHandler singleton initialized",
      RadioInputHandler.LOG_CONTEXT
    );
  }

  /**
   * Gets the singleton instance of RadioInputHandler
   * @returns {RadioInputHandler} The singleton instance
   */
  public static getInstance(): RadioInputHandler {
    if (!RadioInputHandler.instance) {
      RadioInputHandler.instance = new RadioInputHandler();
    }
    return RadioInputHandler.instance;
  }

  /**
   * Attaches event handlers to radio input group
   * @param {IRadioField} field - The radio field configuration
   * @param {HTMLFormElement} form - The parent form element
   * @param {Function} updateSubmitButtonState - Callback to update form submit button state
   */
  public attachHandler(
    field: IRadioField,
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

    this.setupRadioGroup(field, form, inputs);
    this.attachEventHandlers(
      field,
      form,
      inputs,
      errorElement,
      helpElement,
      updateSubmitButtonState
    );
  }

  /**
   * Gets required form elements for the radio field
   * @private
   */
  private getFormElements(field: IRadioField, form: HTMLFormElement) {
    const selector = `[name="${field.name}"]`;

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
    field: IRadioField,
    inputs: NodeListOf<HTMLInputElement>,
    errorElement: HTMLElement
  ): boolean {
    if (!inputs.length || !errorElement) {
      logger.warn(
        `Required elements not found for radio field: ${field.name}`,
        RadioInputHandler.LOG_CONTEXT
      );
      return false;
    }
    return true;
  }

  /**
   * Sets up radio group with initial configuration
   * @private
   */
  private setupRadioGroup(
    field: IRadioField,
    form: HTMLFormElement,
    inputs: NodeListOf<HTMLInputElement>
  ): void {
    const groupContainer = form.querySelector(
      `[data-field="${field.name}"]`
    ) as HTMLElement;

    if (groupContainer) {
      // Set up ARIA attributes for the group
      groupContainer.setAttribute("role", "radiogroup");
      groupContainer.setAttribute("aria-label", field.label || field.name);
      if (field.required) {
        groupContainer.setAttribute("aria-required", "true");
      }
    }

    // Set up individual radio buttons
    inputs.forEach((input, index) => {
      input.setAttribute("role", "radio");
      input.setAttribute("aria-checked", input.checked ? "true" : "false");
      input.setAttribute("tabindex", index === 0 ? "0" : "-1");
    });
  }

  /**
   * Attaches event handlers to radio group
   * @private
   */
  private attachEventHandlers(
    field: IRadioField,
    form: HTMLFormElement,
    inputs: NodeListOf<HTMLInputElement>,
    errorElement: HTMLElement,
    helpElement: HTMLElement,
    updateSubmitButtonState: () => void
  ): void {
    const validateRadioGroup = () => {
      const selected = form.querySelector(
        `[name="${field.name}"]:checked`
      ) as HTMLInputElement | null;

      const result = validateField(field, selected ? selected.value : "");

      this.updateValidationState(inputs, errorElement, helpElement, result);
      updateSubmitButtonState();
    };

    // Handle change events
    inputs.forEach((input) => {
      input.addEventListener("change", () => {
        // Update ARIA states
        inputs.forEach((radio) => {
          radio.setAttribute("aria-checked", radio.checked ? "true" : "false");
          radio.setAttribute("tabindex", radio.checked ? "0" : "-1");
        });
        validateRadioGroup();
      });

      // Handle keyboard navigation
      input.addEventListener("keydown", (event) => {
        this.handleKeyboardNavigation(event, inputs);
      });
    });

    // Initial validation
    validateRadioGroup();
  }

  /**
   * Handles keyboard navigation for radio group
   * @private
   */
  private handleKeyboardNavigation(
    event: KeyboardEvent,
    inputs: NodeListOf<HTMLInputElement>
  ): void {
    const currentIndex = Array.from(inputs).findIndex(
      (input) => input === document.activeElement
    );

    if (currentIndex === -1) return;

    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        nextIndex = (currentIndex + 1) % inputs.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        nextIndex = (currentIndex - 1 + inputs.length) % inputs.length;
        break;
      default:
        return;
    }

    const nextInput = inputs[nextIndex];
    nextInput.checked = true;
    nextInput.focus();
    nextInput.dispatchEvent(new Event("change"));
  }

  /**
   * Updates validation state and error display
   * @private
   */
  private updateValidationState(
    inputs: NodeListOf<HTMLInputElement>,
    errorElement: HTMLElement,
    helpElement: HTMLElement,
    result: { isValid: boolean; message?: string }
  ): void {
    if (!result.isValid && result.message) {
      applyErrorState(inputs, errorElement, helpElement, result.message);
      inputs.forEach((input) => input.setAttribute("aria-invalid", "true"));
    } else {
      clearErrorState(inputs, errorElement, helpElement);
      inputs.forEach((input) => input.setAttribute("aria-invalid", "false"));
    }
  }
}

/**
 * Attaches radio input handler to the form
 * @param {IRadioField} field - The radio field configuration
 * @param {HTMLFormElement} form - The parent form element
 * @param {Function} updateSubmitButtonState - Callback to update form submit button state
 */
export const attachRadioHandler = (
  field: IRadioField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
): void => {
  RadioInputHandler.getInstance().attachHandler(
    field,
    form,
    updateSubmitButtonState
  );
};
