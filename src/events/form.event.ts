import { FormSchema } from "../interfaces/form.interface";
import { validateField, validateForm } from "../utils/validation";

/**
 * Sets up form validation and submission events on the provided Shadow DOM.
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

  // Setup validation for each field
  schema.fields.forEach((field) => {
    const input = form.querySelector(
      `[name="${field.name}"]`
    ) as HTMLInputElement;
    const errorElement = form.querySelector(
      `[data-error="${field.name}"]`
    ) as HTMLElement;
    const helpElement = form.querySelector(
      `[data-help="${field.name}"]`
    ) as HTMLElement;

    if (!input || !errorElement) return;

    const showError = (message: string) => {
      // Show error message
      errorElement.textContent = message;
      errorElement.style.setProperty("display", "block", "important");

      // Add invalid state to input
      input.classList.add("input-invalid");
      input.style.setProperty("border-color", "#dc3545", "important");

      // Hide help text
      if (helpElement) {
        helpElement.style.setProperty("display", "none", "important");
      }
    };

    const hideError = () => {
      // Hide error message
      errorElement.textContent = "";
      errorElement.style.setProperty("display", "none", "important");

      // Remove invalid state from input
      input.classList.remove("input-invalid");
      input.style.removeProperty("border-color");

      // Show help text
      if (helpElement) {
        helpElement.style.setProperty("display", "block", "important");
      }
    };

    // Initialize help text display
    if (helpElement) {
      helpElement.style.setProperty("display", "block", "important");
    }
    errorElement.style.setProperty("display", "none", "important");

    const validateAndShowError = () => {
      const result = validateField(field, input.value);
      if (!result.isValid && result.message) {
        showError(result.message);
      } else {
        hideError();
      }
    };

    // Add validation on blur
    input.addEventListener("blur", validateAndShowError);

    // Add validation on input if validateOnChange is true
    if (schema.validateOnChange) {
      input.addEventListener("input", () => {
        // For real-time validation, wait a short moment to let the input value update
        setTimeout(validateAndShowError, 0);
      });
    }
  });

  // Setup form submission
  form.addEventListener("submit", (event: Event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Validate all fields
    const validationResults = validateForm(schema, data);
    let hasErrors = false;

    // Show validation messages
    Object.entries(validationResults).forEach(([fieldName, result]) => {
      const input = form.querySelector(
        `[name="${fieldName}"]`
      ) as HTMLInputElement;
      const errorElement = form.querySelector(
        `[data-error="${fieldName}"]`
      ) as HTMLElement;
      const helpElement = form.querySelector(
        `[data-help="${fieldName}"]`
      ) as HTMLElement;

      if (!result.isValid && result.message) {
        hasErrors = true;
        if (errorElement) {
          // Show error message
          errorElement.textContent = result.message;
          errorElement.style.setProperty("display", "block", "important");

          // Add invalid state to input
          input?.classList.add("input-invalid");
          input?.style.setProperty("border-color", "#dc3545", "important");

          // Hide help text
          if (helpElement) {
            helpElement.style.setProperty("display", "none", "important");
          }
        }
      } else {
        if (errorElement) {
          // Hide error message
          errorElement.textContent = "";
          errorElement.style.setProperty("display", "none", "important");

          // Remove invalid state from input
          input?.classList.remove("input-invalid");
          input?.style.removeProperty("border-color");

          // Show help text
          if (helpElement) {
            helpElement.style.setProperty("display", "block", "important");
          }
        }
      }
    });

    // Only submit if there are no validation errors
    if (!hasErrors) {
      onSubmit(data);
    }
  });
}
