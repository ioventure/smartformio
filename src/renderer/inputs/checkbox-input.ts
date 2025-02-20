/**
 * @file Checkbox input renderer implementation
 * @module Renderer/Inputs/Checkbox
 * @description Handles rendering of checkbox inputs and groups.
 */

import { ICheckboxField, ICheckboxOption } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";
import { logger } from "@services/logger.service";

/**
 * Checkbox input configuration
 * @constant
 */
const CHECKBOX_CONFIG = {
  TYPE: "checkbox",
  DISPLAY: {
    VERTICAL: "vertical",
    HORIZONTAL: "horizontal",
  },
  ARIA: {
    GROUP_LABEL: "{label} - Checkbox group",
    OPTION_LABEL: "Option {index} of {total}: {label}",
    CONSTRAINTS: "Select between {min} and {max} options",
  },
} as const;

/**
 * Singleton renderer for checkbox input fields
 * @class CheckboxInputRenderer
 * @description Manages rendering of checkbox inputs and groups.
 *
 * Features:
 * - Single checkbox support
 * - Checkbox group support
 * - Min/Max selection constraints
 * - Description support
 * - Vertical/Horizontal layout
 * - Accessibility attributes
 * - Error handling
 *
 * @example
 * ```typescript
 * // Using the renderer
 * const html = checkboxInputRenderer.render(field);
 * ```
 */
export class CheckboxInputRenderer {
  private static instance: CheckboxInputRenderer;
  private static readonly LOG_CONTEXT = "CheckboxInputRenderer";

  private constructor() {
    logger.info(
      "CheckboxInputRenderer singleton initialized",
      CheckboxInputRenderer.LOG_CONTEXT
    );
  }

  /**
   * Gets the singleton instance of CheckboxInputRenderer
   * @returns {CheckboxInputRenderer} The singleton instance
   */
  public static getInstance(): CheckboxInputRenderer {
    if (!CheckboxInputRenderer.instance) {
      CheckboxInputRenderer.instance = new CheckboxInputRenderer();
    }
    return CheckboxInputRenderer.instance;
  }

  /**
   * Renders a checkbox input or group based on the provided schema
   * @param {ICheckboxField} field - The checkbox field configuration
   * @returns {string} The rendered HTML
   */
  public render(field: ICheckboxField): string {
    try {
      logger.debug(
        `Rendering checkbox input for field: ${field.name}`,
        CheckboxInputRenderer.LOG_CONTEXT
      );

      const input = field.options
        ? this.renderCheckboxGroup(field)
        : this.renderSingleCheckbox(field);

      logger.debug(
        `Checkbox ${field.options ? "group" : "input"} rendered successfully for: ${field.name}`,
        CheckboxInputRenderer.LOG_CONTEXT
      );

      return renderFieldWrapper(field, input);
    } catch (error) {
      logger.error(
        `Error rendering checkbox input for: ${field.name}`,
        error instanceof Error ? error : new Error(String(error)),
        CheckboxInputRenderer.LOG_CONTEXT
      );
      throw error;
    }
  }

  /**
   * Renders a single checkbox input
   * @private
   */
  private renderSingleCheckbox(field: ICheckboxField): string {
    logger.debug(
      "Rendering single checkbox",
      CheckboxInputRenderer.LOG_CONTEXT
    );

    return `
      <div part="checkbox-wrapper">
        <label part="checkbox-container">
          <input 
            type="${CHECKBOX_CONFIG.TYPE}"
            part="checkbox-input" 
            ${renderAttr({
              name: field.name,
              required: field.required,
              disabled: field.disabled,
              "data-testid": `input-${field.name}`,
              "aria-label": field.label,
              "aria-required": field.required ? "true" : undefined,
              "aria-describedby": this.getSingleCheckboxAriaDescribedBy(field),
              "aria-invalid": "false",
              checked: field.value ? "true" : undefined,
            })} 
          />
          <div part="checkbox-content">
            <span part="checkbox-label">${field.label}</span>
            ${this.renderDescription(field)}
          </div>
        </label>
      </div>
    `;
  }

  /**
   * Renders a checkbox group
   * @private
   */
  private renderCheckboxGroup(field: ICheckboxField): string {
    logger.debug(
      `Rendering checkbox group with ${field.options!.length} options`,
      CheckboxInputRenderer.LOG_CONTEXT
    );

    return `
      <div 
        part="${this.getGroupParts(field).join(" ")}" 
        role="group" 
        aria-label="${this.getGroupAriaLabel(field)}"
        ${this.getGroupConstraints(field)}
      >
        ${this.renderRequiredInput(field)}
        ${this.renderGroupOptions(field)}
      </div>
    `;
  }

  /**
   * Gets group part classes
   * @private
   */
  private getGroupParts(field: ICheckboxField): string[] {
    const parts = ["checkbox-group"];
    const display = field.display || CHECKBOX_CONFIG.DISPLAY.VERTICAL;
    parts.push(`checkbox-group-${display}`);
    return parts;
  }

