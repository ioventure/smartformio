import { FormSchema } from "@interfaces/core.interface";
import { SubmissionResponse } from "@interfaces/api.interface";
import { FormApi } from "@api/form.api";
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
 * Handles form submission with API integration and callbacks
 */
export async function handleFormSubmission(
  form: HTMLFormElement,
  schema: FormSchema,
  shadow: ShadowRoot
): Promise<void> {
  try {
    // Collect form data
    const formData = collectFormData(form, schema);

    // Validate all fields
    const hasErrors = validateRemainingFields(form, schema, formData);
    if (hasErrors) {
      throw new Error("Form validation failed");
    }

    // Call onSubmit callback if provided
    if (schema.callbacks?.onSubmit) {
      await schema.callbacks.onSubmit(formData);
    }

    // Dispatch submit event
    dispatchFormEvent(form, FORM_EVENTS.SUBMIT, formData);

    // If API config is provided, submit to API
    let response: SubmissionResponse | undefined;
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
        response = await FormApi.submit(formData, schema.api);

        if (response.success) {
          // Call onSuccess callback if provided
          if (schema.callbacks?.onSuccess) {
            await schema.callbacks.onSuccess(response.data);
          }

          // Dispatch success event
          dispatchFormEvent(form, FORM_EVENTS.SUCCESS, {
            data: formData,
            response: response.data,
          });
        } else {
          throw response.error;
        }
      } catch (error) {
        // Call onError callback if provided
        if (schema.callbacks?.onError) {
          await schema.callbacks.onError(error);
        }

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
    }

    // Reset form if submission was successful
    if (!schema.api || (response && response.success)) {
      form.reset();
    }
  } catch (error) {
    console.error("Form submission failed:", error);
    throw error;
  }
}
