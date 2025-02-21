/**
 * @file Core validation domain model
 */

import { Field } from '@domain/field';
import { Form } from '@domain/form';
import { CollectionUtils } from '@core/utils/collection.utils';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Form validation result interface
 */
export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

/**
 * Base validator class
 */
export abstract class BaseValidator {
  /**
   * Validate a field
   */
  abstract validateField(field: Field): ValidationResult;

  /**
   * Validate a form
   */
  validateForm(form: Form): FormValidationResult {
    // Group validation results by field name
    const validationsByField = CollectionUtils.groupBy(
      form.fields.map((field) => ({
        name: field.name,
        result: this.validateField(field),
      })),
      'name'
    );

    // Create errors object with proper typing
    const errors: Record<string, string[]> = {};

    // Process validation results
    CollectionUtils.entries(validationsByField).forEach(([name, items]) => {
      const fieldErrors = items[0]?.result.errors;
      if (fieldErrors && fieldErrors.length > 0) {
        errors[name] = fieldErrors;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Create a validation result
   */
  protected createResult(isValid: boolean, errors: string[] = []): ValidationResult {
    return CollectionUtils.deepClone({ isValid, errors });
  }

  /**
   * Create a form validation result
   */
  protected createFormResult(
    isValid: boolean,
    errors: Record<string, string[]> = {}
  ): FormValidationResult {
    return { isValid, errors };
  }
}

/**
 * Default validator implementation
 */
export class DefaultValidator extends BaseValidator {
  validateField(field: Field): ValidationResult {
    const errors: string[] = [];
    const safeField = CollectionUtils.deepClone(field);
    const safeValue = safeField.value.raw;

    // Required validation
    if (safeField.config.required && !safeValue) {
      errors.push(safeField.config.validationMessage || 'This field is required');
    }

    // Pattern validation
    if (safeField.config.validation?.pattern && safeValue) {
      const pattern = new RegExp(safeField.config.validation.pattern);
      if (!pattern.test(String(safeValue))) {
        errors.push('Invalid format');
      }
    }

    // Length validation
    if (typeof safeValue === 'string') {
      const validation = CollectionUtils.deepClone(safeField.config.validation || {});

      if (validation.minLength !== undefined && safeValue.length < validation.minLength) {
        errors.push(`Minimum length is ${validation.minLength} characters`);
      }

      if (validation.maxLength !== undefined && safeValue.length > validation.maxLength) {
        errors.push(`Maximum length is ${validation.maxLength} characters`);
      }
    }

    // Number range validation
    if (typeof safeValue === 'number') {
      const validation = CollectionUtils.deepClone(safeField.config.validation || {});

      if (validation.min !== undefined && safeValue < validation.min) {
        errors.push(`Minimum value is ${validation.min}`);
      }

      if (validation.max !== undefined && safeValue > validation.max) {
        errors.push(`Maximum value is ${validation.max}`);
      }
    }

    // Custom validation
    if (safeField.config.validation?.custom) {
      const customError = safeField.config.validation.custom(safeValue);
      if (customError) {
        errors.push(customError);
      }
    }

    return this.createResult(errors.length === 0, CollectionUtils.unique(errors));
  }
}
