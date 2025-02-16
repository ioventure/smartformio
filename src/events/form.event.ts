import { FormSchema } from "@interfaces/core.interface";
import { FormFieldSchema, FileField } from "@interfaces/field.interface";
import { validateField, validateForm } from "@utils/validation";

function isFileField(field: FormFieldSchema): field is FileField {
  return field.type === "file";
}

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

  // Prevent native validation
  form.setAttribute("novalidate", "true");

  // Get submit button reference
  const submitButton = form.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement;

  // Function to update submit button state
  const updateSubmitButtonState = () => {
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
  };

  // Setup validation for each field
  schema.fields.forEach((field: FormFieldSchema) => {
    const inputs: NodeListOf<HTMLInputElement> = form.querySelectorAll(
      `[name="${field.name}"], [name="${field.name}[]"]`
    );
    const errorElement = form.querySelector(
      `[data-error="${field.name}"]`
    ) as HTMLElement;
    const helpElement = form.querySelector(
      `[data-help="${field.name}"]`
    ) as HTMLElement;

    if (!inputs.length || !errorElement) return;

    // ----------------------------
    //  Reusable show/hide helpers
    // ----------------------------
    const showError = (message: string) => {
      errorElement.textContent = message;
      errorElement.setAttribute("part", "error-text error-text-visible");

      if (helpElement) {
        helpElement.setAttribute("part", "help-text help-text-hidden");
      }

      inputs.forEach((input) => {
        const inputParts = input.getAttribute("part")?.split(" ") || [];
        if (!inputParts.includes("input-invalid")) {
          inputParts.push("input-invalid");
        }
        input.setAttribute("part", inputParts.join(" "));
        input.setAttribute("aria-invalid", "true");
      });
      updateSubmitButtonState();
    };

    const hideError = () => {
      errorElement.textContent = "";
      errorElement.setAttribute("part", "error-text");

      if (helpElement) {
        helpElement.setAttribute("part", "help-text");
      }

      inputs.forEach((input) => {
        const inputParts =
          input
            .getAttribute("part")
            ?.split(" ")
            .filter((p) => p !== "input-invalid") || [];
        input.setAttribute("part", inputParts.join(" "));
        input.setAttribute("aria-invalid", "false");
      });
      updateSubmitButtonState();
    };

    // Initialize states
    hideError();
    updateSubmitButtonState();

    // ---------------------------------
    //  Handle checkbox group validation
    // ---------------------------------
    if (field.type === "checkbox" && field.options) {
      const minSelect =
        field.minSelect !== undefined
          ? field.minSelect
          : field.required
            ? 1
            : 0;
      const maxSelect =
        field.maxSelect !== undefined ? field.maxSelect : Infinity;

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

            if (checkedCount < minSelect) {
              showError(
                `Please select at least ${minSelect} option${minSelect > 1 ? "s" : ""}`
              );
              requiredInput.value = "";
            } else if (checkedCount > maxSelect) {
              showError(
                `Please select no more than ${maxSelect} option${maxSelect > 1 ? "s" : ""}`
              );
              requiredInput.value = "";
            } else {
              hideError();
              requiredInput.value = checkedCount > 0 ? "true" : "";
            }

            if (field.maxSelect) {
              const canSelect = checkedCount < maxSelect;
              inputs.forEach((inp) => {
                (inp as HTMLInputElement).disabled =
                  !(inp as HTMLInputElement).checked && !canSelect;
              });
            }
          });
        });
      }
    } else if (field.type === "file") {
      // ----------------------------
      //  Handle file input changes
      // ----------------------------
      inputs[0].addEventListener("change", () => {
        const input = inputs[0] as HTMLInputElement;

        // Optionally update a file name display if an element exists.
        const fileNameElement = input.parentElement
          ?.nextElementSibling as HTMLElement;
        if (fileNameElement) {
          if (input.files && input.files.length > 0) {
            const fileNames = Array.from(input.files)
              .map((file) => file.name)
              .join(", ");
            fileNameElement.textContent = fileNames;
          } else {
            fileNameElement.textContent = "";
          }
        }

        // Determine the value to validate:
        // For multiple file inputs, pass an array of File objects.
        // For a single file input, pass the single File object if available.
        // If no file is selected, pass an empty string.
        const valueToValidate =
          input.files && input.files.length > 0
            ? field.multiple
              ? Array.from(input.files)
              : input.files[0]
            : "";

        const result = validateField(field, valueToValidate);
        if (!result.isValid && result.message) {
          showError(result.message);
        } else {
          hideError();
        }
      });
    } else if (field.type === "date") {
      // ----------------------------
      //  Handle date input: show picker on click and validate on change
      // ----------------------------
      inputs[0].addEventListener("click", () => {
        (inputs[0] as HTMLInputElement).showPicker?.();
      });
      inputs[0].addEventListener("change", () => {
        const input = inputs[0] as HTMLInputElement;
        const result = validateField(field, input.value);
        if (!result.isValid && result.message) {
          showError(result.message);
        } else {
          hideError();
        }
      });
    } else {
      // -------------------------------------
      //  Generic validation on blur or input
      // -------------------------------------
      const validateAndShowError = () => {
        const input = inputs[0] as HTMLInputElement;
        const result = validateField(field, input.value);
        if (!result.isValid && result.message) {
          showError(result.message);
        } else {
          hideError();
        }
      };

      inputs[0].addEventListener("blur", validateAndShowError);
      if (schema.validateOnChange && !isFileField(field) && "value" in field) {
        inputs[0].addEventListener("input", () => {
          setTimeout(validateAndShowError, 0);
        });
      }
    }
  });

  // ---------------------
  //  Setup form submission
  // ---------------------
  form.addEventListener("submit", (event: Event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data: Record<string, any> = {};
    const checkboxGroups = new Set<string>();
    let hasErrors = false;

    // First pass: collect checkbox group names and initialize arrays.
    formData.forEach((value, key) => {
      if (key.endsWith("[]")) {
        const groupName = key.slice(0, -2);
        checkboxGroups.add(groupName);
        data[groupName] = [];
      }
    });

    // Second pass: process form data.
    formData.forEach((value, key) => {
      if (key.endsWith("-required")) return; // Skip hidden required inputs

      const field = schema.fields.find(
        (f) => f.name === key || `${f.name}[]` === key
      );

      if (field?.type === "file") {
        const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
        if (field.multiple) {
          data[key] = input.files ? Array.from(input.files) : [];
        } else {
          data[key] =
            input.files && input.files.length > 0 ? input.files[0] : "";
        }
      } else if (checkboxGroups.has(key.replace("[]", ""))) {
        const groupName = key.replace("[]", "");
        data[groupName].push(value);
      } else if (field?.type === "checkbox" && !field.options) {
        const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
        data[key] = input.checked;
      } else {
        data[key] = value;
      }
    });

    // Ensure file inputs are present even if no file was selected.
    schema.fields.forEach((field) => {
      if (field.type === "file" && !(field.name in data)) {
        data[field.name] = field.multiple ? [] : "";
      }
    });

    // -------------------------------------------------
    //  Third pass: validate checkbox groups individually.
    // -------------------------------------------------
    checkboxGroups.forEach((groupName) => {
      const field = schema.fields.find((f) => f.name === groupName);
      if (field?.type === "checkbox" && field.options) {
        const checkedCount = data[groupName].length;
        const minSelect =
          field.minSelect !== undefined
            ? field.minSelect
            : field.required
              ? 1
              : 0;
        const maxSelect =
          field.maxSelect !== undefined ? field.maxSelect : Infinity;

        const errorElement = form.querySelector(
          `[data-error="${groupName}"]`
        ) as HTMLElement;
        const helpElement = form.querySelector(
          `[data-help="${groupName}"]`
        ) as HTMLElement;
        const inputs = form.querySelectorAll(
          `[name="${groupName}"], [name="${groupName}[]"]`
        );

        if (checkedCount < minSelect) {
          hasErrors = true;
          if (errorElement) {
            errorElement.textContent = field.validationMessage
              ? field.validationMessage
              : `Please select at least ${minSelect} option${minSelect > 1 ? "s" : ""}`;
            errorElement.setAttribute("part", "error-text error-text-visible");
          }
          if (helpElement) {
            helpElement.setAttribute("part", "help-text help-text-hidden");
          }
          inputs.forEach((input) => {
            const inputParts = input.getAttribute("part")?.split(" ") || [];
            if (!inputParts.includes("input-invalid")) {
              inputParts.push("input-invalid");
            }
            input.setAttribute("part", inputParts.join(" "));
            input.setAttribute("aria-invalid", "true");
          });
        } else if (checkedCount > maxSelect) {
          hasErrors = true;
          if (errorElement) {
            errorElement.textContent = `Please select no more than ${maxSelect} option${maxSelect > 1 ? "s" : ""}`;
            errorElement.setAttribute("part", "error-text error-text-visible");
          }
          if (helpElement) {
            helpElement.setAttribute("part", "help-text help-text-hidden");
          }
          inputs.forEach((input) => {
            const inputParts = input.getAttribute("part")?.split(" ") || [];
            if (!inputParts.includes("input-invalid")) {
              inputParts.push("input-invalid");
            }
            input.setAttribute("part", inputParts.join(" "));
            input.setAttribute("aria-invalid", "true");
          });
        } else {
          if (errorElement) {
            errorElement.textContent = "";
            errorElement.setAttribute("part", "error-text");
          }
          if (helpElement) {
            helpElement.setAttribute("part", "help-text");
          }
          inputs.forEach((input) => {
            const inputParts =
              input
                .getAttribute("part")
                ?.split(" ")
                .filter((p) => p !== "input-invalid") || [];
            input.setAttribute("part", inputParts.join(" "));
            input.setAttribute("aria-invalid", "false");
          });
        }
      }
    });

    // ---------------------------
    //  Fourth pass: validate all remaining fields at once.
    // ---------------------------
    const validationResults = validateForm(schema, data);
    Object.entries(validationResults).forEach(([fieldName, result]) => {
      const errorElement = form.querySelector(
        `[data-error="${fieldName}"]`
      ) as HTMLElement;
      const helpElement = form.querySelector(
        `[data-help="${fieldName}"]`
      ) as HTMLElement;
      const inputs = form.querySelectorAll(
        `[name="${fieldName}"], [name="${fieldName}[]"]`
      );

      if (!result.isValid && result.message) {
        hasErrors = true;
        if (errorElement) {
          errorElement.textContent = result.message;
          errorElement.setAttribute("part", "error-text error-text-visible");
        }
        if (helpElement) {
          helpElement.setAttribute("part", "help-text help-text-hidden");
        }
        inputs.forEach((input) => {
          const inputParts = input.getAttribute("part")?.split(" ") || [];
          if (!inputParts.includes("input-invalid")) {
            inputParts.push("input-invalid");
          }
          input.setAttribute("part", inputParts.join(" "));
          input.setAttribute("aria-invalid", "true");
        });
      } else {
        if (errorElement) {
          errorElement.textContent = "";
          errorElement.setAttribute("part", "error-text");
        }
        if (helpElement) {
          helpElement.setAttribute("part", "help-text");
        }
        inputs.forEach((input) => {
          const inputParts =
            input
              .getAttribute("part")
              ?.split(" ")
              .filter((p) => p !== "input-invalid") || [];
          input.setAttribute("part", inputParts.join(" "));
          input.setAttribute("aria-invalid", "false");
        });
      }
    });

    // Update submit button state and submit if no errors
    updateSubmitButtonState();
    if (!hasErrors) {
      onSubmit(data);
    }
  });
}
