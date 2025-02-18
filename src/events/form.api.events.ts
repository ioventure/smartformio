import { IFormSchema } from "@interfaces/core.interface";
import { httpService } from "@services/http.service";
import { logger } from "@services/logger.service";
import { formService } from "@services/form.service";

/**
 * Custom event types for form API events
 */
export const FORM_API_EVENTS = {
  SUBMIT: "smartformio:submit",
  SUCCESS: "smartformio:success",
  ERROR: "smartformio:error",
} as const;

/**
 * Singleton FormApiHandler Service
 * Manages form API events and submissions
 */
export class FormApiHandler {
  private static instance: FormApiHandler;
  private readonly logContext = "FormApiHandler";

  private constructor() {
    logger.info("FormApiHandler singleton initialized", this.logContext);
  }

  /**
   * Get the singleton instance of FormApiHandler
   */
  public static getInstance(): FormApiHandler {
    if (!FormApiHandler.instance) {
      FormApiHandler.instance = new FormApiHandler();
    }
    return FormApiHandler.instance;
  }

  /**
   * Dispatches a custom form event
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
    logger.debug(`Dispatched event: ${eventName}`, this.logContext);
  }

  /**
   * Handles the API submission process
   */
  public async handleSubmission(
    form: HTMLFormElement,
    schema: IFormSchema,
    formData: Record<string, any>,
    formId: string
  ): Promise<void> {
    if (!schema.api) {
      logger.warn("No API configuration provided", this.logContext);
      return;
    }

    logger.info(`Starting API submission for form ${formId}`, this.logContext);

    // Update form state through FormService
    formService.updateSubmitButtonState(formId, true);

    try {
      // Dispatch submit event
      this.dispatchFormEvent(form, FORM_API_EVENTS.SUBMIT, formData);

      // Use singleton httpService instance
      const response = await httpService.request(schema.api, formData);

      if (response.success) {
        logger.info(
          `API submission successful for form ${formId}`,
          this.logContext
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
        this.logContext
      );

      // Dispatch error event
      this.dispatchFormEvent(form, FORM_API_EVENTS.ERROR, {
        data: formData,
        error,
      });

      throw error;
    } finally {
      // Reset UI loading state through FormService
      formService.updateSubmitButtonState(formId, false);
    }
  }

  /**
   * Updates form UI state during API submission
   */
  public updateSubmissionState(formId: string, isSubmitting: boolean): void {
    formService.updateSubmitButtonState(formId, isSubmitting);
  }
}

// Export singleton instance
export const formApiHandler = FormApiHandler.getInstance();
