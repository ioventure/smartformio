/**
 * @file Renderer helper implementation
 * @module Renderer/Helper
 * @description Provides utility functions for rendering form elements.
 */

import { IBaseField } from "@interfaces/core.interface";
import { logger } from "@services/logger.service";

/**
 * HTML attribute map type
 */
type AttributeMap = Record<
  string,
  string | number | boolean | null | undefined
>;

/**
 * HTML special characters mapping
 * @constant
 */
const HTML_ENTITIES = {
  "&": "&amp;",
  "<": "<",
  ">": ">",
  '"': '"',
  "'": "&#039;",
} as const;

/**
 * Field parts configuration
 * @constant
 */
const FIELD_PARTS = {
  FIELD: {
    BASE: "field",
    REQUIRED: "field-required",
    DISABLED: "field-disabled",
  },
  LABEL: {
    BASE: "label",
    HIDDEN: "label-hidden",
  },
  MESSAGE: {
    CONTAINER: "message-container",
    CONTAINER_EMPTY: "message-container-empty",
    HELP: "help-text",
    ERROR: "error-text",
  },
} as const;

/**
 * Field part types
 */
type FieldPart = (typeof FIELD_PARTS.FIELD)[keyof typeof FIELD_PARTS.FIELD];
type LabelPart = (typeof FIELD_PARTS.LABEL)[keyof typeof FIELD_PARTS.LABEL];
type MessagePart =
  (typeof FIELD_PARTS.MESSAGE)[keyof typeof FIELD_PARTS.MESSAGE];

/**
 * Singleton helper for form element rendering
 * @class RenderHelper
 * @description Provides utility functions for rendering form elements including:
 * - HTML attribute rendering
 * - HTML escaping
 * - Label rendering
 * - Message container rendering
 * - Field wrapper rendering
 *
 * @example
 * ```typescript
 * // Using the helper
 * const attrs = renderHelper.renderAttributes({ id: 'example' });
 * const html = renderHelper.renderFieldWrapper(field, inputHtml);
 * ```
 */
export class RenderHelper {
  private static instance: RenderHelper;
  private static readonly LOG_CONTEXT = "FormRenderer:Helper";

  private constructor() {
    logger.info("RenderHelper singleton initialized", RenderHelper.LOG_CONTEXT);
  }

  /**
   * Gets the singleton instance of RenderHelper
   * @returns {RenderHelper} The singleton instance
   */
  public static getInstance(): RenderHelper {
    if (!RenderHelper.instance) {
      RenderHelper.instance = new RenderHelper();
    }
    return RenderHelper.instance;
  }

  /**
   * Renders HTML attributes from an attribute map
   * @param {AttributeMap} attrs - Object containing attribute names and values
   * @returns {string} The rendered attributes string
   */
  public renderAttributes(attrs: AttributeMap): string {
    try {
      logger.debug(
        `Rendering attributes: ${Object.keys(attrs).join(", ")}`,
        RenderHelper.LOG_CONTEXT
      );

      const result = Object.entries(attrs)
        .map(([name, value]) => this.formatAttribute(name, value))
        .filter(Boolean)
        .join(" ");

      logger.debug(
        "Rendered attributes successfully",
        RenderHelper.LOG_CONTEXT
      );
      return result;
    } catch (error) {
      logger.error(
        "Error rendering attributes",
        error instanceof Error ? error : new Error(String(error)),
        RenderHelper.LOG_CONTEXT
      );
      throw error;
    }
  }

  /**
   * Formats a single attribute
   * @private
   */
  private formatAttribute(
    name: string,
    value: string | number | boolean | null | undefined
  ): string {
    if (typeof value === "boolean") {
      return value ? name : "";
    }
    if (value === null || value === undefined || value === "") {
      return "";
    }
    return `${name}="${value}"`;
  }

