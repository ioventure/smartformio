import { FormSchema } from "@interfaces/core.interface";
import { validateField, validateForm } from "@utils/validation";

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
    const inputs = form.querySelectorAll(
      `[name="${field.name}"], [name="${field.name}[]"]`
    );
    const errorElement = form.querySelector(
      `[data-error="${field.name}"]`
    ) as HTMLElement;
    const helpElement = form.querySelector(
      `[data-help="${field.name}"]`
    ) as HTMLElement;

    if (!inputs.length || !errorElement) return;

    const showError = (message: string) => {
      // Show error message
      errorElement.textContent = message;
      errorElement.setAttribute("part", "error-text error-text-visible");

      // Add invalid state to inputs
      inputs.forEach((input) => {
        const inputParts = input.getAttribute("part")?.split(" ") || [];
        input.setAttribute("part", [...inputParts, "input-invalid"].join(" "));
        input.setAttribute("aria-invalid", "true");
      });

      // Hide help text
      if (helpElement) {
        helpElement.setAttribute("part", "help-text help-text-hidden");
      }
    };

    const hideError = () => {
      // Hide error message
      errorElement.textContent = "";
      errorElement.setAttribute("part", "error-text");

      // Remove invalid state from inputs
      inputs.forEach((input) => {
        const inputParts =
          input
            .getAttribute("part")
            ?.split(" ")
            .filter((p) => p !== "input-invalid") || [];
        input.setAttribute("part", inputParts.join(" "));
        input.setAttribute("aria-invalid", "false");
      });

      // Show help text
      if (helpElement) {
        helpElement.setAttribute("part", "help-text");
      }
    };

    // Initialize states
    hideError();

    // Handle checkbox group validation
    if (field.type === "checkbox" && field.options) {
      const requiredInput = form.querySelector(
        `[data-required-group="${field.name}"]`
      ) as HTMLInputElement;

      if (requiredInput) {
        inputs.forEach((input) => {
          input.addEventListener("change", () => {
            const checkedInputs = Array.from(inputs).filter(
              (inp: Element) => (inp as HTMLInputElement).checked
            );
            const checkedCount = checkedInputs.length;

            // Validate min/max selection
            if (field.minSelect && checkedCount < field.minSelect) {
              showError(`Please select at least ${field.minSelect} options`);
              requiredInput.value = "";
            } else if (field.maxSelect && checkedCount > field.maxSelect) {
              showError(
                `Please select no more than ${field.maxSelect} options`
              );
              requiredInput.value = "";
              (input as HTMLInputElement).checked = false;
            } else {
              hideError();
              requiredInput.value = checkedCount > 0 ? "true" : "";
            }

            // Disable remaining checkboxes if max is reached
            if (field.maxSelect) {
              const canSelect = checkedCount < field.maxSelect;
              inputs.forEach((inp) => {
                if (!(inp as HTMLInputElement).checked) {
                  (inp as HTMLInputElement).disabled = !canSelect;
                }
              });
            }
          });
        });
      }
    }

    // Handle file input changes
    if (field.type === "file") {
      const fileNameElement = inputs[0].parentElement
        ?.nextElementSibling as HTMLElement;
      if (fileNameElement) {
        inputs[0].addEventListener("change", () => {
          const input = inputs[0] as HTMLInputElement;
          if (input.files?.length) {
            const fileNames = Array.from(input.files)
              .map((file) => file.name)
              .join(", ");
            fileNameElement.textContent = fileNames;
          } else {
            fileNameElement.textContent = "";
          }
          validateAndShowError();
        });
      }
    }

    // Handle date input click to open picker
    if (field.type === "date") {
      inputs[0].addEventListener("click", () => {
        // @ts-ignore: showPicker is a new API and might not be in TypeScript defs
        (inputs[0] as HTMLInputElement).showPicker?.();
      });
    }

    const validateAndShowError = () => {
      const input = inputs[0] as HTMLInputElement;
      const result = validateField(field, input.value);
      if (!result.isValid && result.message) {
        showError(result.message);
      } else {
        hideError();
      }
    };

    // Add validation on blur
    inputs[0].addEventListener("blur", validateAndShowError);

    // Add validation on input if validateOnChange is true (except for file inputs)
    if (schema.validateOnChange && field.type !== "file") {
      inputs[0].addEventListener("input", () => {
        setTimeout(validateAndShowError, 0);
      });
    }
  });

  // Setup form submission
  form.addEventListener("submit", (event: Event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data: Record<string, any> = {};
    const checkboxGroups = new Set<string>();
    let hasErrors = false;

    // First pass: collect checkbox group names and initialize arrays
    formData.forEach((value, key) => {
      if (key.endsWith("[]")) {
        const groupName = key.slice(0, -2);
        checkboxGroups.add(groupName);
        data[groupName] = [];
      }
    });

    // Second pass: process form data
    formData.forEach((value, key) => {
      if (key.endsWith("-required")) return; // Skip hidden required inputs

      const field = schema.fields.find(
        (f) => f.name === key || `${f.name}[]` === key
      );

      if (field?.type === "file" && field.multiple) {
        // Handle multiple files
        const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
        data[key] = input.files ? Array.from(input.files) : [];
      } else if (checkboxGroups.has(key.replace("[]", ""))) {
        // Handle checkbox groups
        const groupName = key.replace("[]", "");
        data[groupName].push(value);
      } else if (field?.type === "checkbox" && !field.options) {
        // Handle single checkbox (convert to boolean)
        const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
        data[key] = input.checked;
      } else {
        // Handle other inputs
        data[key] = value;
      }
    });

    // Third pass: validate checkbox groups
    checkboxGroups.forEach((groupName) => {
      const field = schema.fields.find((f) => f.name === groupName);
      if (field?.type === "checkbox" && field.options) {
        const checkedCount = data[groupName].length;
        const errorElement = form.querySelector(
          `[data-error="${groupName}"]`
        ) as HTMLElement;

        if (field.minSelect && checkedCount < field.minSelect) {
          hasErrors = true;
          if (errorElement) {
            errorElement.textContent = `Please select at least ${field.minSelect} options`;
            errorElement.setAttribute("part", "error-text error-text-visible");
          }
        } else if (field.maxSelect && checkedCount > field.maxSelect) {
          hasErrors = true;
          if (errorElement) {
            errorElement.textContent = `Please select no more than ${field.maxSelect} options`;
            errorElement.setAttribute("part", "error-text error-text-visible");
          }
        }
      }
    });

    // Validate all fields
    const validationResults = validateForm(schema, data);

    // Show validation messages
    Object.entries(validationResults).forEach(([fieldName, result]) => {
      if (!result.isValid && result.message) {
        hasErrors = true;
        const errorElement = form.querySelector(
          `[data-error="${fieldName}"]`
        ) as HTMLElement;
        if (errorElement) {
          errorElement.textContent = result.message;
          errorElement.setAttribute("part", "error-text error-text-visible");
        }
      }
    });

    // Only submit if there are no validation errors
    if (!hasErrors) {
      onSubmit(data);
    }
  });
}
