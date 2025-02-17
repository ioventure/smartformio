import { FormSchema } from "@interfaces/core.interface";
import { FormFieldSchema } from "@interfaces/field.interface";
import { collectFormData, validateRemainingFields } from "./form.submission";
import { handleApiSubmission } from "./form.api.events";
import {
  attachTextInputHandler,
  attachDateInputHandler,
  attachFileInputHandler,
  attachRadioHandler,
  attachSelectHandler,
  attachCheckboxHandler,
} from "./field-handlers";

/**
 * Updates the submit button state based on form validation
 */
function updateSubmitButtonState(
  form: HTMLFormElement,
  schema: FormSchema
): void {
  const submitButton = form.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement;
  if (!submitButton) return;

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

  submitButton.disabled = hasErrors || hasEmptyRequired;
}

/**
 * Sets up form validation and submission events
 */
export function setupFormEvents(shadow: ShadowRoot, schema: FormSchema): void {
  const form = shadow.querySelector("#smartform") as HTMLFormElement;
  if (!form) {
    console.warn("Form element with id 'smartform' not found in Shadow DOM.");
    return;
  }

  // Disable native validation
  form.setAttribute("novalidate", "true");
  form.dataset.validateOnChange = schema.validateOnChange?.toString() || "true";

  // Attach field-specific handlers
  schema.fields.forEach((field: FormFieldSchema) => {
    const updateState = () => updateSubmitButtonState(form, schema);

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
  });

  // Handle form submission
  form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    try {
      // Collect and validate form data
      const formData = collectFormData(form, schema);
      const hasErrors = validateRemainingFields(form, schema, formData);

      if (hasErrors) {
        throw new Error("Form validation failed");
      }

      // Handle API submission if configured
      if (schema.api) {
        await handleApiSubmission(form, schema, formData);
      } else {
        // If no API config, just emit submit event and reset
        const submitEvent = new CustomEvent("smartformio:submit", {
          bubbles: true,
          composed: true,
          detail: formData,
        });
        form.dispatchEvent(submitEvent);
        form.reset();
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      // Let the error propagate for global error handlers
      throw error;
    }
  });

  // Initial button state
  updateSubmitButtonState(form, schema);
}