  /**
   * Gets group constraint attributes
   * @private
   */
  private getGroupConstraints(field: ICheckboxField): string {
    const constraints: string[] = [];

    if (field.minSelect) {
      constraints.push(`data-min-select="${field.minSelect}"`);
    }
    if (field.maxSelect) {
      constraints.push(`data-max-select="${field.maxSelect}"`);
    }

    if (field.minSelect && field.maxSelect) {
      constraints.push(
        `aria-description="${CHECKBOX_CONFIG.ARIA.CONSTRAINTS.replace(
          "{min}",
          field.minSelect.toString()
        ).replace("{max}", field.maxSelect.toString())}"`
      );
    }

    return constraints.join(" ");
  }

  /**
   * Renders required input for groups
   * @private
   */
  private renderRequiredInput(field: ICheckboxField): string {
    return field.required
      ? `
        <input 
          type="hidden" 
          name="${field.name}-required" 
          data-required-group="${field.name}" 
          required
        />
      `
      : "";
  }

  /**
   * Renders checkbox group options
   * @private
   */
  private renderGroupOptions(field: ICheckboxField): string {
    return field
      .options!.map((option, index) =>
        this.renderGroupOption(field, option, index)
      )
      .join("");
  }

  /**
   * Renders a single checkbox group option
   * @private
   */
  private renderGroupOption(
    field: ICheckboxField,
    option: string | ICheckboxOption,
    index: number
  ): string {
    const value = this.getOptionValue(option);
    const label = this.getOptionLabel(option);
    const description = this.getOptionDescription(option);
    const isChecked = Array.isArray(field.value) && field.value.includes(value);

    return `
      <label part="checkbox-container">
        <input 
          type="${CHECKBOX_CONFIG.TYPE}"
          part="checkbox-input${isChecked ? " checkbox-input-checked" : ""}" 
          ${renderAttr({
            name: `${field.name}[]`,
            value: value,
            required: field.required,
            disabled: field.disabled,
            "data-testid": `input-${field.name}-${index}`,
            "data-group": field.name,
            "data-group-index": index.toString(),
            "aria-label": this.getOptionAriaLabel(
              label,
              index,
              field.options!.length
            ),
            "aria-describedby": this.getOptionAriaDescribedBy(
              field,
              index,
              description
            ),
            "aria-invalid": "false",
            checked: isChecked ? "true" : undefined,
          })}
        />
        <div part="checkbox-content">
          <span part="checkbox-label">${label}</span>
          ${this.renderOptionDescription(field.name, index, description)}
        </div>
      </label>
    `;
  }

  /**
   * Gets option value
   * @private
   */
  private getOptionValue(option: string | ICheckboxOption): string {
    return typeof option === "string" ? option : option.value;
  }

  /**
   * Gets option label
   * @private
   */
  private getOptionLabel(option: string | ICheckboxOption): string {
    return typeof option === "string" ? option : option.label;
  }

  /**
   * Gets option description
   * @private
   */
  private getOptionDescription(
    option: string | ICheckboxOption
  ): string | undefined {
    return typeof option === "string" ? undefined : option.description;
  }

  /**
   * Gets ARIA label for the checkbox group
   * @private
   */
  private getGroupAriaLabel(field: ICheckboxField): string {
    return CHECKBOX_CONFIG.ARIA.GROUP_LABEL.replace(
      "{label}",
      field.label || field.name
    );
  }

  /**
   * Gets ARIA label for a checkbox option
   * @private
   */
  private getOptionAriaLabel(
    label: string,
    index: number,
    total: number
  ): string {
    return CHECKBOX_CONFIG.ARIA.OPTION_LABEL.replace(
      "{index}",
      (index + 1).toString()
    )
      .replace("{total}", total.toString())
      .replace("{label}", label);
  }

  /**
   * Gets ARIA describedby for single checkbox
   * @private
   */
  private getSingleCheckboxAriaDescribedBy(
    field: ICheckboxField
  ): string | undefined {
    const ids: string[] = [];

    if (field.description) {
      ids.push(`description-${field.name}`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  }

  /**
   * Gets ARIA describedby for checkbox option
   * @private
   */
  private getOptionAriaDescribedBy(
    field: ICheckboxField,
    index: number,
    description?: string
  ): string {
    const ids: string[] = [];

    if (description) {
      ids.push(`description-${field.name}-${index}`);
    }
    ids.push(`error-${field.name}`);

    return ids.join(" ");
  }

  /**
   * Renders description for single checkbox
   * @private
   */
  private renderDescription(field: ICheckboxField): string {
    return field.description
      ? `<span part="checkbox-description" id="description-${field.name}">${field.description}</span>`
      : "";
  }

  /**
   * Renders description for checkbox option
   * @private
   */
  private renderOptionDescription(
    fieldName: string,
    index: number,
    description?: string
  ): string {
    return description
      ? `<span part="checkbox-description" id="description-${fieldName}-${index}">${description}</span>`
      : "";
  }
}

/**
 * Singleton instance of the CheckboxInputRenderer
 * @const {CheckboxInputRenderer}
 */
export const checkboxInputRenderer = CheckboxInputRenderer.getInstance();

/**
 * Helper function to render checkbox input
 * @param {ICheckboxField} field - The checkbox field configuration
 * @returns {string} The rendered HTML
 */
export const renderCheckbox = (field: ICheckboxField): string => {
  return checkboxInputRenderer.render(field);
};
