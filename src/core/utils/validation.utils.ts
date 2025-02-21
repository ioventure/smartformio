/**
 * @file Validation utility functions
 */

import { VALIDATION_MESSAGES } from '@core/constants/component.constants';
import { Field, FieldConfig } from '@domain/field';
import { ValidationResult } from '@domain/validation';
import { FileValidation, DateValidation } from '@components/fields';
import { FieldUtils } from './field.utils';

type FieldWithConfig = Field & { config: FieldConfig };

interface BaseValidation {
  custom?: (value: any) => string | null;
}

interface TextValidation extends BaseValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
}

interface NumberValidation extends BaseValidation {
  min?: number;
  max?: number;
}

type ValidationTypes = TextValidation | NumberValidation | FileValidation | DateValidation;

export class ValidationUtils {
  /**
   * Validate required field
   */
  static validateRequired(value: any): ValidationResult {
    const isValid = value != null && value !== '';
    return {
      isValid,
      errors: isValid ? [] : [VALIDATION_MESSAGES.required],
    };
  }

  /**
   * Validate email format
   */
  static validateEmail(value: string): ValidationResult {
    if (!value) return { isValid: true, errors: [] };

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return {
      isValid,
      errors: isValid ? [] : [VALIDATION_MESSAGES.email],
    };
  }

  /**
   * Validate minimum length
   */
  static validateMinLength(value: string, minLength: number): ValidationResult {
    if (!value) return { isValid: true, errors: [] };

    const isValid = value.length >= minLength;
    return {
      isValid,
      errors: isValid ? [] : [VALIDATION_MESSAGES.minLength(minLength)],
    };
  }

  /**
   * Validate maximum length
   */
  static validateMaxLength(value: string, maxLength: number): ValidationResult {
    if (!value) return { isValid: true, errors: [] };

    const isValid = value.length <= maxLength;
    return {
      isValid,
      errors: isValid ? [] : [VALIDATION_MESSAGES.maxLength(maxLength)],
    };
  }

  /**
   * Validate minimum value
   */
  static validateMin(value: number, min: number): ValidationResult {
    if (value == null) return { isValid: true, errors: [] };

    const isValid = value >= min;
    return {
      isValid,
      errors: isValid ? [] : [VALIDATION_MESSAGES.min(min)],
    };
  }

  /**
   * Validate maximum value
   */
  static validateMax(value: number, max: number): ValidationResult {
    if (value == null) return { isValid: true, errors: [] };

    const isValid = value <= max;
    return {
      isValid,
      errors: isValid ? [] : [VALIDATION_MESSAGES.max(max)],
    };
  }

  /**
   * Validate pattern
   */
  static validatePattern(value: string, pattern: string | RegExp): ValidationResult {
    if (!value) return { isValid: true, errors: [] };

    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    const isValid = regex.test(value);
    return {
      isValid,
      errors: isValid ? [] : [VALIDATION_MESSAGES.pattern],
    };
  }

  /**
   * Validate file upload
   */
  static validateFiles(files: FileList, validation: FileValidation): ValidationResult {
    const result = FieldUtils.validateFiles(files, validation);
    return {
      isValid: result.valid,
      errors: result.error ? [result.error] : [],
    };
  }

  /**
   * Validate date
   */
  static validateDate(date: Date, validation: DateValidation): ValidationResult {
    const result = FieldUtils.validateDate(date, validation);
    return {
      isValid: result.valid,
      errors: result.error ? [result.error] : [],
    };
  }

  /**
   * Run all validations for a field
   */
  static validateField(field: FieldWithConfig): ValidationResult {
    const errors: string[] = [];
    const value = field.value.raw;
    const config = field.config;

    // Required validation
    if (config.required) {
      const result = this.validateRequired(value);
      if (!result.isValid) {
        errors.push(...result.errors);
        return { isValid: false, errors };
      }
    }

    // Skip other validations if value is empty and not required
    if (!value && !config.required) {
      return { isValid: true, errors: [] };
    }

    // Type-specific validations
    switch (field.type) {
      case 'email': {
        const result = this.validateEmail(value);
        if (!result.isValid) errors.push(...result.errors);
        break;
      }
      case 'number': {
        const validation = config.validation as NumberValidation;
        if (validation?.min !== undefined) {
          const result = this.validateMin(value, validation.min);
          if (!result.isValid) errors.push(...result.errors);
        }
        if (validation?.max !== undefined) {
          const result = this.validateMax(value, validation.max);
          if (!result.isValid) errors.push(...result.errors);
        }
        break;
      }
      case 'text':
      case 'textarea':
      case 'password': {
        const validation = config.validation as TextValidation;
        if (validation?.minLength) {
          const result = this.validateMinLength(value, validation.minLength);
          if (!result.isValid) errors.push(...result.errors);
        }
        if (validation?.maxLength) {
          const result = this.validateMaxLength(value, validation.maxLength);
          if (!result.isValid) errors.push(...result.errors);
        }
        if (validation?.pattern) {
          const result = this.validatePattern(value, validation.pattern);
          if (!result.isValid) errors.push(...result.errors);
        }
        break;
      }
      case 'file': {
        if (value instanceof FileList && this.isFileValidation(config.validation)) {
          const result = this.validateFiles(value, config.validation);
          if (!result.isValid) errors.push(...result.errors);
        }
        break;
      }
      case 'date': {
        if (value instanceof Date && this.isDateValidation(config.validation)) {
          const result = this.validateDate(value, config.validation);
          if (!result.isValid) errors.push(...result.errors);
        }
        break;
      }
    }

    // Custom validation
    const validation = config.validation as BaseValidation;
    if (validation?.custom) {
      const customError = validation.custom(value);
      if (customError) {
        errors.push(customError);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Type guard for FileValidation
   */
  private static isFileValidation(
    validation: ValidationTypes | undefined
  ): validation is FileValidation {
    if (!validation) return false;
    return (
      'maxFileSize' in validation ||
      'maxTotalSize' in validation ||
      'maxFiles' in validation ||
      'accept' in validation
    );
  }

  /**
   * Type guard for DateValidation
   */
  private static isDateValidation(
    validation: ValidationTypes | undefined
  ): validation is DateValidation {
    if (!validation) return false;
    return (
      ('min' in validation &&
        (typeof validation.min === 'string' || validation.min instanceof Date)) ||
      ('max' in validation &&
        (typeof validation.max === 'string' || validation.max instanceof Date))
    );
  }
}
