import { IFormSchema } from "@interfaces/core.interface";
import { httpService } from "@services/http.service";
import { collectFormData, validateRemainingFields } from "./form.submission";

/**
 * Custom event types for form events
 */
export const FORM_EVENTS = {
  SUBMIT: "smartformio:submit",
  SUCCESS: "smartformio:success",
  ERROR: "smartformio:error",
} as const;

/**
 * Dispatches a custom form event
 */
function dispatchFormEvent(
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
}

/**
 * Handles form submission with API integration
 */
export async function handleFormSubmission(
  form: HTMLFormElement,
  schema: IFormSchema
): Promise<void> {
  try {
    // Collect form data
    const formData = collectFormData(form, schema);

    // Validate all fields
    const hasErrors = validateRemainingFields(form, schema, formData);
    if (hasErrors) {
      throw new Error("Form validation failed");
    }

    // Dispatch submit event
    dispatchFormEvent(form, FORM_EVENTS.SUBMIT, formData);

    // If API config is provided, submit to API
    if (schema.api) {
      // Update UI to show loading state
      const submitButton = form.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
      }

      try {
        const response = await httpService.request(schema.api, formData);

        if (response.success) {
          // Dispatch success event
          dispatchFormEvent(form, FORM_EVENTS.SUCCESS, {
            data: formData,
            response: response.data,
          });
          // Reset form on successful submission
          form.reset();
        } else {
          throw response.error;
        }
      } catch (error) {
        // Dispatch error event
        dispatchFormEvent(form, FORM_EVENTS.ERROR, {
          data: formData,
          error,
        });

        throw error;
      } finally {
        // Reset UI loading state
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute("aria-busy");
        }
      }
    } else {
      // If no API config, just dispatch submit event and reset form
      form.reset();
    }
  } catch (error) {
    console.error("Form submission failed:", error);
    throw error;
  }
}
