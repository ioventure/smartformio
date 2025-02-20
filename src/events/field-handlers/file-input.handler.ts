/**
 * @file File input field handler implementation
 * @module FieldHandlers/File
 * @description Manages event handling and validation for file input fields.
 */

import { IFileField } from "@interfaces/field.interface";
import { validateField } from "@utils/validation";
import { applyErrorState, clearErrorState } from "@events/validation.utils";
import { logger } from "@services/logger.service";

/**
 * Error messages for file validation
 * @constant
 */
const ERROR_MESSAGES = {
  FILE_SIZE: (files: string[], maxSize: number) =>
    `File${files.length > 1 ? "s" : ""} ${files.join(", ")} exceed${files.length === 1 ? "s" : ""} the maximum file size of ${maxSize}KB`,
  TOTAL_SIZE: (totalSize: number, maxSize: number) =>
    `Total upload size of ${totalSize}KB exceeds the maximum allowed size of ${maxSize}KB`,
  MAX_FILES: (maxFiles: number) =>
    `Maximum ${maxFiles} file${maxFiles === 1 ? "" : "s"} allowed`,
} as const;

/**
 * File size units for display
 * @constant
 */
const FILE_UNITS = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
} as const;

/**
 * Singleton handler for file input fields
 * @class FileInputHandler
 * @description Manages event handling and validation for file input fields.
 * Handles both single and multiple file uploads with comprehensive validation.
 *
 * Features:
 * - Single/Multiple file upload support
 * - File size validation (individual and total)
 * - File count validation
 * - File type validation
 * - File name display
 * - Error state management
 * - Accessibility support
 *
 * @example
 * ```typescript
 * // Using the handler
 * attachFileInputHandler(field, form, updateSubmitState);
 * ```
 */
export class FileInputHandler {
  private static instance: FileInputHandler;
  private static readonly LOG_CONTEXT = "FileInputHandler";

  private constructor() {
    logger.info(
      "FileInputHandler singleton initialized",
      FileInputHandler.LOG_CONTEXT
    );
  }

  /**
   * Gets the singleton instance of FileInputHandler
   * @returns {FileInputHandler} The singleton instance
   */
  public static getInstance(): FileInputHandler {
    if (!FileInputHandler.instance) {
      FileInputHandler.instance = new FileInputHandler();
    }
    return FileInputHandler.instance;
  }

  /**
   * Attaches event handlers to file input field
   * @param {IFileField} field - The file field configuration
   * @param {HTMLFormElement} form - The parent form element
   * @param {Function} updateSubmitButtonState - Callback to update form submit button state
   */
  public attachHandler(
    field: IFileField,
    form: HTMLFormElement,
    updateSubmitButtonState: () => void
  ): void {
    const { inputs, errorElement, helpElement } = this.getFormElements(
      field,
      form
    );

    if (!this.validateElements(field, inputs, errorElement)) {
      return;
    }

    const input = inputs[0];
    this.setupFileInput(field, input);
    this.attachEventHandlers(
      field,
      form,
      input,
      errorElement,
      helpElement,
      updateSubmitButtonState
    );
  }

  /**
   * Gets required form elements for the file field
   * @private
   */
  private getFormElements(field: IFileField, form: HTMLFormElement) {
    const selector = `[name="${field.name}"], [name="${field.name}[]"]`;

    return {
      inputs: form.querySelectorAll(selector) as NodeListOf<HTMLInputElement>,
      errorElement: form.querySelector(
        `[data-error="${field.name}"]`
      ) as HTMLElement,
      helpElement: form.querySelector(
        `[data-help="${field.name}"]`
      ) as HTMLElement,
    };
  }

  /**
   * Validates that required elements exist
   * @private
   */
  private validateElements(
    field: IFileField,
    inputs: NodeListOf<HTMLInputElement>,
    errorElement: HTMLElement
  ): boolean {
    if (!inputs.length || !errorElement) {
      logger.warn(
        `Required elements not found for file field: ${field.name}`,
        FileInputHandler.LOG_CONTEXT
      );
      return false;
    }
    return true;
  }

  /**
   * Sets up file input with initial configuration
   * @private
   */
  private setupFileInput(field: IFileField, input: HTMLInputElement): void {
    input.setAttribute("type", "file");
    if (field.accept) input.accept = field.accept;
    if (field.multiple) {
      input.multiple = true;
      input.setAttribute("aria-multiselectable", "true");
    }

    // Set ARIA attributes
    input.setAttribute("aria-label", this.getAriaLabel(field));
    if (field.required) {
      input.setAttribute("aria-required", "true");
    }
  }

  /**
   * Generates ARIA label for file input
   * @private
   */
  private getAriaLabel(field: IFileField): string {
    const parts: string[] = ["Choose"];
    if (field.multiple) parts.push("one or more files");
    else parts.push("a file");

    if (field.accept) {
      const types = field.accept.split(",").map((t) => t.trim());
      parts.push(`of type ${types.join(" or ")}`);
    }

    if (field.maxFileSize) {
      parts.push(`up to ${field.maxFileSize}KB each`);
    }

    return parts.join(" ");
  }

