/**
 * @file File input renderer implementation
 * @module Renderer/Inputs/File
 * @description Handles rendering of file input fields.
 */

import { IFileField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";
import { logger } from "@services/logger.service";

/**
 * File input configuration
 * @constant
 */
const FILE_CONFIG = {
  TYPE: "file",
  ARIA_LABEL_FORMAT: "{label} - File upload {multiple}",
  ARIA_ACCEPT_FORMAT: "Accepted file types: {types}",
  ARIA_SIZE_FORMAT: "Maximum file size: {size}KB",
} as const;

/**
 * Singleton renderer for file input fields
 * @class FileInputRenderer
 * @description Manages rendering of file input fields.
 *
 * Features:
 * - Single/Multiple file upload support
 * - File type restrictions
 * - File size limits
 * - Icon support
 * - Accessibility attributes
 * - Error handling
 *
 * @example
 * ```typescript
 * // Using the renderer
 * const html = fileInputRenderer.render(field);
 * ```
 */
export class FileInputRenderer {
  private static instance: FileInputRenderer;
  private static readonly LOG_CONTEXT = "FileInputRenderer";

  private constructor() {
    logger.info(
      "FileInputRenderer singleton initialized",
      FileInputRenderer.LOG_CONTEXT
    );
  }

  /**
   * Gets the singleton instance of FileInputRenderer
   * @returns {FileInputRenderer} The singleton instance
   */
  public static getInstance(): FileInputRenderer {
    if (!FileInputRenderer.instance) {
      FileInputRenderer.instance = new FileInputRenderer();
    }
    return FileInputRenderer.instance;
  }

  /**
   * Renders a file input field based on the provided schema
   * @param {IFileField} field - The file field configuration
   * @returns {string} The rendered HTML
   */
  public render(field: IFileField): string {
    try {
      logger.debug(
        `Rendering file input for field: ${field.name}`,
        FileInputRenderer.LOG_CONTEXT
      );

      const input = this.renderFileInput(field);

      logger.debug(
        `File input rendered successfully for: ${field.name}`,
        FileInputRenderer.LOG_CONTEXT
      );

      return renderFieldWrapper(field, input);
    } catch (error) {
      logger.error(
        `Error rendering file input for: ${field.name}`,
        error instanceof Error ? error : new Error(String(error)),
        FileInputRenderer.LOG_CONTEXT
      );
      throw error;
    }
  }

  /**
   * Renders the file input element
   * @private
   */
  private renderFileInput(field: IFileField): string {
    logger.debug(
      `Building file input with config: ${JSON.stringify({
        multiple: field.multiple,
        accept: field.accept,
        maxFileSize: field.maxFileSize,
      })}`,
      FileInputRenderer.LOG_CONTEXT
    );

    return `
      <div part="input-wrapper">
        ${this.renderLeadingIcon(field)}
        <input 
          type="${FILE_CONFIG.TYPE}"
          part="${this.getInputParts(field).join(" ")}"
          ${renderAttr({
            name: field.name,
            required: field.required,
            disabled: field.disabled,
            "data-testid": `input-${field.name}`,
            accept: field.accept,
            multiple: field.multiple,
            "aria-label": this.getAriaLabel(field),
            "aria-required": field.required ? "true" : undefined,
            "aria-describedby": this.getAriaDescribedBy(field),
            "aria-invalid": "false",
            "data-max-size": field.maxFileSize,
            "data-max-total-size": field.maxTotalSize,
            "data-max-files": field.maxFiles,
          })}
        />
        ${this.renderFileNameDisplay(field)}
      </div>
      ${this.renderConstraints(field)}
    `;
  }

  /**
   * Gets input part classes
   * @private
   */
  private getInputParts(field: IFileField): string[] {
    const parts = ["input", "input-file"];
    if (field.leadingIcon) {
      parts.push("input-leading-icon");
    }
    return parts;
  }

  /**
   * Renders leading icon if present
   * @private
   */
  private renderLeadingIcon(field: IFileField): string {
    return field.leadingIcon
      ? `<span part="leading-icon" role="presentation">${field.leadingIcon}</span>`
      : "";
  }

  /**
   * Renders file name display element
   * @private
   */
  private renderFileNameDisplay(field: IFileField): string {
    return `
      <div 
        part="filename-display" 
        data-filename="${field.name}"
        role="status"
        aria-live="polite"
      ></div>
    `;
  }

  /**
   * Renders file upload constraints
   * @private
   */
  private renderConstraints(field: IFileField): string {
    const constraints: string[] = [];

    if (field.accept) {
      constraints.push(`Accepted types: ${field.accept}`);
    }
    if (field.maxFileSize) {
      constraints.push(`Max file size: ${field.maxFileSize}KB`);
    }
    if (field.maxTotalSize && field.multiple) {
      constraints.push(`Max total size: ${field.maxTotalSize}KB`);
    }
    if (field.maxFiles && field.multiple) {
      constraints.push(`Max files: ${field.maxFiles}`);
    }

    return constraints.length > 0
      ? `<div part="constraints" id="constraints-${field.name}">${constraints.join(" • ")}</div>`
      : "";
  }

  /**
   * Gets ARIA label for the file input
   * @private
   */
  private getAriaLabel(field: IFileField): string {
    return FILE_CONFIG.ARIA_LABEL_FORMAT.replace(
      "{label}",
      field.label || field.name
    ).replace("{multiple}", field.multiple ? "(multiple files allowed)" : "");
  }

  /**
   * Gets ARIA describedby IDs
   * @private
   */
  private getAriaDescribedBy(field: IFileField): string {
    const ids = [`help-${field.name}`, `error-${field.name}`];

    if (
      field.accept ||
      field.maxFileSize ||
      field.maxTotalSize ||
      field.maxFiles
    ) {
      ids.push(`constraints-${field.name}`);
    }

    return ids.join(" ");
  }
}

/**
 * Singleton instance of the FileInputRenderer
 * @const {FileInputRenderer}
 */
export const fileInputRenderer = FileInputRenderer.getInstance();

/**
 * Helper function to render file input
 * @param {IFileField} field - The file field configuration
 * @returns {string} The rendered HTML
 */
export const renderFileInput = (field: IFileField): string => {
  return fileInputRenderer.render(field);
};
