/**
 * @file Date input renderer implementation
 * @module Renderer/Inputs/Date
 * @description Handles rendering of date input fields.
 */

import { IDateField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";
import { logger } from "@services/logger.service";

/**
 * Date input configuration
 * @constant
 */
const DATE_CONFIG = {
  TYPE: "date",
  ARIA_LABEL_FORMAT: "{label} - Date input in {format} format",
  DEFAULT_FORMAT: "YYYY-MM-DD",
} as const;

/**
 * Singleton renderer for date input fields
 * @class DateInputRenderer
 * @description Manages rendering of date input fields.
 *
 * Features:
 * - Native date picker support
 * - Min/Max date constraints
 * - Icon support
 * - Accessibility attributes
 * - Error handling
 *
 * @example
 * ```typescript
 * // Using the renderer
 * const html = dateInputRenderer.render(field);
 * ```
 */
export class DateInputRenderer {
  private static instance: DateInputRenderer;
  private static readonly LOG_CONTEXT = "DateInputRenderer";

  private constructor() {
    logger.info(
      "DateInputRenderer singleton initialized",
      DateInputRenderer.LOG_CONTEXT
    );
  }

  /**
   * Gets the singleton instance of DateInputRenderer
   * @returns {DateInputRenderer} The singleton instance
   */
  public static getInstance(): DateInputRenderer {
    if (!DateInputRenderer.instance) {
      DateInputRenderer.instance = new DateInputRenderer();
    }
    return DateInputRenderer.instance;
  }

  /**
   * Renders a date input field based on the provided schema
   * @param {IDateField} field - The date field configuration
   * @returns {string} The rendered HTML
   */
  public render(field: IDateField): string {
    try {
      logger.debug(
        `Rendering date input for field: ${field.name}`,
        DateInputRenderer.LOG_CONTEXT
      );

      const input = this.renderDateInput(field);

      logger.debug(
        `Date input rendered successfully for: ${field.name}`,
        DateInputRenderer.LOG_CONTEXT
      );

      return renderFieldWrapper(field, input);
    } catch (error) {
      logger.error(
        `Error rendering date input for: ${field.name}`,
        error instanceof Error ? error : new Error(String(error)),
        DateInputRenderer.LOG_CONTEXT
      );
      throw error;
    }
  }

  /**
   * Renders the date input element
   * @private
   */
  private renderDateInput(field: IDateField): string {
    logger.debug(
      `Building date input with constraints: min=${field.min || "none"}, max=${field.max || "none"}`,
      DateInputRenderer.LOG_CONTEXT
    );

    return `
      <div part="input-wrapper">
        ${this.renderLeadingIcon(field)}
        <input 
          part="${this.getInputParts(field).join(" ")}"
          type="${DATE_CONFIG.TYPE}"
          ${renderAttr({
            name: field.name,
            required: field.required,
            readonly: field.readonly,
            disabled: field.disabled,
            min: this.formatDateValue(field.min),
            max: this.formatDateValue(field.max),
            "data-testid": `input-${field.name}`,
            "aria-label": this.getAriaLabel(field),
            "aria-required": field.required ? "true" : undefined,
            "aria-describedby": `help-${field.name} error-${field.name}`,
            "aria-invalid": "false",
            value: field.value,
          })}
        />
      </div>
    `;
  }

  /**
   * Gets input part classes
   * @private
   */
  private getInputParts(field: IDateField): string[] {
    const parts = ["input", "input-date"];
    if (field.leadingIcon) {
      parts.push("input-leading-icon");
    }
    return parts;
  }

  /**
   * Renders leading icon if present
   * @private
   */
  private renderLeadingIcon(field: IDateField): string {
    return field.leadingIcon
      ? `<span part="leading-icon" role="presentation">${field.leadingIcon}</span>`
      : "";
  }

  /**
   * Formats date value for input min/max attributes
   * @private
   */
  private formatDateValue(value?: string | number): string | undefined {
    if (!value) return undefined;

    if (typeof value === "number") {
      return new Date(value).toISOString().split("T")[0];
    }

    return value;
  }

  /**
   * Gets ARIA label for the date input
   * @private
   */
  private getAriaLabel(field: IDateField): string {
    return DATE_CONFIG.ARIA_LABEL_FORMAT.replace(
      "{label}",
      field.label || field.name
    ).replace("{format}", field.format || DATE_CONFIG.DEFAULT_FORMAT);
  }
}

/**
 * Singleton instance of the DateInputRenderer
 * @const {DateInputRenderer}
 */
export const dateInputRenderer = DateInputRenderer.getInstance();

/**
 * Helper function to render date input
 * @param {IDateField} field - The date field configuration
 * @returns {string} The rendered HTML
 */
export const renderDateInput = (field: IDateField): string => {
  return dateInputRenderer.render(field);
};