  /**
   * Escapes HTML special characters in a string
   * @param {string} str - The string to escape
   * @returns {string} The escaped string
   */
  public escapeHtml(str: string): string {
    try {
      return str.replace(
        /[&<>"']/g,
        (char) => HTML_ENTITIES[char as keyof typeof HTML_ENTITIES]
      );
    } catch (error) {
      logger.error(
        "Error escaping HTML",
        error instanceof Error ? error : new Error(String(error)),
        RenderHelper.LOG_CONTEXT
      );
      throw error;
    }
  }

  /**
   * Renders a field label
   * @param {IBaseField} field - The field configuration
   * @param {string} id - The input ID to link the label to
   * @param {boolean} [isHidden] - Whether the label should be visually hidden
   * @returns {string} The rendered label HTML
   */
  public renderFieldLabel(
    field: IBaseField,
    id: string,
    isHidden?: boolean
  ): string {
    try {
      logger.debug(
        `Rendering label for field: ${field.name}`,
        RenderHelper.LOG_CONTEXT
      );

      if (!field.label?.trim()) {
        logger.debug(
          `No label provided for field: ${field.name}`,
          RenderHelper.LOG_CONTEXT
        );
        return "";
      }

      const labelId = `label-${field.name}`;
      const labelParts: LabelPart[] = [FIELD_PARTS.LABEL.BASE];
      if (isHidden) {
        labelParts.push(FIELD_PARTS.LABEL.HIDDEN);
      }

      const escapedLabel = this.escapeHtml(field.label);

      logger.debug(
        `Label rendered successfully for field: ${field.name}`,
        RenderHelper.LOG_CONTEXT
      );

      return `
        <label 
          id="${labelId}" 
          for="${id}" 
          part="${labelParts.join(" ")}"
        >${escapedLabel}</label>
      `;
    } catch (error) {
      logger.error(
        `Error rendering label for field: ${field.name}`,
        error instanceof Error ? error : new Error(String(error)),
        RenderHelper.LOG_CONTEXT
      );
      throw error;
    }
  }

  /**
   * Renders help and error text elements
   * @param {IBaseField} field - The field configuration
   * @returns {string} The rendered message container HTML
   */
  public renderMessageContainer(field: IBaseField): string {
    try {
      logger.debug(
        `Rendering message container for field: ${field.name}`,
        RenderHelper.LOG_CONTEXT
      );

      const helpId = `help-${field.name}`;
      const errorId = `error-${field.name}`;
      const containerParts: MessagePart[] = [FIELD_PARTS.MESSAGE.CONTAINER];

      if (!field.helpText) {
        containerParts.push(FIELD_PARTS.MESSAGE.CONTAINER_EMPTY);
      }

      const result = `
        <div part="${containerParts.join(" ")}">
          ${this.renderHelpText(field, helpId)}
          ${this.renderErrorContainer(field, errorId)}
        </div>
      `;

      logger.debug(
        `Message container rendered successfully for field: ${field.name}`,
        RenderHelper.LOG_CONTEXT
      );

      return result;
    } catch (error) {
      logger.error(
        `Error rendering message container for field: ${field.name}`,
        error instanceof Error ? error : new Error(String(error)),
        RenderHelper.LOG_CONTEXT
      );
      throw error;
    }
  }

  /**
   * Renders help text element
   * @private
   */
  private renderHelpText(field: IBaseField, helpId: string): string {
    return field.helpText
      ? `
        <div 
          id="${helpId}" 
          part="${FIELD_PARTS.MESSAGE.HELP}" 
          data-help="${field.name}"
        >${this.escapeHtml(field.helpText)}</div>
      `
      : "";
  }

  /**
   * Renders error container
   * @private
   */
  private renderErrorContainer(field: IBaseField, errorId: string): string {
    return `
      <div 
        id="${errorId}" 
        part="${FIELD_PARTS.MESSAGE.ERROR}" 
        data-error="${field.name}"
        role="alert" 
        aria-live="polite"
      ></div>
    `;
  }

  /**
   * Renders common field wrapper elements
   * @param {IBaseField} field - The field configuration
   * @param {string} inputHtml - The rendered input HTML
   * @returns {string} The complete field HTML
   */
  public renderFieldWrapper(field: IBaseField, inputHtml: string): string {
    try {
      logger.debug(
        `Rendering field wrapper for: ${field.name}`,
        RenderHelper.LOG_CONTEXT
      );

      const { fieldId, labelId, describedBy } = this.getFieldIds(field);
      const fieldParts = this.getFieldParts(field);
      const modifiedInputHtml = this.injectAriaDescribedBy(
        inputHtml,
        describedBy
      );

      const result = `
        <div 
          id="${fieldId}" 
          part="${fieldParts.join(" ")}" 
          role="group" 
          aria-labelledby="${labelId}"
        >
          ${this.renderFieldLabel(field, field.name, field.hiddenLabel)}
          <div part="input-container">
            ${modifiedInputHtml}
          </div>
          ${this.renderMessageContainer(field)}
        </div>
      `;

      logger.debug(
        `Field wrapper rendered successfully for: ${field.name}`,
        RenderHelper.LOG_CONTEXT
      );

      return result;
    } catch (error) {
      logger.error(
        `Error rendering field wrapper for: ${field.name}`,
        error instanceof Error ? error : new Error(String(error)),
        RenderHelper.LOG_CONTEXT
      );
      throw error;
    }
  }

  /**
   * Gets field IDs
   * @private
   */
  private getFieldIds(field: IBaseField) {
    const fieldId = `field-${field.name}`;
    const labelId = `label-${field.name}`;
    const helpId = `help-${field.name}`;
    const errorId = `error-${field.name}`;

    const describedBy = [field.helpText ? helpId : null, errorId]
      .filter(Boolean)
      .join(" ");

    return { fieldId, labelId, helpId, errorId, describedBy };
  }

  /**
   * Gets field part classes
   * @private
   */
  private getFieldParts(field: IBaseField): FieldPart[] {
    const parts: FieldPart[] = [FIELD_PARTS.FIELD.BASE];

    if (field.required) {
      parts.push(FIELD_PARTS.FIELD.REQUIRED);
    }
    if (field.disabled) {
      parts.push(FIELD_PARTS.FIELD.DISABLED);
    }

    return parts;
  }

  /**
   * Injects or updates aria-describedby attribute
   * @private
   */
  private injectAriaDescribedBy(
    inputHtml: string,
    describedBy: string
  ): string {
    if (/aria-describedby="/.test(inputHtml)) {
      return inputHtml.replace(
        /aria-describedby="[^"]*"/,
        `aria-describedby="${describedBy}"`
      );
    }
    return inputHtml.replace(
      /(<input\b[^>]*)(>)/,
      `$1 aria-describedby="${describedBy}"$2`
    );
  }
}

/**
 * Singleton instance of the RenderHelper
 * @const {RenderHelper}
 */
export const renderHelper = RenderHelper.getInstance();

/**
 * Helper function to render attributes
 * @param {AttributeMap} attrs - Object containing attribute names and values
 * @returns {string} The rendered attributes string
 */
export const renderAttr = (attrs: AttributeMap): string => {
  return renderHelper.renderAttributes(attrs);
};

/**
 * Helper function to render field wrapper
 * @param {IBaseField} field - The field configuration
 * @param {string} inputHtml - The rendered input HTML
 * @returns {string} The complete field HTML
 */
export const renderFieldWrapper = (
  field: IBaseField,
  inputHtml: string
): string => {
  return renderHelper.renderFieldWrapper(field, inputHtml);
};
