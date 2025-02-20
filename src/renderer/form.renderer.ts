/**
 * @file Form renderer implementation
 * @module Renderer/Form
 * @description Handles complete form rendering in both static and SSR environments.
 */

import { IFormSchema } from "@interfaces/core.interface";
import {
  IFormFieldSchema,
  ITextField,
  IDateField,
  IFileField,
  ISelectField,
  IRadioField,
  ICheckboxField,
} from "@interfaces/field.interface";
import {
  textInputRenderer,
  dateInputRenderer,
  fileInputRenderer,
  selectInputRenderer,
  radioInputRenderer,
  checkboxInputRenderer,
} from "@renderer/inputs";
import { renderHelper } from "@renderer/helper";
import { logger } from "@services/logger.service";

/**
 * Form configuration
 * @constant
 */
const FORM_CONFIG = {
  ID: "smartform",
  PARTS: {
    CONTAINER: "container",
    TITLE: "title",
    DESCRIPTION: "description",
    BUTTON: "button",
  },
  DEFAULTS: {
    SUBMIT_TEXT: "Submit",
  },
} as const;

/**
 * Field type definitions
 */
type TextFieldType = "text" | "email" | "password" | "number" | "textarea";
type FieldType =
  | TextFieldType
  | "date"
  | "file"
  | "select"
  | "radio"
  | "checkbox";

/**
 * Field type guards
 */
function isTextField(field: IFormFieldSchema): field is ITextField {
  return ["text", "email", "password", "number", "textarea"].includes(
    field.type as string
  );
}

function isDateField(field: IFormFieldSchema): field is IDateField {
  return field.type === "date";
}

function isFileField(field: IFormFieldSchema): field is IFileField {
  return field.type === "file";
}

function isSelectField(field: IFormFieldSchema): field is ISelectField {
  return field.type === "select";
}

function isRadioField(field: IFormFieldSchema): field is IRadioField {
  return field.type === "radio";
}

function isCheckboxField(field: IFormFieldSchema): field is ICheckboxField {
  return field.type === "checkbox";
}

/**
 * Singleton renderer for complete forms
 * @class FormRenderer
 * @description Manages rendering of complete forms based on schema configurations.
 * Coordinates between different input renderers to build the complete form.
 *
 * Features:
 * - Complete form rendering
 * - Field type handling
 * - Title and description support
 * - Submit button customization
 * - Error handling
 *
 * @example
 * ```typescript
 * // Using the renderer
 * const html = await formRenderer.render(schema);
 * ```
 */
export class FormRenderer {
  private static instance: FormRenderer;
  private static readonly LOG_CONTEXT = "FormRenderer";

  private constructor() {
    logger.info("FormRenderer singleton initialized", FormRenderer.LOG_CONTEXT);
  }

  /**
   * Gets the singleton instance of FormRenderer
   * @returns {FormRenderer} The singleton instance
   */
  public static getInstance(): FormRenderer {
    if (!FormRenderer.instance) {
      FormRenderer.instance = new FormRenderer();
    }
    return FormRenderer.instance;
  }

  /**
   * Renders a complete form based on the provided schema
   * @param {IFormSchema} schema - The form configuration schema
   * @returns {Promise<string>} The rendered form HTML
   */
  public async render(schema: IFormSchema): Promise<string> {
    try {
      logger.info(
        `Rendering form with ${schema.fields.length} fields`,
        FormRenderer.LOG_CONTEXT
      );

      this.logFormConfiguration(schema);

      const form = `
        <form 
          id="${FORM_CONFIG.ID}" 
          part="${FORM_CONFIG.PARTS.CONTAINER}"
          novalidate
        >
          ${this.renderFormHeader(schema)}
          ${this.renderFormFields(schema)}
          ${this.renderSubmitButton(schema)}
        </form>
      `;

      logger.info("Form rendered successfully", FormRenderer.LOG_CONTEXT);
      logger.debug(
        `Generated form HTML length: ${form.length} characters`,
        FormRenderer.LOG_CONTEXT
      );

      return form;
    } catch (error) {
      logger.error(
        "Error rendering form",
        error instanceof Error ? error : new Error(String(error)),
        FormRenderer.LOG_CONTEXT
      );
      throw error;
    }
  }

  /**
   * Logs form configuration details
   * @private
   */
  private logFormConfiguration(schema: IFormSchema): void {
    const fieldTypes = schema.fields.map(
      (f) => (f as { type: FieldType }).type
    );

    logger.debug(
      `Form configuration: ${JSON.stringify({
        hasTitle: !!schema.title,
        hasDescription: !!schema.description,
        submitButtonText:
          schema.submitButtonText || FORM_CONFIG.DEFAULTS.SUBMIT_TEXT,
        fieldCount: schema.fields.length,
        fieldTypes,
      })}`,
      FormRenderer.LOG_CONTEXT
    );
  }

  /**
   * Renders form header (title and description)
   * @private
   */
  private renderFormHeader(schema: IFormSchema): string {
    return `
      ${schema.title ? `<h2 part="${FORM_CONFIG.PARTS.TITLE}">${renderHelper.escapeHtml(schema.title)}</h2>` : ""}
      ${schema.description ? `<p part="${FORM_CONFIG.PARTS.DESCRIPTION}">${renderHelper.escapeHtml(schema.description)}</p>` : ""}
    `;
  }

  /**
   * Renders all form fields
   * @private
   */
  private renderFormFields(schema: IFormSchema): string {
    return schema.fields
      .map((field: IFormFieldSchema) => this.renderField(field))
      .join("\n");
  }

  /**
   * Renders a field based on its type
   * @private
   */
  private renderField(field: IFormFieldSchema): string {
    const fieldType = (field as { type: FieldType }).type;

    logger.debug(
      `Rendering field: ${field.name} (type: ${fieldType})`,
      FormRenderer.LOG_CONTEXT
    );

    try {
      if (isTextField(field)) {
        return textInputRenderer.render(field);
      }
      if (isDateField(field)) {
        return dateInputRenderer.render(field);
      }
      if (isFileField(field)) {
        return fileInputRenderer.render(field);
      }
      if (isSelectField(field)) {
        return selectInputRenderer.render(field);
      }
      if (isRadioField(field)) {
        return radioInputRenderer.render(field);
      }
      if (isCheckboxField(field)) {
        return checkboxInputRenderer.render(field);
      }

      logger.warn(
        `Unsupported field type: ${fieldType}`,
        FormRenderer.LOG_CONTEXT
      );
      return "";
    } catch (error) {
      logger.error(
        `Error rendering field: ${field.name}`,
        error instanceof Error ? error : new Error(String(error)),
        FormRenderer.LOG_CONTEXT
      );
      throw error;
    }
  }

  /**
   * Renders form submit button
   * @private
   */
  private renderSubmitButton(schema: IFormSchema): string {
    const buttonText =
      schema.submitButtonText || FORM_CONFIG.DEFAULTS.SUBMIT_TEXT;
    return `
      <button 
        type="submit" 
        part="${FORM_CONFIG.PARTS.BUTTON}"
        disabled
      >${renderHelper.escapeHtml(buttonText)}</button>
    `;
  }
}

/**
 * Singleton instance of the FormRenderer
 * @const {FormRenderer}
 */
export const formRenderer = FormRenderer.getInstance();
