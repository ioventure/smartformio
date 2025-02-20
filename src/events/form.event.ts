/**
 * @file Form event handler implementation
 * @module Events/Form
 * @description Manages form events, validation, and field-specific handlers
 */

import { IFormSchema } from "@interfaces/core.interface";
import { IFormFieldSchema, ICheckboxField } from "@interfaces/field.interface";
import { FormSubmissionHandler } from "@events/form.submission";
import { formApiHandler, FORM_API_EVENTS } from "@events/form.api.events";
import { logger } from "@services/logger.service";
import { formService } from "@services/form.service";
import {
  attachTextInputHandler,
  attachDateInputHandler,
  attachFileInputHandler,
  attachRadioHandler,
  attachSelectHandler,
  attachCheckboxHandler,
} from "@events/field-handlers";

/**
 * Type guard for checkbox fields
 * @private
 */
function isCheckboxField(field: IFormFieldSchema): field is ICheckboxField {
  return field.type === "checkbox";
}

/**
 * Singleton handler for form events
 * @class FormEventHandler
 * @description Manages form events, validation, and field-specific handlers in both static and SSR environments.
 * Coordinates between different field handlers and form submission processes.
 *
 * Features:
 * - Form validation setup
 * - Field-specific handler attachment
 * - Submit button state management
 * - Form submission handling
 * - Error handling and logging
 *
 * @example
 * ```typescript
 * // Using the handler
 * formEventHandler.setupEvents(shadowRoot, schema, formId);
 * ```
 */
export class FormEventHandler {
  private static instance: FormEventHandler;
  private static readonly LOG_CONTEXT = "FormEventHandler";

  private constructor() {
    logger.info(
      "FormEventHandler singleton initialized",
      FormEventHandler.LOG_CONTEXT
    );
  }

  /**
   * Gets the singleton instance of FormEventHandler
   * @returns {FormEventHandler} The singleton instance
   */
  public static getInstance(): FormEventHandler {
    if (!FormEventHandler.instance) {
      FormEventHandler.instance = new FormEventHandler();
    }
    return FormEventHandler.instance;
  }

  /**
   * Updates the submit button state based on form validation
   * @private
   * @param {HTMLFormElement} form - The form element
   * @param {IFormSchema} schema - The form schema configuration
   * @param {string} formId - Unique identifier for the form
   */
  private updateSubmitButtonState(
    form: HTMLFormElement,
    schema: IFormSchema,
    formId: string
  ): void {
    const hasErrors = form.querySelectorAll('[aria-invalid="true"]').length > 0;
    const hasEmptyRequired = this.checkForEmptyRequiredFields(form, schema);
    const isValid = !hasErrors && !hasEmptyRequired;

    formService.updateSubmitButtonState(formId, !isValid);
  }

  /**
   * Checks for empty required fields in the form
   * @private
   * @param {HTMLFormElement} form - The form element
   * @param {IFormSchema} schema - The form schema configuration
   * @returns {boolean} True if there are empty required fields
   */
  private checkForEmptyRequiredFields(
    form: HTMLFormElement,
    schema: IFormSchema
  ): boolean {
    return schema.fields.some((field) => {
      if (!field.required) return false;

      const input = form.querySelector(
        `[name="${field.name}"]`
      ) as HTMLInputElement;
      if (!input) return false;

      switch (field.type) {
        case "checkbox":
          if (isCheckboxField(field)) {
            return field.options
              ? this.validateCheckboxGroup(form, field)
              : field.required && !input.checked;
          }
          return false;
        case "radio":
          return !form.querySelector(`[name="${field.name}"]:checked`);
        default:
          return !input.value;
      }
    });
  }

  /**
   * Validates a checkbox group
   * @private
   * @param {HTMLFormElement} form - The form element
   * @param {ICheckboxField} field - The checkbox field configuration
   * @returns {boolean} True if validation fails
   */
  private validateCheckboxGroup(
    form: HTMLFormElement,
    field: ICheckboxField
  ): boolean {
    const checkedCount = form.querySelectorAll(
      `[name="${field.name}[]"]:checked`
    ).length;
    return checkedCount < (field.minSelect || 1);
  }

  /**
   * Attaches field-specific handlers to form fields
   * @private
   * @param {HTMLFormElement} form - The form element
   * @param {IFormSchema} schema - The form schema configuration
   * @param {string} formId - Unique identifier for the form
   */
  private attachFieldHandlers(
    form: HTMLFormElement,
    schema: IFormSchema,
    formId: string
  ): void {
    schema.fields.forEach((field: IFormFieldSchema) => {
      const updateState = () =>
        this.updateSubmitButtonState(form, schema, formId);

      try {
        this.attachFieldTypeHandler(field, form, updateState);
        logger.debug(
          `Attached handler for field: ${field.name}`,
          FormEventHandler.LOG_CONTEXT
        );
      } catch (error) {
        logger.error(
          `Failed to attach handler for field: ${field.name}`,
          error instanceof Error ? error : new Error(String(error)),
          FormEventHandler.LOG_CONTEXT
        );
      }
    });
  }

