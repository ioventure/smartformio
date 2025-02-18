import { FormSchema } from "@interfaces/core.interface";
import { FormApi } from "../api/form.api";

/**
 * Custom event types for form API events
 */
export const FORM_API_EVENTS = {
  SUBMIT: "smartformio:submit",
  SUCCESS: "smartformio:success",
  ERROR: "smartformio:error",
} as const;

/**
 * Dispatches a custom form event
 */
export function dispatchFormEvent(
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
 * Handles the API submission process
 */
export async function handleApiSubmission(
  this: unknown,
  form: HTMLFormElement,
  schema: FormSchema,
  formData: Record<string, any>
): Promise<void> {
  if (!schema.api) {
    return;
  }

  const submitButton = form.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement;
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
  }

  try {
    // Dispatch submit event
    dispatchFormEvent(form, FORM_API_EVENTS.SUBMIT, formData);

    const response = await FormApi.submit(formData, schema.api);

    if (response.success) {
      // Dispatch success event
      dispatchFormEvent(form, FORM_API_EVENTS.SUCCESS, {
        data: formData,
        response: response.data,
      });

      // Reset form on success
      form.reset();
    } else {
      throw response.error;
    }
  } catch (error) {
    // Dispatch error event
    dispatchFormEvent(form, FORM_API_EVENTS.ERROR, {
      data: formData,
      error,
    });

    console.error("API submission failed:", error);
    throw error;
  } finally {
    // Reset UI loading state
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
    }
  }
}

/**
 * Updates form UI state during API submission
 */
export function updateFormSubmissionState(
  form: HTMLFormElement,
  isSubmitting: boolean
): void {
  const submitButton = form.querySelector(
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
