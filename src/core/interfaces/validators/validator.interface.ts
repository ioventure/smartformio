/**
 * @file Validator interface definitions
 */

import { Field } from '@domain/field';
import { Form } from '@domain/form';
import { ValidationResult, FormValidationResult } from '@domain/validation';
import { CollectionUtils } from '@core/utils/collection.utils';

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
    validate: (value: any): ValidationResult => {
      const safeValue = CollectionUtils.deepClone(value);
      return CollectionUtils.deepClone({
        isValid: safeValue != null && safeValue !== '',
        errors: CollectionUtils.unique(['This field is required']),
      });
    },
  }),

  minLength: (min: number): ValidationRule => ({
    validate: (value: string): ValidationResult => {
      const safeValue = CollectionUtils.deepClone(value);
      return CollectionUtils.deepClone({
        isValid: !safeValue || safeValue.length >= min,
        errors: CollectionUtils.unique([`Minimum length is ${min} characters`]),
      });
    },
  }),

  maxLength: (max: number): ValidationRule => ({
    validate: (value: string): ValidationResult => {
      const safeValue = CollectionUtils.deepClone(value);
      return CollectionUtils.deepClone({
        isValid: !safeValue || safeValue.length <= max,
        errors: CollectionUtils.unique([`Maximum length is ${max} characters`]),
      });
    },
  }),

  pattern: (regex: RegExp, message?: string): ValidationRule => ({
    validate: (value: string): ValidationResult => {
      const safeValue = CollectionUtils.deepClone(value);
      return CollectionUtils.deepClone({
        isValid: !safeValue || regex.test(safeValue),
        errors: CollectionUtils.unique([message || 'Invalid format']),
      });
    },
  }),

  email: (): ValidationRule => ({
    validate: (value: string): ValidationResult => {
      const safeValue = CollectionUtils.deepClone(value);
      return CollectionUtils.deepClone({
        isValid: !safeValue || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeValue),
        errors: CollectionUtils.unique(['Invalid email address']),
      });
    },
  }),

  min: (min: number): ValidationRule => ({
    validate: (value: number): ValidationResult => {
      const safeValue = CollectionUtils.deepClone(value);
      return CollectionUtils.deepClone({
        isValid: !safeValue || safeValue >= min,
        errors: CollectionUtils.unique([`Minimum value is ${min}`]),
      });
    },
  }),

  max: (max: number): ValidationRule => ({
    validate: (value: number): ValidationResult => {
      const safeValue = CollectionUtils.deepClone(value);
      return CollectionUtils.deepClone({
        isValid: !safeValue || safeValue <= max,
        errors: CollectionUtils.unique([`Maximum value is ${max}`]),
      });
    },
  }),
};
