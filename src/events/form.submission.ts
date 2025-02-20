/**
 * @file Form submission handler implementation
 * @module Events/FormSubmission
 * @description Manages form data collection and validation during submission
 */

import { IFormSchema } from "@interfaces/core.interface";
import { IFormFieldSchema, IFileField } from "@interfaces/field.interface";
import { validateForm } from "@utils/validation";
import { logger } from "@services/logger.service";
import { applyErrorState, clearErrorState } from "@events/validation.utils";

/**
 * CSS part names for styling elements
 * @constant
 */
const PARTS = {
  ERROR: {
    BASE: "error-text",
    VISIBLE: "error-text-visible",
  },
  HELP: {
    BASE: "help-text",
    HIDDEN: "help-text-hidden",
  },
} as const;

/**
 * Type guard for file input fields
 * @private
 */
function isFileField(field: IFormFieldSchema): field is IFileField {
  return field.type === "file";
}

/**
 * Singleton handler for form submission
 * @class FormSubmissionHandler
 * @description Manages form data collection and validation during form submission.
 * Handles complex form data structures and field-specific validation.
 *
 * Features:
 * - Form data collection
 * - Checkbox group handling
 * - File input processing
 * - Form-wide validation
 * - Error state management
 *
 * @example
 * ```typescript
 * // Using the handler
 * const data = formSubmissionHandler.collectFormData(form, schema);
 * const hasErrors = formSubmissionHandler.validateRemainingFields(form, schema, data);
 * ```
 */
export class FormSubmissionHandler {
  private static instance: FormSubmissionHandler;
  private static readonly LOG_CONTEXT = "FormSubmissionHandler";

  private constructor() {
    logger.info(
      "FormSubmissionHandler singleton initialized",
      FormSubmissionHandler.LOG_CONTEXT
    );
  }

  /**
   * Gets the singleton instance of FormSubmissionHandler
   * @returns {FormSubmissionHandler} The singleton instance
   */
  public static getInstance(): FormSubmissionHandler {
    if (!FormSubmissionHandler.instance) {
      FormSubmissionHandler.instance = new FormSubmissionHandler();
    }
    return FormSubmissionHandler.instance;
  }

  /**
   * Collects form data based on the schema configuration
   * @param {HTMLFormElement} form - The form element
   * @param {IFormSchema} schema - The form schema configuration
   * @returns {Record<string, any>} Collected form data
   */
  public collectFormData(
    form: HTMLFormElement,
    schema: IFormSchema
  ): Record<string, any> {
    logger.debug("Collecting form data", FormSubmissionHandler.LOG_CONTEXT);

    const formData = new FormData(form);
    const data: Record<string, any> = {};
    const checkboxGroups = new Set<string>();

    try {
      this.initializeCheckboxGroups(formData, data, checkboxGroups);
      this.processFormData(form, schema, formData, data, checkboxGroups);
      this.ensureFileInputs(schema, data);

      logger.debug(
        "Form data collected successfully",
        FormSubmissionHandler.LOG_CONTEXT
      );
      return data;
    } catch (error) {
      logger.error(
        "Error collecting form data",
        error instanceof Error ? error : new Error(String(error)),
        FormSubmissionHandler.LOG_CONTEXT
      );
      throw error;
    }
  }

  /**
   * Initializes checkbox groups in the form data
   * @private
   */
  private initializeCheckboxGroups(
    formData: FormData,
    data: Record<string, any>,
    checkboxGroups: Set<string>
  ): void {
    formData.forEach((_value, key) => {
      if (key.endsWith("[]")) {
        const groupName = key.slice(0, -2);
        checkboxGroups.add(groupName);
        data[groupName] = [];
      }
    });
  }

