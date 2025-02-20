/**
 * @file Select input field handler implementation
 * @module FieldHandlers/Select
 * @description Manages event handling and validation for select input fields.
 */

import { ISelectField, ISelectOption } from "@interfaces/field.interface";
import { validateField } from "@utils/validation";
import { applyErrorState, clearErrorState } from "@events/validation.utils";
import { logger } from "@services/logger.service";

/**
 * Error messages for select validation
 * @constant
 */
const ERROR_MESSAGES = {
  REQUIRED: "Please select an option",
  INVALID_OPTION: "Selected option is not valid",
} as const;

/**
 * Singleton handler for select input fields
 * @class SelectInputHandler
 * @description Manages event handling and validation for select dropdowns.
 * Handles selection state, validation, and accessibility features.
 *
 * Features:
 * - Option validation
 * - Required field validation
 * - Error state management
 * - Keyboard navigation support
 * - Accessibility support
 *
 * @example
 * ```typescript
 * // Using the handler
 * attachSelectHandler(field, form, updateSubmitState);
 * ```
 */
export class SelectInputHandler {
  private static instance: SelectInputHandler;
  private static readonly LOG_CONTEXT = "SelectInputHandler";

  private constructor() {
    logger.info(
      "SelectInputHandler singleton initialized",
      SelectInputHandler.LOG_CONTEXT
    );
  }

  /**
   * Gets the singleton instance of SelectInputHandler
   * @returns {SelectInputHandler} The singleton instance
   */
  public static getInstance(): SelectInputHandler {
    if (!SelectInputHandler.instance) {
      SelectInputHandler.instance = new SelectInputHandler();
    }
    return SelectInputHandler.instance;
  }

  /**
   * Attaches event handlers to select input field
   * @param {ISelectField} field - The select field configuration
   * @param {HTMLFormElement} form - The parent form element
   * @param {Function} updateSubmitButtonState - Callback to update form submit button state
   */
  public attachHandler(
    field: ISelectField,
    form: HTMLFormElement,
    updateSubmitButtonState: () => void
  ): void {
    const { select, errorElement, helpElement } = this.getFormElements(
      field,
      form
    );

    if (!this.validateElements(field, select, errorElement)) {
      return;
    }

    this.setupSelectField(field, select);
    this.attachEventHandlers(
      field,
      select,
      errorElement,
      helpElement,
      updateSubmitButtonState
    );
  }

  /**
   * Gets required form elements for the select field
   * @private
   */
  private getFormElements(field: ISelectField, form: HTMLFormElement) {
    return {
      select: form.querySelector(`[name="${field.name}"]`) as HTMLSelectElement,
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
    field: ISelectField,
    select: HTMLSelectElement,
    errorElement: HTMLElement
  ): boolean {
    if (!select || !errorElement) {
      logger.warn(
        `Required elements not found for select field: ${field.name}`,
        SelectInputHandler.LOG_CONTEXT
      );
      return false;
    }
    return true;
  }

  /**
   * Sets up select field with initial configuration
   * @private
   */
  private setupSelectField(
    field: ISelectField,
    select: HTMLSelectElement
  ): void {
    // Set ARIA attributes
    select.setAttribute("aria-label", field.label || field.name);
    if (field.required) {
      select.setAttribute("aria-required", "true");
    }

    // Set up leading icon if present
    if (field.leadingIcon) {
      const wrapper = select.parentElement;
      if (wrapper) {
        wrapper.setAttribute("role", "combobox");
        wrapper.setAttribute(
          "aria-label",
          `${field.label || field.name} with ${field.leadingIcon} icon`
        );
      }
    }

    // Validate options
    this.validateOptions(field, select);
  }

  /**
   * Validates select options against field configuration
   * @private
   */
  private validateOptions(
    field: ISelectField,
    select: HTMLSelectElement
  ): void {
    const configuredOptions = new Set(
      field.options.map((option) =>
        typeof option === "string" ? option : option.value
      )
    );

    Array.from(select.options).forEach((option) => {
      if (option.value && !configuredOptions.has(option.value)) {
        logger.warn(
          `Invalid option value "${option.value}" found in select field: ${field.name}`,
          SelectInputHandler.LOG_CONTEXT
        );
      }
    });
  }

  /**
   * Attaches event handlers to select field
   * @private
   */
  private attachEventHandlers(
    field: ISelectField,
    select: HTMLSelectElement,
    errorElement: HTMLElement,
    helpElement: HTMLElement,
    updateSubmitButtonState: () => void
  ): void {
    const validateSelect = () => {
      const result = validateField(field, select.value);
      this.updateValidationState(select, errorElement, helpElement, result);
      updateSubmitButtonState();
    };

    // Handle change events
    select.addEventListener("change", validateSelect);

    // Handle focus/blur events for styling
    select.addEventListener("focus", () => {
      select.parentElement?.classList.add("focused");
    });

    select.addEventListener("blur", () => {
      select.parentElement?.classList.remove("focused");
      validateSelect();
    });

    // Handle keyboard events
    select.addEventListener("keydown", (event) => {
      this.handleKeyboardNavigation(event, select);
    });

    // Initial validation
    validateSelect();
  }

  /**
   * Handles keyboard navigation for select field
   * @private
   */
  private handleKeyboardNavigation(
    event: KeyboardEvent,
    select: HTMLSelectElement
  ): void {
    switch (event.key) {
      case "Enter":
      case " ":
        // Native select handles these
        break;
      case "Escape":
        event.preventDefault();
        select.blur();
        break;
      case "Tab":
        // Let the browser handle tab navigation
        select.parentElement?.classList.remove("focused");
        break;
    }
  }

  /**
   * Updates validation state and error display
   * @private
   */
  private updateValidationState(
    select: HTMLSelectElement,
    errorElement: HTMLElement,
    helpElement: HTMLElement,
    result: { isValid: boolean; message?: string }
  ): void {
    if (!result.isValid && result.message) {
      applyErrorState(
        [select] as unknown as NodeListOf<HTMLInputElement>,
        errorElement,
        helpElement,
        result.message
      );
      select.setAttribute("aria-invalid", "true");
      select.setAttribute("aria-errormessage", errorElement.id || "");
    } else {
      clearErrorState(
        [select] as unknown as NodeListOf<HTMLInputElement>,
        errorElement,
        helpElement
      );
      select.setAttribute("aria-invalid", "false");
      select.removeAttribute("aria-errormessage");
    }
  }

  /**
   * Gets option label from field configuration
   * @private
   */
  private getOptionLabel(option: string | ISelectOption): string {
    return typeof option === "string" ? option : option.label;
  }

  /**
   * Gets option value from field configuration
   * @private
   */
  private getOptionValue(option: string | ISelectOption): string {
    return typeof option === "string" ? option : option.value;
  }
}

/**
 * Attaches select input handler to the form
 * @param {ISelectField} field - The select field configuration
 * @param {HTMLFormElement} form - The parent form element
 * @param {Function} updateSubmitButtonState - Callback to update form submit button state
 */
export const attachSelectHandler = (
  field: ISelectField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
): void => {
  SelectInputHandler.getInstance().attachHandler(
    field,
    form,
    updateSubmitButtonState
  );
};