  /**
   * Attaches the appropriate handler based on field type
   * @private
   * @param {IFormFieldSchema} field - The field configuration
   * @param {HTMLFormElement} form - The form element
   * @param {Function} updateState - Callback to update form state
   */
  private attachFieldTypeHandler(
    field: IFormFieldSchema,
    form: HTMLFormElement,
    updateState: () => void
  ): void {
    switch (field.type) {
      case "checkbox":
        if (isCheckboxField(field)) {
          attachCheckboxHandler(field, form, updateState);
        }
        break;
      case "date":
        attachDateInputHandler(field, form, updateState);
        break;
      case "file":
        attachFileInputHandler(field, form, updateState);
        break;
      case "radio":
        attachRadioHandler(field, form, updateState);
        break;
      case "select":
        attachSelectHandler(field, form, updateState);
        break;
      default:
        attachTextInputHandler(field, form, updateState);
        break;
    }
  }

  /**
   * Sets up form validation and submission events
   * @param {ShadowRoot} shadow - The shadow DOM root containing the form
   * @param {IFormSchema} schema - The form schema configuration
   * @param {string} formId - Unique identifier for the form
   */
  public setupEvents(
    shadow: ShadowRoot,
    schema: IFormSchema,
    formId: string
  ): void {
    const form = shadow.querySelector("#smartform") as HTMLFormElement;
    if (!form) {
      logger.warn(
        "Form element with id 'smartform' not found in Shadow DOM.",
        FormEventHandler.LOG_CONTEXT
      );
      return;
    }

    // Configure form validation
    form.setAttribute("novalidate", "true");
    form.dataset.validateOnChange =
      schema.validateOnChange?.toString() || "true";

    // Attach field handlers
    this.attachFieldHandlers(form, schema, formId);

    // Handle form submission
    this.setupFormSubmission(form, schema, formId);

    // Initial button state
    this.updateSubmitButtonState(form, schema, formId);
    logger.info(
      `Form events setup completed for ${formId}`,
      FormEventHandler.LOG_CONTEXT
    );
  }

  /**
   * Sets up form submission handling
   * @private
   * @param {HTMLFormElement} form - The form element
   * @param {IFormSchema} schema - The form schema configuration
   * @param {string} formId - Unique identifier for the form
   */
  private setupFormSubmission(
    form: HTMLFormElement,
    schema: IFormSchema,
    formId: string
  ): void {
    form.addEventListener("submit", async (event: Event) => {
      event.preventDefault();

      try {
        logger.info(
          `Processing form submission for ${formId}`,
          FormEventHandler.LOG_CONTEXT
        );

        const submissionHandler = FormSubmissionHandler.getInstance();
        const formData = submissionHandler.collectFormData(form, schema);

        const hasErrors = submissionHandler.validateRemainingFields(
          form,
          schema,
          formData
        );

        if (hasErrors) {
          throw new Error("Form validation failed");
        }

        await this.handleFormSubmission(form, schema, formData, formId);

        logger.info(
          `Form submission successful for ${formId}`,
          FormEventHandler.LOG_CONTEXT
        );
      } catch (error) {
        logger.error(
          `Form submission failed for ${formId}`,
          error instanceof Error ? error : new Error(String(error)),
          FormEventHandler.LOG_CONTEXT
        );
        throw error;
      }
    });
  }

  /**
   * Handles form submission based on configuration
   * @private
   * @param {HTMLFormElement} form - The form element
   * @param {IFormSchema} schema - The form schema configuration
   * @param {Record<string, any>} formData - The collected form data
   * @param {string} formId - Unique identifier for the form
   */
  private async handleFormSubmission(
    form: HTMLFormElement,
    schema: IFormSchema,
    formData: Record<string, any>,
    formId: string
  ): Promise<void> {
    if (schema.api) {
      await formApiHandler.handleSubmission(form, schema, formData, formId);
    } else {
      const submitEvent = new CustomEvent(FORM_API_EVENTS.SUBMIT, {
        bubbles: true,
        composed: true,
        detail: formData,
      });
      form.dispatchEvent(submitEvent);
      form.reset();
    }
  }
}

/**
 * Singleton instance of the FormEventHandler
 * @const {FormEventHandler}
 */
export const formEventHandler = FormEventHandler.getInstance();
