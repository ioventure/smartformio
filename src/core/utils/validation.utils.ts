/**
 * @file Validation utility functions
 */

import { VALIDATION_MESSAGES } from '@core/constants/component.constants';
import { Field, FieldConfig } from '@domain/field';
import { ValidationResult } from '@domain/validation';
import { FileValidation, DateValidation } from '@components/fields';
import { FieldUtils } from './field.utils';
import { CollectionUtils } from './collection.utils';

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

type ValidationFunction<T = any> = (value: T) => ValidationResult;

export class ValidationUtils {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private static readonly VALIDATION_MAP: Record<string, ValidationFunction> = {
    email: ValidationUtils.validateEmail,
    required: ValidationUtils.validateRequired,
  };

  /**
   * Create validation result
   */
  private static createResult(isValid: boolean, error?: string): ValidationResult {
    return {
      isValid,
      errors: error ? [error] : [],
    };
  }

  /**
   * Validate required field
   */
  static validateRequired(value: any): ValidationResult {
    const isValid = value != null && value !== '';
    return this.createResult(isValid, isValid ? undefined : VALIDATION_MESSAGES.required);
  }

  /**
   * Validate email format
   */
  static validateEmail(value: string): ValidationResult {
    if (!value) return this.createResult(true);

    const isValid = this.EMAIL_REGEX.test(value);
    return this.createResult(isValid, isValid ? undefined : VALIDATION_MESSAGES.email);
  }

  /**
   * Validate minimum length
   */
  static validateMinLength(value: string, minLength: number): ValidationResult {
    if (!value) return this.createResult(true);

    const isValid = value.length >= minLength;
    return this.createResult(
      isValid,
      isValid ? undefined : VALIDATION_MESSAGES.minLength(minLength)
    );
  }

  /**
   * Validate maximum length
   */
  static validateMaxLength(value: string, maxLength: number): ValidationResult {
    if (!value) return this.createResult(true);

    const isValid = value.length <= maxLength;
    return this.createResult(
      isValid,
      isValid ? undefined : VALIDATION_MESSAGES.maxLength(maxLength)
    );
  }

  /**
   * Validate minimum value
   */
  static validateMin(value: number, min: number): ValidationResult {
    if (value == null) return this.createResult(true);

    const isValid = value >= min;
    return this.createResult(isValid, isValid ? undefined : VALIDATION_MESSAGES.min(min));
  }

  /**
   * Validate maximum value
   */
  static validateMax(value: number, max: number): ValidationResult {
    if (value == null) return this.createResult(true);

    const isValid = value <= max;
    return this.createResult(isValid, isValid ? undefined : VALIDATION_MESSAGES.max(max));
  }

  /**
   * Validate pattern
   */
  static validatePattern(value: string, pattern: string | RegExp): ValidationResult {
    if (!value) return this.createResult(true);

    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    const isValid = regex.test(value);
    return this.createResult(isValid, isValid ? undefined : VALIDATION_MESSAGES.pattern);
  }

  /**
   * Validate file upload
   */
  static validateFiles(files: FileList, validation: FileValidation): ValidationResult {
    const result = FieldUtils.validateFiles(files, validation);
    return this.createResult(result.valid, result.error);
  }

  /**
   * Validate date
   */
  static validateDate(date: Date, validation: DateValidation): ValidationResult {
    const result = FieldUtils.validateDate(date, validation);
    return this.createResult(result.valid, result.error);
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
        return CollectionUtils.deepClone(result);
      }
    }

    // Skip other validations if value is empty and not required
    if (!value && !config.required) {
      return this.createResult(true);
    }

    // Type-specific validations
    const validationResults = this.getTypeValidations(field.type, value, config.validation);
    const failedValidations = validationResults.filter((result) => !result.isValid);

    if (failedValidations.length > 0) {
      return {
        isValid: false,
        errors: CollectionUtils.flatten(failedValidations.map((result) => result.errors)),
      };
    }

    // Custom validation
    const validation = config.validation as BaseValidation;
    if (validation?.custom) {
      const customError = validation.custom(value);
      if (customError) {
        return this.createResult(false, customError);
      }
    }

    return this.createResult(true);
  }

  /**
   * Get type-specific validations
   */
  private static getTypeValidations(
    type: string,
    value: any,
    validation: ValidationTypes | undefined
  ): ValidationResult[] {
    const results: ValidationResult[] = [];

    switch (type) {
      case 'email':
        results.push(this.validateEmail(value));
        break;

      case 'number':
        if (this.isNumberValidation(validation)) {
          if (validation.min !== undefined) {
            results.push(this.validateMin(value, validation.min));
          }
          if (validation.max !== undefined) {
            results.push(this.validateMax(value, validation.max));
          }
        }
        break;

      case 'text':
      case 'textarea':
      case 'password':
        if (this.isTextValidation(validation)) {
          if (validation.minLength) {
            results.push(this.validateMinLength(value, validation.minLength));
          }
          if (validation.maxLength) {
            results.push(this.validateMaxLength(value, validation.maxLength));
          }
          if (validation.pattern) {
            results.push(this.validatePattern(value, validation.pattern));
          }
        }
        break;

      case 'file':
        if (value instanceof FileList && this.isFileValidation(validation)) {
          results.push(this.validateFiles(value, validation));
        }
        break;

      case 'date':
        if (value instanceof Date && this.isDateValidation(validation)) {
          results.push(this.validateDate(value, validation));
        }
        break;
    }

    return results;
  }

  /**
   * Type guards
   */
  private static isTextValidation(
    validation: ValidationTypes | undefined
  ): validation is TextValidation {
    return (
      validation !== undefined &&
      ('minLength' in validation || 'maxLength' in validation || 'pattern' in validation)
    );
  }

  private static isNumberValidation(
    validation: ValidationTypes | undefined
  ): validation is NumberValidation {
    return validation !== undefined && ('min' in validation || 'max' in validation);
  }

  private static isFileValidation(
    validation: ValidationTypes | undefined
  ): validation is FileValidation {
    if (!validation) return false;
    return CollectionUtils.entries(validation).some(([key]) =>
      ['maxFileSize', 'maxTotalSize', 'maxFiles', 'accept'].includes(key)
    );
  }

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
