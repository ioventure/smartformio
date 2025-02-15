/**
 * @file Validation-related interfaces and types
 */

import { FormFieldSchema } from "./field.interface";

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  /** Whether the field is valid */
  isValid: boolean;
  /** Optional validation error message */
  message?: string;
}

/**
 * Type for validation handler functions
 */
export type ValidationHandler = (
  field: FormFieldSchema,
  value: any
) => ValidationResult;

/**
 * Interface for managing validation UI state
 */
export interface ValidationUIManager {
  /** Show error message and invalid state */
  showError: (message: string) => void;
  /** Hide error message and restore valid state */
  hideError: () => void;
}
