/**
 * @file Select input renderer implementation
 * @module Renderer/Inputs/Select
 * @description Handles rendering of select dropdown fields.
 */

import { ISelectField, ISelectOption } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";
import { logger } from "@services/logger.service";

/**
 * Select input configuration
 * @constant
 */
const SELECT_CONFIG = {
  ARIA: {
    LABEL_FORMAT: "{label} - Dropdown selection",
    OPTION_FORMAT: "Option {index} of {total}: {label}",
    PLACEHOLDER: "Select an option",
  },
  DEFAULT_OPTION: {
    VALUE: "",
    LABEL: "-- Select --",
  },
} as const;

/**
 * Singleton renderer for select input fields
 * @class SelectInputRenderer
 * @description Manages rendering of select dropdown fields.
 *
 * Features:
 * - Option grouping
 * - Default option handling
 * - Icon support
 * - Accessibility attributes
 * - Keyboard navigation support
 * - Error handling
 *
 * @example
 * ```typescript
 * // Using the renderer
 * const html = selectInputRenderer.render(field);
 * ```
 */
export class SelectInputRenderer {
  private static instance: SelectInputRenderer;
  private static readonly LOG_CONTEXT = "SelectInputRenderer";

  private constructor() {
    logger.info(
      "SelectInputRenderer singleton initialized",
      SelectInputRenderer.LOG_CONTEXT
    );
  }

  /**
   * Gets the singleton instance of SelectInputRenderer
   * @returns {SelectInputRenderer} The singleton instance
   */
  public static getInstance(): SelectInputRenderer {
    if (!SelectInputRenderer.instance) {
      SelectInputRenderer.instance = new SelectInputRenderer();
    }
    return SelectInputRenderer.instance;
  }

  /**
   * Renders a select dropdown field based on the provided schema
   * @param {ISelectField} field - The select field configuration
   * @returns {string} The rendered HTML
   */
  public render(field: ISelectField): string {
    try {
      logger.debug(
        `Rendering select input for field: ${field.name}`,
        SelectInputRenderer.LOG_CONTEXT
      );

      const input = this.renderSelectInput(field);

      logger.debug(
        `Select input rendered successfully for: ${field.name}`,
        SelectInputRenderer.LOG_CONTEXT
      );

      return renderFieldWrapper(field, input);
    } catch (error) {
      logger.error(
        `Error rendering select input for: ${field.name}`,
        error instanceof Error ? error : new Error(String(error)),
        SelectInputRenderer.LOG_CONTEXT
      );
      throw error;
    }
  }

  /**
   * Renders the select input element
   * @private
   */
  private renderSelectInput(field: ISelectField): string {
    logger.debug(
      `Building select with ${field.options.length} options`,
      SelectInputRenderer.LOG_CONTEXT
    );

    return `
      <div part="input-wrapper">
        ${this.renderLeadingIcon(field)}
        <select 
          part="${this.getInputParts(field).join(" ")}"
          ${renderAttr({
            name: field.name,
            required: field.required,
            disabled: field.disabled,
            "data-testid": `input-${field.name}`,
            "aria-label": this.getAriaLabel(field),
            "aria-required": field.required ? "true" : undefined,
            "aria-describedby": `help-${field.name} error-${field.name}`,
            "aria-invalid": "false",
            "aria-expanded": "false",
          })}
        >
          ${this.renderDefaultOption(field)}
          ${this.renderOptions(field)}
        </select>
      </div>
    `;
  }

  /**
   * Gets input part classes
   * @private
   */
  private getInputParts(field: ISelectField): string[] {
    const parts = ["input", "input-select"];
    if (field.leadingIcon) {
      parts.push("input-leading-icon");
    }
    return parts;
  }

  /**
   * Renders leading icon if present
   * @private
   */
  private renderLeadingIcon(field: ISelectField): string {
    return field.leadingIcon
      ? `<span part="leading-icon" role="presentation">${field.leadingIcon}</span>`
      : "";
  }

  /**
   * Renders default empty option
   * @private
   */
  private renderDefaultOption(field: ISelectField): string {
    if (!field.required) {
      return `
        <option 
          value="${SELECT_CONFIG.DEFAULT_OPTION.VALUE}" 
          ${!field.value ? "selected" : ""}
          aria-label="${SELECT_CONFIG.ARIA.PLACEHOLDER}"
        >
          ${SELECT_CONFIG.DEFAULT_OPTION.LABEL}
        </option>
      `;
    }
    return "";
  }

  /**
   * Renders select options
   * @private
   */
  private renderOptions(field: ISelectField): string {
    return field.options
      .map((option, index) => this.renderOption(field, option, index))
      .join("");
  }

  /**
   * Renders a single select option
   * @private
   */
  private renderOption(
    field: ISelectField,
    option: string | ISelectOption,
    index: number
  ): string {
    const value = this.getOptionValue(option);
    const label = this.getOptionLabel(option);
    const selected = field.value === value;

    return `
      <option 
        value="${value}" 
        ${selected ? "selected" : ""}
        aria-label="${this.getOptionAriaLabel(label, index, field.options.length)}"
        data-index="${index}"
      >
        ${label}
      </option>
    `;
  }

  /**
   * Gets option value
   * @private
   */
  private getOptionValue(option: string | ISelectOption): string {
    return typeof option === "string" ? option : option.value;
  }

  /**
   * Gets option label
   * @private
   */
  private getOptionLabel(option: string | ISelectOption): string {
    return typeof option === "string" ? option : option.label;
  }

  /**
   * Gets ARIA label for the select input
   * @private
   */
  private getAriaLabel(field: ISelectField): string {
    return SELECT_CONFIG.ARIA.LABEL_FORMAT.replace(
      "{label}",
      field.label || field.name
    );
  }

  /**
   * Gets ARIA label for a select option
   * @private
   */
  private getOptionAriaLabel(
    label: string,
    index: number,
    total: number
  ): string {
    return SELECT_CONFIG.ARIA.OPTION_FORMAT.replace(
      "{index}",
      (index + 1).toString()
    )
      .replace("{total}", total.toString())
      .replace("{label}", label);
  }
}

/**
 * Singleton instance of the SelectInputRenderer
 * @const {SelectInputRenderer}
 */
export const selectInputRenderer = SelectInputRenderer.getInstance();

/**
 * Helper function to render select input
 * @param {ISelectField} field - The select field configuration
 * @returns {string} The rendered HTML
 */
export const renderSelect = (field: ISelectField): string => {
  return selectInputRenderer.render(field);
};
