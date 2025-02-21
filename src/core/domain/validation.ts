/**
 * @file Core validation domain model
 */

import { Field } from "./field";
import { Form } from "./form";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export class Validation {
  /**
   * Validate a single field
   */
  static validateField(field: Field): ValidationResult {
    const errors: string[] = [];
    const value = field.value.raw;
    const config = field.config;

    // Required validation
    if (config.required && !value && value !== 0 && value !== false) {
      errors.push(config.validationMessage || "This field is required");
      return { isValid: false, errors };
    }

    // Skip other validations if field is empty and not required
    if (!value && value !== 0 && value !== false) {
      return { isValid: true, errors: [] };
    }

    // Pattern validation
    if (config.validation?.pattern) {
      const pattern = new RegExp(config.validation.pattern);
      if (!pattern.test(String(value))) {
        errors.push("Invalid format");
      }
    }

    // Length validation for strings
    if (typeof value === "string") {
      if (
        config.validation?.minLength &&
        value.length < config.validation.minLength
      ) {
        errors.push(`Minimum length is ${config.validation.minLength}`);
      }
      if (
        config.validation?.maxLength &&
        value.length > config.validation.maxLength
      ) {
        errors.push(`Maximum length is ${config.validation.maxLength}`);
      }
    }

    // Range validation for numbers
    if (typeof value === "number") {
      if (config.validation?.min && value < config.validation.min) {
        errors.push(`Minimum value is ${config.validation.min}`);
      }
      if (config.validation?.max && value > config.validation.max) {
        errors.push(`Maximum value is ${config.validation.max}`);
      }
    }

    // Custom validation
    if (config.validation?.custom) {
      const customError = config.validation.custom(value);
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
   * Validate entire form
   */
  static validateForm(form: Form): FormValidationResult {
    const errors: Record<string, string[]> = {};
    let isValid = true;

    form.fields.forEach((field) => {
      const result = this.validateField(field);
      if (!result.isValid) {
        errors[field.name] = result.errors;
        isValid = false;
      }
    });

    return {
      isValid,
      errors,
    };
  }

  /**
   * Create a custom validator function
   */
  static createValidator(
    validationFn: (value: any) => boolean,
    errorMessage: string
  ): (value: any) => string | null {
    return (value: any) => {
      return validationFn(value) ? null : errorMessage;
    };
  }

  /**
   * Common validators
   */
  static validators = {
    email: Validation.createValidator(
      (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Invalid email address"
    ),

    url: Validation.createValidator(
      (value: string) => /^https?:\/\/.*/.test(value),
      "Invalid URL"
    ),

    numeric: Validation.createValidator(
      (value: string) => /^\d+$/.test(value),
      "Must be numeric"
    ),

    alphanumeric: Validation.createValidator(
      (value: string) => /^[a-zA-Z0-9]+$/.test(value),
      "Must be alphanumeric"
    ),

    phone: Validation.createValidator(
      (value: string) => /^\+?[\d\s-]+$/.test(value),
      "Invalid phone number"
    ),
  };
}
