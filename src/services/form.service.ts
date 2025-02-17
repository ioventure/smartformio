import { FormSchema } from "../interfaces/core.interface";
import { SubmissionResponse } from "../interfaces/api.interface";
import { FormApi } from "../api/form.api";
import { FORM_API_EVENTS, dispatchFormEvent } from "../events/form.api.events";
import { defaultApiConfig, defaultCallbacks } from "../config/form.config";

/**
 * Form Submission Service
 * Handles form submission with API integration and event management
 */
export class FormSubmissionService {
  private form: HTMLFormElement;
  private schema: FormSchema;

  constructor(form: HTMLFormElement, schema: FormSchema) {
    this.form = form;
    this.schema = {
      ...schema,
      api: schema.api || defaultApiConfig,
      callbacks: schema.callbacks || defaultCallbacks,
    };
  }

  /**
   * Handles the form submission process
   */
  async submit(formData: Record<string, any>): Promise<void> {
    try {
      // Call onSubmit callback
      if (this.schema.callbacks?.onSubmit) {
        await this.schema.callbacks.onSubmit(formData);
      }

      // Dispatch submit event
      dispatchFormEvent(this.form, FORM_API_EVENTS.SUBMIT, formData);

      if (this.schema.api) {
        const response = await this.submitToApi(formData);

        if (response.success) {
          await this.handleSuccess(response);
        } else {
          await this.handleError(response.error);
        }
      } else {
        // If no API config, just dispatch submit event and reset form
        this.form.reset();
      }
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  /**
   * Submits form data to the API
   */
  private async submitToApi(
    formData: Record<string, any>
  ): Promise<SubmissionResponse> {
    if (!this.schema.api) {
      throw new Error("API configuration is missing");
    }
    return FormApi.submit(formData, this.schema.api);
  }

  /**
   * Handles successful submission
   */
  private async handleSuccess(response: SubmissionResponse): Promise<void> {
    if (this.schema.callbacks?.onSuccess) {
      await this.schema.callbacks.onSuccess(response.data);
    }

    dispatchFormEvent(this.form, FORM_API_EVENTS.SUCCESS, {
      data: response.data,
    });

    this.form.reset();
  }

  /**
   * Handles submission error
   */
  private async handleError(error: any): Promise<void> {
    if (this.schema.callbacks?.onError) {
      await this.schema.callbacks.onError(error);
    }

    dispatchFormEvent(this.form, FORM_API_EVENTS.ERROR, {
      error,
    });

    if (this.schema.api?.handleError) {
      this.schema.api.handleError(error);
    }
  }

  /**
   * Updates form UI state during submission
   */
  updateSubmitButtonState(isSubmitting: boolean): void {
    const submitButton = this.form.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = isSubmitting;
      if (isSubmitting) {
        submitButton.setAttribute("aria-busy", "true");
      } else {
        submitButton.removeAttribute("aria-busy");
      }
    }
  }
}
