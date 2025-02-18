import { FormSchema } from "@interfaces/core.interface";
import { FormFieldSchema } from "@interfaces/field.interface";
import { FormSubmissionHandler } from "./form.submission";
import { formApiHandler, FORM_API_EVENTS } from "./form.api.events";
import { logger } from "@services/logger.service";
import { formService } from "@services/form.service";
import {
  attachTextInputHandler,
  attachDateInputHandler,
  attachFileInputHandler,
  attachRadioHandler,
  attachSelectHandler,
  attachCheckboxHandler,
} from "./field-handlers";

/**
 * Singleton FormEventHandler Service
 * Manages form events and validation in both static and SSR environments
 */
export class FormEventHandler {
  private static instance: FormEventHandler;
  private readonly logContext = "FormEventHandler";

  private constructor() {
    logger.info("FormEventHandler singleton initialized", this.logContext);
  }

  /**
   * Get the singleton instance of FormEventHandler
   */
  public static getInstance(): FormEventHandler {
    if (!FormEventHandler.instance) {
      FormEventHandler.instance = new FormEventHandler();
    }
    return FormEventHandler.instance;
  }

  /**
   * Updates the submit button state based on form validation
   */
  private updateSubmitButtonState(
    form: HTMLFormElement,
    schema: FormSchema,
    formId: string
  ): void {
    const hasErrors = form.querySelectorAll('[aria-invalid="true"]').length > 0;
    const hasEmptyRequired = schema.fields.some((field) => {
      if (!field.required) return false;
      const input = form.querySelector(
        `[name="${field.name}"]`
      ) as HTMLInputElement;
      if (!input) return false;

      if (field.type === "checkbox" && field.options) {
        const checkedCount = form.querySelectorAll(
          `[name="${field.name}[]"]:checked`
        ).length;
        return checkedCount < (field.minSelect || 1);
      }
      if (field.type === "checkbox" && !field.options) {
        return field.required && !input.checked;
      }
      if (field.type === "radio") {
        return !form.querySelector(`[name="${field.name}"]:checked`);
      }
      return !input.value;
    });

    const isValid = !hasErrors && !hasEmptyRequired;
    formService.updateSubmitButtonState(formId, !isValid);
  }

  /**
   * Sets up form validation and submission events
   */
  public setupEvents(
    shadow: ShadowRoot,
    schema: FormSchema,
    formId: string
  ): void {
    const form = shadow.querySelector("#smartform") as HTMLFormElement;
    if (!form) {
      logger.warn(
        "Form element with id 'smartform' not found in Shadow DOM.",
        this.logContext
      );
      return;
    }

    // Disable native validation
    form.setAttribute("novalidate", "true");
    form.dataset.validateOnChange =
      schema.validateOnChange?.toString() || "true";

    // Attach field-specific handlers
    schema.fields.forEach((field: FormFieldSchema) => {
      const updateState = () =>
        this.updateSubmitButtonState(form, schema, formId);

      try {
        switch (field.type) {
          case "checkbox":
            attachCheckboxHandler(field, form, updateState);
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
        logger.debug(
          `Attached handler for field: ${field.name}`,
          this.logContext
        );
      } catch (error) {
        logger.error(
          `Failed to attach handler for field: ${field.name}`,
          error instanceof Error ? error : new Error(String(error)),
          this.logContext
        );
      }
    });

    // Handle form submission
    form.addEventListener("submit", async (event: Event) => {
      event.preventDefault();

      try {
        logger.info(
          `Processing form submission for ${formId}`,
          this.logContext
        );

        // Use singleton formSubmissionHandler for data collection and validation
        const formData = FormSubmissionHandler.getInstance().collectFormData(
          form,
          schema
        );
        const hasErrors =
          FormSubmissionHandler.getInstance().validateRemainingFields(
            form,
            schema,
            formData
          );

        if (hasErrors) {
          throw new Error("Form validation failed");
        }

        // Handle API submission if configured
        if (schema.api) {
          await formApiHandler.handleSubmission(form, schema, formData, formId);
        } else {
          // If no API config, just emit submit event and reset
          const submitEvent = new CustomEvent(FORM_API_EVENTS.SUBMIT, {
            bubbles: true,
            composed: true,
            detail: formData,
          });
          form.dispatchEvent(submitEvent);
          form.reset();
        }

        logger.info(
          `Form submission successful for ${formId}`,
          this.logContext
        );
      } catch (error) {
        logger.error(
          `Form submission failed for ${formId}`,
          error instanceof Error ? error : new Error(String(error)),
          this.logContext
        );
        throw error;
      }
    });

    // Initial button state
    this.updateSubmitButtonState(form, schema, formId);
    logger.info(`Form events setup completed for ${formId}`, this.logContext);
  }
}

// Export singleton instance
export const formEventHandler = FormEventHandler.getInstance();
