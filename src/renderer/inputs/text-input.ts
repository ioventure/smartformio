/**
 * @file Text input renderer implementation
 * @module Renderer/Inputs/Text
 * @description Handles rendering of text-based input fields.
 */

import { ITextField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";
import { logger } from "@services/logger.service";

/**
 * Input types supported by the text input renderer
 * @constant
 */
const TEXT_INPUT_TYPES = {
  TEXT: "text",
  EMAIL: "email",
  PASSWORD: "password",
  NUMBER: "number",
  TEXTAREA: "textarea",
} as const;

/**
 * Type-specific attributes for different input types
 * @constant
 */
const TYPE_SPECIFIC_ATTRS: Record<string, Record<string, any>> = {
  number: {
    min: undefined,
    max: undefined,
    step: "1",
    inputmode: "numeric",
  },
  email: {
    pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
    autocomplete: "email",
    inputmode: "email",
  },
  password: {
    autocomplete: "new-password",
    minlength: undefined,
  },
  text: {
    pattern: undefined,
    autocomplete: undefined,
  },
} as const;

/**
 * Singleton renderer for text input fields
 * @class TextInputRenderer
 * @description Manages rendering of text-based input fields including:
 * - Regular text inputs
 * - Email inputs
 * - Password inputs
 * - Number inputs
 * - Textarea elements
 *
 * Features:
 * - Type-specific attribute handling
 * - Icon support (leading/trailing)
 * - Accessibility attributes
 * - Validation attributes
 * - Error handling
 *
 * @example
 * ```typescript
 * // Using the renderer
 * const html = textInputRenderer.render(field);
 * ```
 */
export class TextInputRenderer {
  private static instance: TextInputRenderer;
  private static readonly LOG_CONTEXT = "TextInputRenderer";

  private constructor() {
    logger.info(
      "TextInputRenderer singleton initialized",
      TextInputRenderer.LOG_CONTEXT
    );
  }

  /**
   * Gets the singleton instance of TextInputRenderer
   * @returns {TextInputRenderer} The singleton instance
   */
  public static getInstance(): TextInputRenderer {
    if (!TextInputRenderer.instance) {
      TextInputRenderer.instance = new TextInputRenderer();
    }
    return TextInputRenderer.instance;
  }

  /**
   * Renders a text input field based on the provided schema
   * @param {ITextField} field - The text field configuration
   * @returns {string} The rendered HTML
   */
  public render(field: ITextField): string {
    try {
      logger.debug(
        `Rendering ${field.type} input for field: ${field.name}`,
        TextInputRenderer.LOG_CONTEXT
      );

      return field.type === TEXT_INPUT_TYPES.TEXTAREA
        ? this.renderTextarea(field)
        : this.renderInput(field);
    } catch (error) {
      logger.error(
        `Error rendering ${field.type} input for ${field.name}`,
        error instanceof Error ? error : new Error(String(error)),
        TextInputRenderer.LOG_CONTEXT
      );
      throw error;
    }
  }

  /**
   * Renders a textarea element
   * @private
   */
  private renderTextarea(field: ITextField): string {
    logger.debug("Rendering as textarea", TextInputRenderer.LOG_CONTEXT);

    const input = `
      <div part="input-wrapper">
        <textarea 
          part="input input-textarea" 
          ${renderAttr({
            name: field.name,
            placeholder: field.placeholder,
            required: field.required,
            readonly: field.readonly,
            disabled: field.disabled,
            "data-testid": `input-${field.name}`,
            minlength: field.minLength?.toString(),
            maxlength: field.maxLength?.toString(),
            "aria-label": field.label,
            "aria-required": field.required ? "true" : undefined,
            "aria-describedby": `help-${field.name} error-${field.name}`,
            "aria-invalid": "false",
          })}
        >${field.value || ""}</textarea>
      </div>
    `;

    return renderFieldWrapper(field, input);
  }

  /**
   * Renders a regular input element
   * @private
   */
  private renderInput(field: ITextField): string {
    logger.debug(
      `Applying type-specific attributes for ${field.type}`,
      TextInputRenderer.LOG_CONTEXT
    );

    const typeAttrs = this.getTypeSpecificAttributes(field);
    const inputParts = this.getInputParts(field);

    logger.debug(
      `Building input with parts: ${inputParts.join(", ")}`,
      TextInputRenderer.LOG_CONTEXT
    );

    const input = `
      <div part="input-wrapper">
        ${this.renderLeadingIcon(field)}
        <input 
          part="${inputParts.join(" ")}"
          ${renderAttr({
            type: field.type,
            name: field.name,
            placeholder: field.placeholder,
            required: field.required,
            readonly: field.readonly,
            disabled: field.disabled,
            "data-testid": `input-${field.name}`,
            minlength: field.minLength?.toString(),
            maxlength: field.maxLength?.toString(),
            "aria-label": field.label,
            "aria-required": field.required ? "true" : undefined,
            "aria-describedby": `help-${field.name} error-${field.name}`,
            "aria-invalid": "false",
            ...typeAttrs,
            value: field.value,
          })} 
        />
        ${this.renderTrailingIcon(field)}
      </div>
    `;

    logger.debug(
      `Input rendered successfully for ${field.name}`,
      TextInputRenderer.LOG_CONTEXT
    );

    return renderFieldWrapper(field, input);
  }

  /**
   * Gets type-specific attributes for the input
   * @private
   */
  private getTypeSpecificAttributes(field: ITextField): Record<string, any> {
    const baseAttrs = TYPE_SPECIFIC_ATTRS[field.type] || {};
    const attrs = { ...baseAttrs };

    if (field.type === TEXT_INPUT_TYPES.NUMBER) {
      if (field.min !== undefined) attrs.min = field.min.toString();
      if (field.max !== undefined) attrs.max = field.max.toString();
    }

    if (field.type === TEXT_INPUT_TYPES.TEXT) {
      attrs.pattern = field.pattern;
      attrs.autocomplete = field.name === "username" ? "username" : "off";
    }

    return attrs;
  }

  /**
   * Gets input part classes
   * @private
   */
  private getInputParts(field: ITextField): string[] {
    const parts = ["input"];
    if (field.type) parts.push(`input-${field.type}`);
    if (field.leadingIcon) parts.push("input-leading-icon");
    if (field.trailingIcon) parts.push("input-trailing-icon");
    return parts;
  }

  /**
   * Renders leading icon if present
   * @private
   */
  private renderLeadingIcon(field: ITextField): string {
    return field.leadingIcon
      ? `<span part="leading-icon" role="presentation">${field.leadingIcon}</span>`
      : "";
  }

  /**
   * Renders trailing icon if present
   * @private
   */
  private renderTrailingIcon(field: ITextField): string {
    return field.trailingIcon
      ? `<span part="trailing-icon" role="presentation">${field.trailingIcon}</span>`
      : "";
  }
}

/**
 * Singleton instance of the TextInputRenderer
 * @const {TextInputRenderer}
 */
export const textInputRenderer = TextInputRenderer.getInstance();

/**
 * Helper function to render text input
 * @param {ITextField} field - The text field configuration
 * @returns {string} The rendered HTML
 */
export const renderTextInput = (field: ITextField): string => {
  return textInputRenderer.render(field);
};
