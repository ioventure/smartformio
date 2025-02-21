/**
 * @file Field utility functions
 */

import { FILE_SIZE_UNITS, VALIDATION_MESSAGES } from '@core/constants/component.constants';
import { Field, FieldConfig } from '@domain/field';
import { FileValidation, DateValidation } from '@components/fields';
import { CollectionUtils } from '@core/utils/collection.utils';

interface ValidationMessage {
  validationMessage?: string;
}

export class FieldUtils {
  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${FILE_SIZE_UNITS[i]}`;
  }

  /**
   * Format date according to HTML input[type="date"] format (YYYY-MM-DD)
   */
  static formatDate(date: Date): string {
    if (!date || isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Parse date string to Date object
   */
  static parseDate(dateString: string): Date | null {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  /**
   * Validate files against constraints
   */
  static validateFiles(
    files: FileList,
    validation?: FileValidation
  ): { valid: boolean; error?: string } {
    if (!validation) {
      return CollectionUtils.deepClone({ valid: true });
    }

    // Check number of files
    if (validation.maxFiles && files.length > validation.maxFiles) {
      return CollectionUtils.deepClone({
        valid: false,
        error: `Maximum ${validation.maxFiles} files allowed`,
      });
    }

    // Check file sizes
    let totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (!file) continue;

      totalSize += file.size;

      if (validation.maxFileSize && file.size > validation.maxFileSize) {
        return CollectionUtils.deepClone({
          valid: false,
          error: `File "${file.name}" exceeds maximum size of ${this.formatFileSize(validation.maxFileSize)}`,
        });
      }
    }

    if (validation.maxTotalSize && totalSize > validation.maxTotalSize) {
      return CollectionUtils.deepClone({
        valid: false,
        error: `Total size exceeds maximum of ${this.formatFileSize(validation.maxTotalSize)}`,
      });
    }

    return CollectionUtils.deepClone({ valid: true });
  }

  /**
   * Validate date against constraints
   */
  static validateDate(date: Date, validation?: DateValidation): { valid: boolean; error?: string } {
    if (!validation || !date) {
      return CollectionUtils.deepClone({ valid: true });
    }

    const dateValue = date.getTime();

    if (validation.min) {
      const minDate =
        typeof validation.min === 'string' ? new Date(validation.min) : validation.min;

      if (dateValue < minDate.getTime()) {
        return CollectionUtils.deepClone({
          valid: false,
          error: VALIDATION_MESSAGES.dateRange,
        });
      }
    }

    if (validation.max) {
      const maxDate =
        typeof validation.max === 'string' ? new Date(validation.max) : validation.max;

      if (dateValue > maxDate.getTime()) {
        return CollectionUtils.deepClone({
          valid: false,
          error: VALIDATION_MESSAGES.dateRange,
        });
      }
    }

    return CollectionUtils.deepClone({ valid: true });
  }

  /**
   * Get validation message for a field
   */
  static getValidationMessage(field: Field & { config: FieldConfig & ValidationMessage }): string {
    // Get the first available error message
    return field.errors[0] || field.config.validationMessage || '';
  }

  /**
   * Check if field has specific state
   */
  static hasFieldState(field: Field, state: 'valid' | 'invalid' | 'touched' | 'dirty'): boolean {
    switch (state) {
      case 'valid':
        return field.isValid;
      case 'invalid':
        return !field.isValid;
      case 'touched':
        return field.isTouched;
      case 'dirty':
        return field.isDirty;
      default:
        return false;
    }
  }

  /**
   * Get field CSS classes based on state
   */
  static getFieldClasses(field: Field): string[] {
    const classes = [];

    if (field.config.className) {
      classes.push(field.config.className);
    }

    if (field.config.disabled) {
      classes.push('disabled');
    }

    if (field.config.readonly) {
      classes.push('readonly');
    }

    if (field.isValid && field.isTouched) {
      classes.push('valid');
    } else if (!field.isValid && field.isTouched) {
      classes.push('invalid');
    }

    if (field.isTouched) {
      classes.push('touched');
    } else {
      classes.push('untouched');
    }

    if (field.isDirty) {
      classes.push('dirty');
    } else {
      classes.push('pristine');
    }

    return CollectionUtils.unique(classes);
  }

  /**
   * Parse value based on field type
   */
  static parseValue(value: any, type: string): any {
    let parsedValue;
    switch (type) {
      case 'number':
        parsedValue = value === '' ? null : Number(value);
        break;
      case 'date':
        parsedValue = value === '' ? null : new Date(value);
        break;
      case 'checkbox':
        parsedValue = Boolean(value);
        break;
      default:
        parsedValue = value;
    }
    return CollectionUtils.deepClone(parsedValue);
  }
}
