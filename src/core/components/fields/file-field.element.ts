/**
 * @file File field element implementation
 */

import { Field } from '@domain/field';
import { BaseFieldElement } from '@components/base/field-element.base';
import { IEventHandler } from '@interfaces/events/event-handler.interface';
import { DOMUtils, StringUtils, ValidationUtils, ErrorUtils, CollectionUtils } from '@utils/index';
import {
  COMPONENT_PARTS,
  INPUT_TYPES,
  VALIDATION_MESSAGES,
  EVENT_NAMES,
  ARIA_ATTRIBUTES,
  FILE_SIZE_UNITS,
} from '@core/constants/component.constants';
import { FileValidation } from './index';

type FileFieldConfig = Omit<Field['config'], 'validation'> & {
  validation?: FileValidation;
  multiple?: boolean;
};

export class FileFieldElement extends BaseFieldElement {
  private container: HTMLElement | null = null;
  private fileList: HTMLElement | null = null;
  private dropZone: HTMLElement | null = null;

  public static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'accept', 'multiple', 'max-size', 'max-files'];
  }

  constructor(eventHandler: IEventHandler) {
    super(eventHandler);
  }

  /**
   * Implement required render method
   */
  protected override render(): void {
    if (!this.field) return;

    // Clear existing content
    this.shadow.innerHTML = '';

    // Create container
    this.container = DOMUtils.createElement('div', {
      part: COMPONENT_PARTS.field.root,
    });
    this.shadow.appendChild(this.container);

    // Render field content
    this.renderFieldContent(this.field, this.container);
  }

  /**
   * Create file input element
   */
  protected override createInputElement(field: Field): HTMLElement {
    const config = field.config as unknown as FileFieldConfig;

    // Create wrapper
    const wrapper = DOMUtils.createElement('div', {
      part: COMPONENT_PARTS.file.wrapper,
    });

    // Create properties object with only defined values
    const properties: Partial<HTMLInputElement> = {
      type: INPUT_TYPES.file,
      name: field.name,
    };

    // Add optional properties only if they are defined
    if (config.validation?.accept) properties.accept = config.validation.accept;
    if (config.multiple) properties.multiple = true;
    if (field.config.required) properties.required = true;
    if (field.config.disabled) properties.disabled = true;

    // Create file input
    const input = DOMUtils.createElement('input', {
      properties,
      part: COMPONENT_PARTS.file.input,
    });
    this.inputElement = input;

    // Create drop zone
    this.dropZone = DOMUtils.createElement('div', {
      part: COMPONENT_PARTS.file.dropZone,
    });

    // Create upload icon
    const uploadIcon = DOMUtils.createIcon(
      `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    `,
      {
        part: COMPONENT_PARTS.file.uploadIcon,
      }
    );

    // Create upload text
    const uploadText = DOMUtils.createElement('div', {
      part: COMPONENT_PARTS.file.uploadText,
      text: config.multiple
        ? 'Drop files here or click to upload'
        : 'Drop a file here or click to upload',
    });

    // Create file list
    this.fileList = DOMUtils.createElement('div', {
      part: COMPONENT_PARTS.file.fileList,
    });

    // Assemble drop zone
    if (this.dropZone) {
      this.dropZone.appendChild(uploadIcon);
      this.dropZone.appendChild(uploadText);
      this.dropZone.appendChild(input);
    }

    // Assemble wrapper
    if (this.dropZone) {
      wrapper.appendChild(this.dropZone);
    }
    if (this.fileList) {
      wrapper.appendChild(this.fileList);
    }

    // Add event listeners
    this.addFileEventListeners(input);
    if (this.dropZone) {
      this.addDropZoneEventListeners(this.dropZone);
    }

    return wrapper;
  }

  /**
   * Add file input event listeners
   */
  private addFileEventListeners(input: HTMLInputElement): void {
    input.addEventListener(EVENT_NAMES.change, () => {
      if (input.files) {
        this.handleFiles(input.files);
      }
    });

    // Handle focus/blur
    input.addEventListener(EVENT_NAMES.focus, () => {
      if (this.dropZone) {
        DOMUtils.updatePart(this.dropZone, { add: [COMPONENT_PARTS.states.focused] });
      }
    });

    input.addEventListener(EVENT_NAMES.blur, () => {
      if (this.dropZone) {
        DOMUtils.updatePart(this.dropZone, { remove: [COMPONENT_PARTS.states.focused] });
      }
      if (this.field) {
        this.field.markAsTouched();
        this.updateFieldState(this.field);
      }
    });
  }

  /**
   * Add drop zone event listeners
   */
  private addDropZoneEventListeners(dropZone: HTMLElement): void {
    dropZone.addEventListener(EVENT_NAMES.dragover, (e) => {
      e.preventDefault();
      DOMUtils.updatePart(dropZone, { add: ['dragover'] });
    });

    dropZone.addEventListener(EVENT_NAMES.dragleave, () => {
      DOMUtils.updatePart(dropZone, { remove: ['dragover'] });
    });

    dropZone.addEventListener(EVENT_NAMES.drop, (e) => {
      e.preventDefault();
      DOMUtils.updatePart(dropZone, { remove: ['dragover'] });
      if (e.dataTransfer?.files) {
        this.handleFiles(e.dataTransfer.files);
      }
    });
  }

  /**
   * Handle file selection
   */
  private handleFiles(files: FileList): void {
    if (!this.field) return;

    const config = this.field.config as unknown as FileFieldConfig;
    const validation = config.validation || {};
    const result = ValidationUtils.validateFiles(files, validation);

    if (result.isValid) {
      this.updateFileList(files);
      this.handleFieldChange(files);
    } else {
      // Clear input
      if (this.inputElement instanceof HTMLInputElement) {
        this.inputElement.value = '';
      }
      // Show error
      this.field.setErrors([result.errors[0] || VALIDATION_MESSAGES.fileType]);
      this.updateFieldState(this.field);
    }
  }

  /**
   * Update file list display
   */
  private updateFileList(files: FileList): void {
    if (!this.fileList) return;

    this.fileList.innerHTML = '';

    Array.from(files).forEach((file) => {
      const fileItem = DOMUtils.createElement('div', {
        part: COMPONENT_PARTS.file.fileItem,
      });

      const fileName = DOMUtils.createElement('span', {
        part: COMPONENT_PARTS.file.fileName,
        text: file.name,
      });

      const fileSize = DOMUtils.createElement('span', {
        part: COMPONENT_PARTS.file.fileSize,
        text: StringUtils.formatBytes(file.size),
      });

      fileItem.appendChild(fileName);
      fileItem.appendChild(fileSize);

      if (this.fileList) {
        this.fileList.appendChild(fileItem);
      }
    });
  }

  /**
   * Handle attribute changes
   */
  protected override handleAttributeChange(name: string, value: string | null): void {
    super.handleAttributeChange(name, value || '');

    if (!(this.inputElement instanceof HTMLInputElement)) return;

    switch (name) {
      case 'accept': {
        if (value) {
          this.inputElement.setAttribute('accept', value);
        } else {
          this.inputElement.removeAttribute('accept');
        }
        break;
      }
      case 'multiple': {
        this.inputElement.multiple = value !== null;
        break;
      }
    }
  }

  /**
   * Validate field value
   */
  protected validateField(value: FileList | null): string[] {
    const errors: string[] = [];

    try {
      // Required validation
      if (this.field?.config.required && (!value || value.length === 0)) {
        errors.push(VALIDATION_MESSAGES.required);
      }

      // File validation
      if (value && value.length > 0 && this.field?.config) {
        const config = this.field.config as unknown as FileFieldConfig;
        if (config.validation) {
          const result = ValidationUtils.validateFiles(value, config.validation);
          if (!result.isValid && result.errors.length > 0) {
            errors.push(result.errors[0] || VALIDATION_MESSAGES.fileType);
          }
        }
      }

      // Custom validation
      if (this.field?.config.validation?.custom) {
        const customError = this.field.config.validation.custom(value);
        if (customError) {
          errors.push(customError);
        }
      }
    } catch (error) {
      const err = ErrorUtils.handleError(error);
      errors.push(err.message);
    }

    return errors;
  }

  /**
   * Cleanup
   */
  protected override cleanup(): void {
    super.cleanup();
    this.container = null;
    this.fileList = null;
    this.dropZone = null;
  }
}

// Register custom element
customElements.define('smart-file-field', FileFieldElement);