  /**
   * Processes form data for all field types
   * @private
   */
  private processFormData(
    form: HTMLFormElement,
    schema: IFormSchema,
    formData: FormData,
    data: Record<string, any>,
    checkboxGroups: Set<string>
  ): void {
    formData.forEach((value, key) => {
      if (key.endsWith("-required")) return;

      const field = schema.fields.find(
        (f) => f.name === key || `${f.name}[]` === key
      );
      if (!field) return;

      this.processFieldValue(form, field, key, value, data, checkboxGroups);
    });
  }

  /**
   * Processes value for a specific field
   * @private
   */
  private processFieldValue(
    form: HTMLFormElement,
    field: IFormFieldSchema,
    key: string,
    value: FormDataEntryValue,
    data: Record<string, any>,
    checkboxGroups: Set<string>
  ): void {
    if (isFileField(field)) {
      this.processFileInput(form, field, key, data);
    } else if (checkboxGroups.has(key.replace("[]", ""))) {
      const groupName = key.replace("[]", "");
      data[groupName].push(value);
    } else if (field.type === "checkbox" && !field.options) {
      const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
      data[key] = input.checked;
    } else {
      data[key] = value;
    }
  }

  /**
   * Processes file input fields
   * @private
   */
  private processFileInput(
    form: HTMLFormElement,
    field: IFileField,
    key: string,
    data: Record<string, any>
  ): void {
    const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
    data[key] = field.multiple
      ? input.files
        ? Array.from(input.files)
        : []
      : input.files && input.files.length > 0
        ? input.files[0]
        : "";
  }

  /**
   * Ensures file inputs are present in data
   * @private
   */
  private ensureFileInputs(
    schema: IFormSchema,
    data: Record<string, any>
  ): void {
    schema.fields.forEach((field: IFormFieldSchema) => {
      if (isFileField(field) && !(field.name in data)) {
        data[field.name] = field.multiple ? [] : "";
      }
    });
  }

  /**
   * Validates remaining fields and updates error states
   * @param {HTMLFormElement} form - The form element
   * @param {IFormSchema} schema - The form schema configuration
   * @param {Record<string, any>} data - The collected form data
   * @returns {boolean} True if there are validation errors
   */
  public validateRemainingFields(
    form: HTMLFormElement,
    schema: IFormSchema,
    data: Record<string, any>
  ): boolean {
    logger.debug(
      "Validating remaining fields",
      FormSubmissionHandler.LOG_CONTEXT
    );

    try {
      let hasErrors = false;
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
        ) as NodeListOf<HTMLInputElement>;

        if (!result.isValid && result.message) {
          hasErrors = true;
          applyErrorState(inputs, errorElement, helpElement, result.message);
        } else {
          clearErrorState(inputs, errorElement, helpElement);
        }
      });

      logger.debug(
        `Field validation completed. Has errors: ${hasErrors}`,
        FormSubmissionHandler.LOG_CONTEXT
      );
      return hasErrors;
    } catch (error) {
      logger.error(
        "Error validating fields",
        error instanceof Error ? error : new Error(String(error)),
        FormSubmissionHandler.LOG_CONTEXT
      );
      throw error;
    }
  }
}

/**
 * Singleton instance of the FormSubmissionHandler
 * @const {FormSubmissionHandler}
 */
export const formSubmissionHandler = FormSubmissionHandler.getInstance();

/**
 * Helper function to collect form data
 * @param {HTMLFormElement} form - The form element
 * @param {IFormSchema} schema - The form schema configuration
 * @returns {Record<string, any>} Collected form data
 */
export const collectFormData = (
  form: HTMLFormElement,
  schema: IFormSchema
): Record<string, any> => {
  return formSubmissionHandler.collectFormData(form, schema);
};

/**
 * Helper function to validate remaining fields
 * @param {HTMLFormElement} form - The form element
 * @param {IFormSchema} schema - The form schema configuration
 * @param {Record<string, any>} data - The collected form data
 * @returns {boolean} True if there are validation errors
 */
export const validateRemainingFields = (
  form: HTMLFormElement,
  schema: IFormSchema,
  data: Record<string, any>
): boolean => {
  return formSubmissionHandler.validateRemainingFields(form, schema, data);
};
