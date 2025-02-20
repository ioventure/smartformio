/**
 * @file Checkbox input field handler implementation
 * @module FieldHandlers/Checkbox
 * @description Manages event handling and validation for checkbox input fields.
 */

import { ICheckboxField, ICheckboxOption } from "@interfaces/field.interface";
import { applyErrorState, clearErrorState } from "@events/validation.utils";
import { logger } from "@services/logger.service";

/**
 * Error messages for checkbox validation
 * @constant
 */
const ERROR_MESSAGES = {
  REQUIRED: "This field is required",
  MIN_SELECT: (min: number) =>
    `Please select at least ${min} option${min > 1 ? "s" : ""}`,
  MAX_SELECT: (max: number) =>
    `Please select no more than ${max} option${max > 1 ? "s" : ""}`,
} as const;

/**
 * Singleton handler for checkbox input fields
 * @class CheckboxInputHandler
 * @description Manages event handling and validation for checkbox input fields.
 * Supports both single checkbox and multiple checkbox group scenarios.
 *
 * Features:
 * - Single checkbox validation
 * - Multiple checkbox group handling
 * - Min/Max selection validation
 * - Required field validation
 * - Error state management
 * - Accessibility support
 *
 * @example
 * ```typescript
 * // Using the handler
 * attachCheckboxHandler(field, form, updateSubmitState);
 * ```
 */
export class CheckboxInputHandler {
  private static instance: CheckboxInputHandler;
  private static readonly LOG_CONTEXT = "CheckboxInputHandler";

  private constructor() {
    logger.info(
      "CheckboxInputHandler singleton initialized",
      CheckboxInputHandler.LOG_CONTEXT
    );
  }

  /**
   * Gets the singleton instance of CheckboxInputHandler
   * @returns {CheckboxInputHandler} The singleton instance
   */
  public static getInstance(): CheckboxInputHandler {
    if (!CheckboxInputHandler.instance) {
      CheckboxInputHandler.instance = new CheckboxInputHandler();
    }
    return CheckboxInputHandler.instance;
  }

  /**
   * Attaches event handlers to checkbox field(s)
   * @param {ICheckboxField} field - The checkbox field configuration
   * @param {HTMLFormElement} form - The parent form element
   * @param {Function} updateSubmitButtonState - Callback to update form submit button state
   */
  public attachHandler(
    field: ICheckboxField,
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

    if (field.options) {
      this.handleCheckboxGroup(
        field,
        form,
        inputs,
        errorElement,
        helpElement,
        updateSubmitButtonState
      );
    } else {
      this.handleSingleCheckbox(
        field,
        inputs[0],
        errorElement,
        helpElement,
        updateSubmitButtonState
      );
    }
  }

  /**
   * Gets required form elements for the checkbox field
   * @private
   */
  private getFormElements(field: ICheckboxField, form: HTMLFormElement) {
    const selector = field.options
      ? `[name="${field.name}"], [name="${field.name}[]"]`
      : `[name="${field.name}"]`;

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
    field: ICheckboxField,
    inputs: NodeListOf<HTMLInputElement>,
    errorElement: HTMLElement
  ): boolean {
    if (!inputs.length || !errorElement) {
      logger.warn(
        `Required elements not found for checkbox field: ${field.name}`,
        CheckboxInputHandler.LOG_CONTEXT
      );
      return false;
    }
    return true;
  }

  /**
   * Handles validation and events for a checkbox group
   * @private
   */
  private handleCheckboxGroup(
    field: ICheckboxField,
    form: HTMLFormElement,
    inputs: NodeListOf<HTMLInputElement>,
    errorElement: HTMLElement,
    helpElement: HTMLElement,
    updateSubmitButtonState: () => void
  ): void {
    const requiredInput = form.querySelector(
      `[data-required-group="${field.name}"]`
    ) as HTMLInputElement;

    const validateGroup = () => {
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

      this.validateCheckboxGroup(
        inputs,
        errorElement,
        helpElement,
        checkedCount,
        minSelect,
        maxSelect,
        requiredInput
      );

      if (field.maxSelect) {
        this.updateDisabledState(inputs, checkedCount, maxSelect);
      }

      updateSubmitButtonState();
    };

    // Attach change event listener to all checkboxes in the group
    inputs.forEach((input) => {
      input.addEventListener("change", validateGroup);
    });

    // Initial validation
    validateGroup();
  }

  /**
   * Handles validation and events for a single checkbox
   * @private
   */
  private handleSingleCheckbox(
    field: ICheckboxField,
    input: HTMLInputElement,
    errorElement: HTMLElement,
    helpElement: HTMLElement,
    updateSubmitButtonState: () => void
  ): void {
    const validateSingle = () => {
      const isValid = field.required ? input.checked : true;
      if (!isValid) {
        applyErrorState(
          [input] as unknown as NodeListOf<HTMLInputElement>,
          errorElement,
          helpElement,
          ERROR_MESSAGES.REQUIRED
        );
      } else {
        clearErrorState(
          [input] as unknown as NodeListOf<HTMLInputElement>,
          errorElement,
          helpElement
        );
      }
      updateSubmitButtonState();
    };

    input.addEventListener("change", validateSingle);

    // Initial validation
    validateSingle();
  }

  /**
   * Validates checkbox group selection count
   * @private
   */
  private validateCheckboxGroup(
    inputs: NodeListOf<HTMLInputElement>,
    errorElement: HTMLElement,
    helpElement: HTMLElement,
    checkedCount: number,
    minSelect: number,
    maxSelect: number,
    requiredInput?: HTMLInputElement
  ): void {
    if (checkedCount < minSelect) {
      applyErrorState(
        inputs,
        errorElement,
        helpElement,
        ERROR_MESSAGES.MIN_SELECT(minSelect)
      );
      if (requiredInput) requiredInput.value = "";
    } else if (checkedCount > maxSelect) {
      applyErrorState(
        inputs,
        errorElement,
        helpElement,
        ERROR_MESSAGES.MAX_SELECT(maxSelect)
      );
      if (requiredInput) requiredInput.value = "";
    } else {
      clearErrorState(inputs, errorElement, helpElement);
      if (requiredInput) requiredInput.value = checkedCount > 0 ? "true" : "";
    }
  }

  /**
   * Updates disabled state of checkboxes based on max selection
   * @private
   */
  private updateDisabledState(
    inputs: NodeListOf<HTMLInputElement>,
    checkedCount: number,
    maxSelect: number
  ): void {
    const canSelect = checkedCount < maxSelect;
    inputs.forEach((inp) => {
      const shouldDisable = !inp.checked && !canSelect;
      inp.disabled = shouldDisable;

      // Update ARIA attributes
      if (shouldDisable) {
        inp.setAttribute("aria-disabled", "true");
        inp.setAttribute("title", `Maximum ${maxSelect} items can be selected`);
      } else {
        inp.removeAttribute("aria-disabled");
        inp.removeAttribute("title");
      }
    });
  }
}

/**
 * Attaches checkbox handler to the form
 * @param {ICheckboxField} field - The checkbox field configuration
 * @param {HTMLFormElement} form - The parent form element
 * @param {Function} updateSubmitButtonState - Callback to update form submit button state
 */
export const attachCheckboxHandler = (
  field: ICheckboxField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
): void => {
  CheckboxInputHandler.getInstance().attachHandler(
    field,
    form,
    updateSubmitButtonState
  );
};
