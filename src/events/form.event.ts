// events/form.event.ts

/**
 * Form Event Setup
 *
 * Sets up form validation and submission events within the provided Shadow DOM.
 * It leverages specialized input handlers for each field type, ensuring a clean,
 * modular approach to event logic.
 */

import { FormSchema } from "@interfaces/core.interface";
import { FormFieldSchema } from "@interfaces/field.interface";
import { collectFormData, validateRemainingFields } from "./form.submission";
import {
  attachTextInputHandler,
  attachDateInputHandler,
  attachFileInputHandler,
  attachRadioHandler,
  attachSelectHandler,
  attachCheckboxHandler,
} from "@events/field-handlers";

/**
 * Updates the submit button state based on the form's current validation status.
 * @param form The HTMLFormElement
 * @param schema The form schema
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
 * Sets up form validation and submission events within the provided Shadow DOM.
 * @param shadow The ShadowRoot containing the form
 * @param schema The schema defining the form fields
 * @param onSubmit Callback invoked with form data when submission is successful
 */
export function setupFormEvents(
  shadow: ShadowRoot,
  schema: FormSchema,
  onSubmit: (data: Record<string, any>) => void
): void {
  const form = shadow.querySelector("#smartform") as HTMLFormElement;
  if (!form) {
    console.warn("Form element with id 'smartform' not found in Shadow DOM.");
    return;
  }

  // Disable native validation; rely on our own event-based validation
  form.setAttribute("novalidate", "true");
  form.dataset.validateOnChange = "true";

  // Attach field-specific event handlers
  schema.fields.forEach((field: FormFieldSchema) => {
    switch (field.type) {
      case "checkbox":
        attachCheckboxHandler(field, form, () =>
          updateSubmitButtonState(form, schema)
        );
        break;
      case "date":
        attachDateInputHandler(field, form, () =>
          updateSubmitButtonState(form, schema)
        );
        break;
      case "file":
        attachFileInputHandler(field, form, () =>
          updateSubmitButtonState(form, schema)
        );
        break;
      case "radio":
        attachRadioHandler(field, form, () =>
          updateSubmitButtonState(form, schema)
        );
        break;
      case "select":
        attachSelectHandler(field, form, () =>
          updateSubmitButtonState(form, schema)
        );
        break;
      default:
        // For standard text-based fields (text, email, password, etc.)
        attachTextInputHandler(field, form, () =>
          updateSubmitButtonState(form, schema)
        );
        break;
    }
  });

  // Setup form submission handler
  form.addEventListener("submit", (event: Event) => {
    event.preventDefault();
    const data = collectFormData(form, schema);
    const hasErrors = validateRemainingFields(form, schema, data);
    updateSubmitButtonState(form, schema);

    if (!hasErrors) {
      onSubmit(data);
    }
  });
}
