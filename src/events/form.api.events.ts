/**
 * @file Form API event handler implementation
 * @module Events/FormApi
 * @description Manages form API interactions, event dispatching, and submission handling
 */

import { IFormSchema } from "@interfaces/core.interface";
import { httpService } from "@services/http.service";
import { logger } from "@services/logger.service";
import { formService } from "@services/form.service";

/**
 * Custom event types for form API events
 * @constant
 * @description Defines the custom events dispatched during form submission lifecycle
 */
export const FORM_API_EVENTS = {
  /** Fired when form submission starts */
  SUBMIT: "smartformio:submit",
  /** Fired when form submission succeeds */
  SUCCESS: "smartformio:success",
  /** Fired when form submission fails */
  ERROR: "smartformio:error",
} as const;

/**
 * Singleton handler for form API interactions
 * @class FormApiHandler
 * @description Manages form submissions, API interactions, and related events.
 * Coordinates with other services to handle the complete form submission lifecycle.
 *
 * Features:
 * - API submission handling
 * - Custom event dispatching
 * - Form state management
 * - Error handling
 *
 * @example
 * ```typescript
 * // Using the handler
 * await formApiHandler.handleSubmission(form, schema, formData, formId);
 * ```
 */
export class FormApiHandler {
  private static instance: FormApiHandler;
  private static readonly LOG_CONTEXT = "FormApiHandler";

  private constructor() {
    logger.info(
      "FormApiHandler singleton initialized",
      FormApiHandler.LOG_CONTEXT
    );
  }

  /**
   * Gets the singleton instance of FormApiHandler
   * @returns {FormApiHandler} The singleton instance
   */
  public static getInstance(): FormApiHandler {
    if (!FormApiHandler.instance) {
      FormApiHandler.instance = new FormApiHandler();
    }
    return FormApiHandler.instance;
  }

  /**
   * Dispatches a custom form event
   * @private
   * @param {HTMLFormElement} form - The form element to dispatch the event from
   * @param {string} eventName - The name of the event to dispatch
   * @param {Record<string, any>} detail - Event details to include in the payload
   */
  private dispatchFormEvent(
    form: HTMLFormElement,
    eventName: string,
    detail: Record<string, any>
  ): void {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail,
    });
    form.dispatchEvent(event);
    logger.debug(`Dispatched event: ${eventName}`, FormApiHandler.LOG_CONTEXT);
  }

  /**
   * Handles the complete form submission process
   * @description Manages the entire form submission lifecycle including:
   * - Form state updates
   * - Event dispatching
   * - API communication
   * - Success/Error handling
   *
   * @param {HTMLFormElement} form - The form element being submitted
   * @param {IFormSchema} schema - The form schema configuration
   * @param {Record<string, any>} formData - The form data to submit
   * @param {string} formId - Unique identifier for the form
   * @throws {Error} If API submission fails
   */
  public async handleSubmission(
    form: HTMLFormElement,
    schema: IFormSchema,
    formData: Record<string, any>,
    formId: string
  ): Promise<void> {
    if (!schema.api) {
      logger.warn("No API configuration provided", FormApiHandler.LOG_CONTEXT);
      return;
    }

    logger.info(
      `Starting API submission for form ${formId}`,
      FormApiHandler.LOG_CONTEXT
    );

    // Update form state
    formService.updateSubmitButtonState(formId, true);

    try {
      // Dispatch submit event
      this.dispatchFormEvent(form, FORM_API_EVENTS.SUBMIT, formData);

      // Make API request
      const response = await httpService.request(schema.api, formData);

      if (response.success) {
        logger.info(
          `API submission successful for form ${formId}`,
          FormApiHandler.LOG_CONTEXT
        );

        // Dispatch success event
        this.dispatchFormEvent(form, FORM_API_EVENTS.SUCCESS, {
          data: formData,
          response: response.data,
        });

        // Reset form on success
        form.reset();
      } else {
        throw response.error;
      }
    } catch (error) {
      logger.error(
        `API submission failed for form ${formId}`,
        error instanceof Error ? error : new Error(String(error)),
        FormApiHandler.LOG_CONTEXT
      );

      // Dispatch error event
      this.dispatchFormEvent(form, FORM_API_EVENTS.ERROR, {
        data: formData,
        error,
      });

      throw error;
    } finally {
      // Reset UI loading state
      formService.updateSubmitButtonState(formId, false);
    }
  }

  /**
   * Updates form UI state during submission
   * @param {string} formId - Unique identifier for the form
   * @param {boolean} isSubmitting - Whether the form is currently submitting
   */
  public updateSubmissionState(formId: string, isSubmitting: boolean): void {
    formService.updateSubmitButtonState(formId, isSubmitting);
  }
}

/**
 * Singleton instance of the FormApiHandler
 * @const {FormApiHandler}
 */
export const formApiHandler = FormApiHandler.getInstance();
