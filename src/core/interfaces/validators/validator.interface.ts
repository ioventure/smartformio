/**
 * @file Validator interface definitions
 */

import { Field } from '@domain/field';
import { Form } from '@domain/form';
import { ValidationResult, FormValidationResult } from '@domain/validation';

/**
 * Field validator interface
 */
export interface IFieldValidator {
  /**
   * Validate a field
   */
  validateField(field: Field): ValidationResult;

  /**
   * Add a validation rule
   */
  addRule(rule: ValidationRule): void;

  /**
   * Remove a validation rule
   */
  removeRule(rule: ValidationRule): void;

  /**
   * Clear all validation rules
   */
  clearRules(): void;
}

/**
 * Form validator interface
 */
export interface IFormValidator {
  /**
   * Validate a form
   */
  validateForm(form: Form): FormValidationResult;

  /**
   * Validate a specific field in a form
   */
  validateField(form: Form, fieldName: string): ValidationResult;

  /**
   * Add a field validator
   */
  addFieldValidator(fieldName: string, validator: IFieldValidator): void;

  /**
   * Remove a field validator
   */
  removeFieldValidator(fieldName: string): void;

  /**
   * Clear all field validators
   */
  clearFieldValidators(): void;
}

/**
 * Validation rule interface
 */
export interface ValidationRule {
  /**
   * Validate a field value
   */
  validate(value: any): ValidationResult;
}

/**
 * Built-in validation rules
 */
export const ValidationRules = {
  required: (): ValidationRule => ({
    validate: (value: any): ValidationResult => ({
      isValid: value != null && value !== '',
      errors: ['This field is required'],
    }),
  }),

  minLength: (min: number): ValidationRule => ({
    validate: (value: string): ValidationResult => ({
      isValid: !value || value.length >= min,
      errors: [`Minimum length is ${min} characters`],
    }),
  }),

  maxLength: (max: number): ValidationRule => ({
    validate: (value: string): ValidationResult => ({
      isValid: !value || value.length <= max,
      errors: [`Maximum length is ${max} characters`],
    }),
  }),

  pattern: (regex: RegExp, message?: string): ValidationRule => ({
    validate: (value: string): ValidationResult => ({
      isValid: !value || regex.test(value),
      errors: [message || 'Invalid format'],
    }),
  }),

  email: (): ValidationRule => ({
    validate: (value: string): ValidationResult => ({
      isValid: !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      errors: ['Invalid email address'],
    }),
  }),

  min: (min: number): ValidationRule => ({
    validate: (value: number): ValidationResult => ({
      isValid: !value || value >= min,
      errors: [`Minimum value is ${min}`],
    }),
  }),

  max: (max: number): ValidationRule => ({
    validate: (value: number): ValidationResult => ({
      isValid: !value || value <= max,
      errors: [`Maximum value is ${max}`],
    }),
  }),
};