  /**
   * Attaches event handlers to file input
   * @private
   */
  private attachEventHandlers(
    field: IFileField,
    form: HTMLFormElement,
    input: HTMLInputElement,
    errorElement: HTMLElement,
    helpElement: HTMLElement,
    updateSubmitButtonState: () => void
  ): void {
    input.addEventListener("change", () => {
      this.handleFileSelection(field, form, input, errorElement, helpElement);
      updateSubmitButtonState();
    });

    // Handle drag and drop
    input.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
      input.classList.add("dragover");
    });

    input.addEventListener("dragleave", () => {
      input.classList.remove("dragover");
    });

    input.addEventListener("drop", () => {
      input.classList.remove("dragover");
    });
  }

  /**
   * Handles file selection and validation
   * @private
   */
  private handleFileSelection(
    field: IFileField,
    form: HTMLFormElement,
    input: HTMLInputElement,
    errorElement: HTMLElement,
    helpElement: HTMLElement
  ): void {
    // Update file name display
    this.updateFileNameDisplay(form, input, field.name);

    const files = Array.from(input.files || []);
    let validationError = "";

    // Validate files in sequence
    if (field.maxFileSize) {
      validationError = this.validateFileSize(files, field.maxFileSize);
    }

    if (!validationError && field.maxTotalSize && field.multiple) {
      validationError = this.validateTotalSize(files, field.maxTotalSize);
    }

    if (!validationError && field.maxFiles && field.multiple) {
      validationError = this.validateFileCount(files, field.maxFiles);
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

    this.updateValidationState(input, errorElement, helpElement, result);
  }

  /**
   * Updates file name display element
   * @private
   */
  private updateFileNameDisplay(
    form: HTMLFormElement,
    input: HTMLInputElement,
    fieldName: string
  ): void {
    const fileNameElement = form.querySelector(
      `[data-filename="${fieldName}"]`
    ) as HTMLElement;

    if (fileNameElement && input.files) {
      const fileNames = Array.from(input.files).map((file) => file.name);
      fileNameElement.textContent = fileNames.join(", ");
      fileNameElement.setAttribute(
        "aria-label",
        `Selected files: ${fileNames.join(", ")}`
      );
    }
  }

  /**
   * Validates individual file sizes
   * @private
   */
  private validateFileSize(files: File[], maxFileSize: number): string {
    const maxSizeInBytes = maxFileSize * FILE_UNITS.KB;
    const oversizedFiles = files
      .filter((file) => file.size > maxSizeInBytes)
      .map((file) => file.name);

    if (oversizedFiles.length > 0) {
      return ERROR_MESSAGES.FILE_SIZE(oversizedFiles, maxFileSize);
    }
    return "";
  }

  /**
   * Validates total upload size
   * @private
   */
  private validateTotalSize(files: File[], maxTotalSize: number): string {
    const maxTotalSizeInBytes = maxTotalSize * FILE_UNITS.KB;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > maxTotalSizeInBytes) {
      const totalSizeInKB = Math.round(totalSize / FILE_UNITS.KB);
      return ERROR_MESSAGES.TOTAL_SIZE(totalSizeInKB, maxTotalSize);
    }
    return "";
  }

  /**
   * Validates maximum number of files
   * @private
   */
  private validateFileCount(files: File[], maxFiles: number): string {
    if (files.length > maxFiles) {
      return ERROR_MESSAGES.MAX_FILES(maxFiles);
    }
    return "";
  }

  /**
   * Updates validation state and error display
   * @private
   */
  private updateValidationState(
    input: HTMLInputElement,
    errorElement: HTMLElement,
    helpElement: HTMLElement,
    result: { isValid: boolean; message?: string }
  ): void {
    if (!result.isValid && result.message) {
      applyErrorState(
        [input] as unknown as NodeListOf<HTMLInputElement>,
        errorElement,
        helpElement,
        result.message
      );
      input.setAttribute("aria-invalid", "true");
    } else {
      clearErrorState(
        [input] as unknown as NodeListOf<HTMLInputElement>,
        errorElement,
        helpElement
      );
      input.setAttribute("aria-invalid", "false");
    }
  }
}

/**
 * Attaches file input handler to the form
 * @param {IFileField} field - The file field configuration
 * @param {HTMLFormElement} form - The parent form element
 * @param {Function} updateSubmitButtonState - Callback to update form submit button state
 */
export const attachFileInputHandler = (
  field: IFileField,
  form: HTMLFormElement,
  updateSubmitButtonState: () => void
): void => {
  FileInputHandler.getInstance().attachHandler(
    field,
    form,
    updateSubmitButtonState
  );
};
