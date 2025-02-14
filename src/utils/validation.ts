import {
  FormSchema,
  FormFieldSchema,
  TextField,
  DateField,
} from "../interfaces/form.interface";

/**
 * Result of a validation check.
 */
export interface ValidationResult {
  /** Whether the field value is valid */
  isValid: boolean;
  /** Validation error message if invalid */
  message?: string;
}

/**
 * Default patterns for common validations.
 * These are used only if the field doesn't provide its own pattern.
 */
const DEFAULT_PATTERNS = {
  /** Default email validation pattern */
  email: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
};

/**
 * Validates text-based input fields including email, number, and pattern-based validation.
 * Uses field-provided patterns when available, falling back to defaults for standard types.
 *
 * @param field - The field configuration
 * @param value - The current field value
 * @returns Validation result with status and optional error message
 */
function validateTextField(field: TextField, value: string): ValidationResult {
  if (!field) {
    return { isValid: false, message: "Field configuration is missing." };
  }

  try {
    // Skip validation if field is empty and not required
    if (!value && !field.required) {
      return { isValid: true };
    }

    // Email validation using pattern from field or default
    if (field.type === "email") {
      const emailPattern = field.pattern || DEFAULT_PATTERNS.email;
      const regex = new RegExp(emailPattern);
      if (!regex.test(value)) {
        return { isValid: false, message: field.validationMessage };
      }
    }

    // Number validation
    if (field.type === "number") {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return { isValid: false, message: field.validationMessage };
      }

      if (field.min !== undefined && numValue < field.min) {
        return { isValid: false, message: field.validationMessage };
      }

      if (field.max !== undefined && numValue > field.max) {
        return { isValid: false, message: field.validationMessage };
      }
    }

    // Custom pattern validation
    if (field.pattern && field.type !== "email") {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        return { isValid: false, message: field.validationMessage };
      }
    }

    // Length validations
    if (field.minLength && value.length < field.minLength) {
      return { isValid: false, message: field.validationMessage };
    }

    if (field.maxLength && value.length > field.maxLength) {
      return { isValid: false, message: field.validationMessage };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Text field validation error:", error);
    return { isValid: false, message: "An error occurred during validation" };
  }
}

/**
 * Validates date fields checking for min/max date constraints.
 *
 * @param field - The date field configuration
 * @param value - The current field value
 * @returns Validation result with status and optional error message
 */
function validateDateField(field: DateField, value: string): ValidationResult {
  if (!field) {
    return { isValid: false, message: "Field configuration is missing." };
  }

  try {
    if (!value) return { isValid: true };

    const dateValue = new Date(value);

    if (field.min && dateValue < new Date(field.min)) {
      return { isValid: false, message: field.validationMessage };
    }

    if (field.max && dateValue > new Date(field.max)) {
      return { isValid: false, message: field.validationMessage };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Date field validation error:", error);
    return { isValid: false, message: "Invalid date format" };
  }
}

/**
 * Main validation function that handles all field types.
 * Performs required field validation first, then delegates to type-specific validators.
 *
 * @param field - The field configuration
 * @param value - The current field value
 * @returns Validation result with status and optional error message
 */
export function validateField(
  field: FormFieldSchema,
  value: any
): ValidationResult {
  if (!field) {
    return { isValid: false, message: "Field configuration is missing." };
  }

  try {
    // Required field validation
    if (field.required && (!value || value.toString().trim() === "")) {
      return { isValid: false, message: field.validationMessage };
    }

    // Type-specific validations
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
      case "textarea":
        return validateTextField(field, value);
      case "date":
        return validateDateField(field, value);
      default:
        return { isValid: true };
    }
  } catch (error) {
    console.error("Field validation error:", error);
    return { isValid: false, message: "An error occurred during validation" };
  }
}

/**
 * Validates an entire form against its schema.
 * Returns validation results for all fields.
 *
 * @param schema - The form schema containing field definitions
 * @param formData - The current form data
 * @returns Object mapping field names to validation results
 */
export function validateForm(
  schema: FormSchema,
  formData: Record<string, any>
): Record<string, ValidationResult> {
  try {
    const validationResults: Record<string, ValidationResult> = {};

    schema.fields.forEach((field) => {
      validationResults[field.name] = validateField(
        field,
        formData[field.name]
      );
    });

    return validationResults;
  } catch (error) {
    console.error("Form validation error:", error);
    return {};
  }
}
