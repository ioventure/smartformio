/**
 * @file Core validation domain model
 */

import { Field } from '@domain/field';
import { Form } from '@domain/form';

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
    const errors: Record<string, string[]> = {};
    let isValid = true;

    form.fields.forEach((field) => {
      const result = this.validateField(field);
      if (!result.isValid) {
        errors[field.name] = result.errors;
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  /**
   * Create a validation result
   */
  protected createResult(isValid: boolean, errors: string[] = []): ValidationResult {
    return { isValid, errors };
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

    // Required validation
    if (field.config.required && !field.value.raw) {
      errors.push(field.config.validationMessage || 'This field is required');
    }

    // Pattern validation
    if (field.config.validation?.pattern && field.value.raw) {
      const pattern = new RegExp(field.config.validation.pattern);
      if (!pattern.test(String(field.value.raw))) {
        errors.push('Invalid format');
      }
    }

    // Length validation
    if (typeof field.value.raw === 'string') {
      const { minLength, maxLength } = field.config.validation || {};

      if (minLength !== undefined && field.value.raw.length < minLength) {
        errors.push(`Minimum length is ${minLength} characters`);
      }

      if (maxLength !== undefined && field.value.raw.length > maxLength) {
        errors.push(`Maximum length is ${maxLength} characters`);
      }
    }

    // Number range validation
    if (typeof field.value.raw === 'number') {
      const { min, max } = field.config.validation || {};

      if (min !== undefined && field.value.raw < min) {
        errors.push(`Minimum value is ${min}`);
      }

      if (max !== undefined && field.value.raw > max) {
        errors.push(`Maximum value is ${max}`);
      }
    }

    // Custom validation
    if (field.config.validation?.custom) {
      const customError = field.config.validation.custom(field.value.raw);
      if (customError) {
        errors.push(customError);
      }
    }

    return this.createResult(errors.length === 0, errors);
  }
}
