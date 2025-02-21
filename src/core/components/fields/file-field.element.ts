/**
 * @file File field element implementation
 */

import { Field } from '../../domain/field';
import { BaseFieldElement } from '../base/field-element.base';
import { IEventHandler } from '../../interfaces/events/event-handler.interface';

interface FileValidation {
  maxFileSize?: number; // in bytes
  maxTotalSize?: number; // in bytes
  maxFiles?: number;
  accept?: string;
}

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
    this.container = document.createElement('div');
    this.container.setAttribute('part', 'field-root');
    this.shadow.appendChild(this.container);

    // Render field content
    this.renderFieldContent(this.field, this.container);
  }

  /**
   * Create file input element
   */
  protected override createInputElement(field: Field): HTMLElement {
    const config = field.config as any;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.setAttribute('part', 'file-wrapper');

    // Create file input
    const input = document.createElement('input');
    this.inputElement = input;
    input.type = 'file';
    input.name = field.name;
    input.setAttribute('part', 'file-input');

    if (config.multiple) {
      input.multiple = true;
    }
    if (config.accept) {
      input.accept = config.accept;
    }
    if (field.config.disabled) {
      input.disabled = true;
    }
    if (field.config.required) {
      input.required = true;
    }

    // Create drop zone
    this.dropZone = document.createElement('div');
    this.dropZone.setAttribute('part', 'drop-zone');

    // Create upload icon
    const uploadIcon = document.createElement('div');
    uploadIcon.setAttribute('part', 'upload-icon');
    uploadIcon.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    `;

    // Create upload text
    const uploadText = document.createElement('div');
    uploadText.setAttribute('part', 'upload-text');
    uploadText.textContent = config.multiple
      ? 'Drop files here or click to upload'
      : 'Drop a file here or click to upload';

    // Create file list
    this.fileList = document.createElement('div');
    this.fileList.setAttribute('part', 'file-list');

    // Assemble drop zone
    this.dropZone.appendChild(uploadIcon);
    this.dropZone.appendChild(uploadText);
    this.dropZone.appendChild(input);

    // Assemble wrapper
    wrapper.appendChild(this.dropZone);
    wrapper.appendChild(this.fileList);

    // Add event listeners
    this.addFileEventListeners(input);
    this.addDropZoneEventListeners(this.dropZone);

    return wrapper;
  }

  /**
   * Add file input event listeners
   */
  private addFileEventListeners(input: HTMLInputElement): void {
    input.addEventListener('change', () => {
      if (input.files) {
        this.handleFiles(input.files);
      }
    });

    // Handle focus/blur
    input.addEventListener('focus', () => {
      if (this.dropZone) {
        this.dropZone.setAttribute('part', 'drop-zone focused');
      }
    });

    input.addEventListener('blur', () => {
      if (this.dropZone) {
        this.dropZone.setAttribute('part', 'drop-zone');
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
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.setAttribute('part', 'drop-zone dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.setAttribute('part', 'drop-zone');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.setAttribute('part', 'drop-zone');
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

    const validation = this.validateFiles(files);

    if (validation.valid) {
      this.updateFileList(files);
      this.handleFieldChange(files);
    } else {
      // Clear input
      if (this.inputElement instanceof HTMLInputElement) {
        this.inputElement.value = '';
      }
      // Show error
      this.field.setErrors([validation.error || 'Invalid file selection']);
      this.updateFieldState(this.field);
    }
  }

  /**
   * Validate selected files
   */
  private validateFiles(files: FileList): { valid: boolean; error?: string } {
    if (!this.field) {
      return { valid: false, error: 'Field not initialized' };
    }

    const config = this.field.config as any;
    const validation: FileValidation = config.validation || {};

    // Check number of files
    if (validation.maxFiles && files.length > validation.maxFiles) {
      return {
        valid: false,
        error: `Maximum ${validation.maxFiles} files allowed`,
      };
    }

    // Check file sizes
    let totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (!file) continue;

      totalSize += file.size;

      if (validation.maxFileSize && file.size > validation.maxFileSize) {
        return {
          valid: false,
          error: `File "${file.name}" exceeds maximum size of ${this.formatSize(validation.maxFileSize)}`,
        };
      }
    }

    if (validation.maxTotalSize && totalSize > validation.maxTotalSize) {
      return {
        valid: false,
        error: `Total size exceeds maximum of ${this.formatSize(validation.maxTotalSize)}`,
      };
    }

    return { valid: true };
  }

  /**
   * Update file list display
   */
  private updateFileList(files: FileList): void {
    const fileListElement = this.fileList;
    if (!fileListElement) return;

    fileListElement.innerHTML = '';

    Array.from(files).forEach((file) => {
      const fileItem = document.createElement('div');
      fileItem.setAttribute('part', 'file-item');

      const fileName = document.createElement('span');
      fileName.setAttribute('part', 'file-name');
      fileName.textContent = file.name;

      const fileSize = document.createElement('span');
      fileSize.setAttribute('part', 'file-size');
      fileSize.textContent = this.formatSize(file.size);

      fileItem.appendChild(fileName);
      fileItem.appendChild(fileSize);

      fileListElement.appendChild(fileItem);
    });
  }

  /**
   * Format file size for display
   */
  private formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  /**
   * Handle attribute changes
   */
  protected override handleAttributeChange(name: string, value: string): void {
    super.handleAttributeChange(name, value);

    if (this.inputElement instanceof HTMLInputElement) {
      switch (name) {
        case 'accept':
          if (value) {
            this.inputElement.accept = value;
          } else {
            this.inputElement.removeAttribute('accept');
          }
          break;
        case 'multiple':
          this.inputElement.multiple = value !== null;
          break;
      }
    }
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
