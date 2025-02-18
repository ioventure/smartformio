import { FileField } from "@interfaces/field.interface";
import { validateField } from "@utils/validation";
import { applyErrorState, clearErrorState } from "../validation.utils";
import { logger } from "@services/logger.service";

/**
 * Singleton FileInputHandler Service
 * Attaches change event handlers to file input fields.
 */
export class FileInputHandler {
  private static instance: FileInputHandler;
  private readonly logContext = "FileInputHandler";

  private constructor() {
    logger.info("FileInputHandler singleton initialized", this.logContext);
  }

  /**
   * Get the singleton instance of FileInputHandler
   */
  public static getInstance(): FileInputHandler {
    if (!FileInputHandler.instance) {
      FileInputHandler.instance = new FileInputHandler();
    }
    return FileInputHandler.instance;
  }

  /**
   * Attaches event handlers for file input fields.
   */
  public attachHandler(
    field: FileField,
    form: HTMLFormElement,
    updateSubmitButtonState: () => void
  ): void {
    const inputs = form.querySelectorAll(
      `[name="${field.name}"], [name="${field.name}[]"]`
    ) as NodeListOf<HTMLInputElement>;

    if (!inputs.length) return;

    const input = inputs[0];
    input.addEventListener("change", () => {
      // Update file name display if an element exists
      const fileNameElement = input.parentElement
        ?.nextElementSibling as HTMLElement;
      if (fileNameElement) {
        fileNameElement.textContent =
          input.files && input.files.length > 0
            ? Array.from(input.files)
                .map((file) => file.name)
                .join(", ")
            : "";
      }

      let validationError = "";
      const files = Array.from(input.files || []);

      // Validate individual file sizes
      if (field.maxFileSize) {
        const maxSizeInBytes = field.maxFileSize * 1024;
        const oversizedFiles = files.filter(
          (file) => file.size > maxSizeInBytes
        );
        if (oversizedFiles.length > 0) {
          validationError = `File${oversizedFiles.length > 1 ? "s" : ""} ${oversizedFiles.map((f) => f.name).join(", ")} exceed${oversizedFiles.length === 1 ? "s" : ""} the maximum file size of ${field.maxFileSize}KB`;
        }
      }

      // Validate total upload size for multiple files
      if (!validationError && field.maxTotalSize && field.multiple) {
        const maxTotalSizeInBytes = field.maxTotalSize * 1024;
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        if (totalSize > maxTotalSizeInBytes) {
          const totalSizeInKB = Math.round(totalSize / 1024);
          validationError = `Total upload size of ${totalSizeInKB}KB exceeds the maximum allowed size of ${field.maxTotalSize}KB`;
        }
      }

      // Validate maximum number of files for multiple file upload
      if (!validationError && field.maxFiles && field.multiple) {
        if (files.length > field.maxFiles) {
          validationError = `Maximum ${field.maxFiles} file${field.maxFiles === 1 ? "" : "s"} allowed`;
        }
      }

      const valueToValidate =
        input.files && input.files.length > 0
          ? field.multiple
            ? files
            : input.files[0]
          : "";

      const result = validationError
        ? { isValid: false, message: validationError }
        : validateField(field, valueToValidate);
      const errorElement = form.querySelector(
        `[data-error="${field.name}"]`
      ) as HTMLElement;
      const helpElement = form.querySelector(
        `[data-help="${field.name}"]`
      ) as HTMLElement;

      if (!result.isValid && result.message) {
        applyErrorState(inputs, errorElement, helpElement, result.message);
      } else {
        clearErrorState(inputs, errorElement, helpElement);
      }

      updateSubmitButtonState();
    });
  }
}

// Export singleton instance
export const attachFileInputHandler = (
  field: FileField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
) => {
  FileInputHandler.getInstance().attachHandler(
    field,
    form,
    updateSubmitButtonState
  );
};
