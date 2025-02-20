/**
 * @file Radio input renderer implementation
 * @module Renderer/Inputs/Radio
 * @description Handles rendering of radio button groups.
 */

import { IRadioField, IRadioOption } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";
import { logger } from "@services/logger.service";

/**
 * Radio input configuration
 * @constant
 */
const RADIO_CONFIG = {
  TYPE: "radio",
  DISPLAY: {
    VERTICAL: "vertical",
    HORIZONTAL: "horizontal",
  },
  ARIA: {
    GROUP_LABEL: "{label} - Radio button group",
    OPTION_LABEL: "Option {index} of {total}: {label}",
  },
} as const;

/**
 * Singleton renderer for radio input fields
 * @class RadioInputRenderer
 * @description Manages rendering of radio button groups.
 *
 * Features:
 * - Vertical/Horizontal layout support
 * - Option grouping
 * - Accessibility attributes
 * - Keyboard navigation support
 * - Error handling
 *
 * @example
 * ```typescript
 * // Using the renderer
 * const html = radioInputRenderer.render(field);
 * ```
 */
export class RadioInputRenderer {
  private static instance: RadioInputRenderer;
  private static readonly LOG_CONTEXT = "RadioInputRenderer";

  private constructor() {
    logger.info(
      "RadioInputRenderer singleton initialized",
      RadioInputRenderer.LOG_CONTEXT
    );
  }

  /**
   * Gets the singleton instance of RadioInputRenderer
   * @returns {RadioInputRenderer} The singleton instance
   */
  public static getInstance(): RadioInputRenderer {
    if (!RadioInputRenderer.instance) {
      RadioInputRenderer.instance = new RadioInputRenderer();
    }
    return RadioInputRenderer.instance;
  }

  /**
   * Renders a radio button group based on the provided schema
   * @param {IRadioField} field - The radio field configuration
   * @returns {string} The rendered HTML
   */
  public render(field: IRadioField): string {
    try {
      logger.debug(
        `Rendering radio group for field: ${field.name}`,
        RadioInputRenderer.LOG_CONTEXT
      );

      const input = this.renderRadioGroup(field);

      logger.debug(
        `Radio group rendered successfully for: ${field.name}`,
        RadioInputRenderer.LOG_CONTEXT
      );

      return renderFieldWrapper(field, input);
    } catch (error) {
      logger.error(
        `Error rendering radio group for: ${field.name}`,
        error instanceof Error ? error : new Error(String(error)),
        RadioInputRenderer.LOG_CONTEXT
      );
      throw error;
    }
  }

  /**
   * Renders the radio button group
   * @private
   */
  private renderRadioGroup(field: IRadioField): string {
    logger.debug(
      `Building radio group with ${field.options.length} options, display: ${field.display || RADIO_CONFIG.DISPLAY.VERTICAL}`,
      RadioInputRenderer.LOG_CONTEXT
    );

    return `
      <div 
        part="${this.getGroupParts(field).join(" ")}" 
        role="radiogroup" 
        aria-label="${this.getGroupAriaLabel(field)}"
        data-display="${field.display || RADIO_CONFIG.DISPLAY.VERTICAL}"
      >
        ${this.renderOptions(field)}
      </div>
    `;
  }

  /**
   * Gets group part classes
   * @private
   */
  private getGroupParts(field: IRadioField): string[] {
    const parts = ["radio-group"];
    const display = field.display || RADIO_CONFIG.DISPLAY.VERTICAL;
    parts.push(`radio-group-${display}`);
    return parts;
  }

  /**
   * Renders radio options
   * @private
   */
  private renderOptions(field: IRadioField): string {
    return field.options
      .map((option, index) => this.renderOption(field, option, index))
      .join("");
  }

  /**
   * Renders a single radio option
   * @private
   */
  private renderOption(
    field: IRadioField,
    option: string | IRadioOption,
    index: number
  ): string {
    const value = this.getOptionValue(option);
    const label = this.getOptionLabel(option);
    const isChecked = String(field.value) === String(value);

    logger.debug(
      `Rendering radio option: value=${value}, label=${label}, checked=${isChecked}, fieldValue=${field.value}`,
      RadioInputRenderer.LOG_CONTEXT
    );

    return `
      <label 
        part="radio-container${isChecked ? " radio-container-checked" : ""}"
        data-index="${index}"
      >
        <input 
          type="${RADIO_CONFIG.TYPE}"
          part="radio-input${isChecked ? " radio-input-checked" : ""}" 
          ${renderAttr({
            name: field.name,
            value: value,
            required: field.required,
            disabled: field.disabled,
            "data-testid": `input-${field.name}-${index}`,
            "aria-label": this.getOptionAriaLabel(
              label,
              index,
              field.options.length
            ),
            "aria-checked": isChecked ? "true" : "false",
            "aria-required": field.required ? "true" : undefined,
            checked: isChecked ? "checked" : undefined,
            tabindex: index === 0 ? "0" : "-1",
          })} 
        />
        <span part="radio-label">${label}</span>
      </label>
    `;
  }

  /**
   * Gets option value
   * @private
   */
  private getOptionValue(option: string | IRadioOption): string {
    return typeof option === "string" ? option : option.value;
  }

  /**
   * Gets option label
   * @private
   */
  private getOptionLabel(option: string | IRadioOption): string {
    return typeof option === "string" ? option : option.label;
  }

  /**
   * Gets ARIA label for the radio group
   * @private
   */
  private getGroupAriaLabel(field: IRadioField): string {
    return RADIO_CONFIG.ARIA.GROUP_LABEL.replace(
      "{label}",
      field.label || field.name
    );
  }

  /**
   * Gets ARIA label for a radio option
   * @private
   */
  private getOptionAriaLabel(
    label: string,
    index: number,
    total: number
  ): string {
    return RADIO_CONFIG.ARIA.OPTION_LABEL.replace(
      "{index}",
      (index + 1).toString()
    )
      .replace("{total}", total.toString())
      .replace("{label}", label);
  }
}

/**
 * Singleton instance of the RadioInputRenderer
 * @const {RadioInputRenderer}
 */
export const radioInputRenderer = RadioInputRenderer.getInstance();

/**
 * Helper function to render radio input
 * @param {IRadioField} field - The radio field configuration
 * @returns {string} The rendered HTML
 */
export const renderRadio = (field: IRadioField): string => {
  return radioInputRenderer.render(field);
};
