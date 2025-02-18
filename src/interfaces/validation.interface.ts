/**
 * @file Validation-related interfaces and types
 */

import { IFormFieldSchema } from "./field.interface";

/**
 * Result of a validation operation
 */
export interface IValidationResult {
  /** Whether the field is valid */
  isValid: boolean;
  /** Optional validation error message */
  message?: string;
}

/**
 * Type for validation handler functions
 */
export type IValidationHandler = (
  field: IFormFieldSchema,
  value: unknown
) => IValidationResult;

/**
 * Interface for managing validation UI state
 */
export interface IValidationUIManager {
  /** Show error message and invalid state */
  showError: (message: string) => void;
  /** Hide error message and restore valid state */
  hideError: () => void;
}
