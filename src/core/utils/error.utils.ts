/**
 * @file Error utility functions and custom error classes
 */

import { CollectionUtils } from '@core/utils/collection.utils';

/**
 * Base error class for all custom errors
 */
export class SmartFormError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert error to JSON
   */
  toJSON(): Record<string, any> {
    return CollectionUtils.deepClone({
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      stack: this.stack,
    });
  }
}

/**
 * Validation error
 */
export class ValidationError extends SmartFormError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', details);
  }
}

/**
 * Field error
 */
export class FieldError extends SmartFormError {
  constructor(
    message: string,
    public readonly fieldName: string,
    details?: Record<string, any>
  ) {
    super(message, 'FIELD_ERROR', CollectionUtils.deepClone({ ...details, fieldName }));
  }
}

/**
 * Form error
 */
export class FormError extends SmartFormError {
  constructor(
    message: string,
    public readonly formId: string,
    details?: Record<string, any>
  ) {
    super(message, 'FORM_ERROR', CollectionUtils.deepClone({ ...details, formId }));
  }
}

/**
 * Configuration error
 */
export class ConfigurationError extends SmartFormError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'CONFIGURATION_ERROR', details);
  }
}

/**
 * Render error
 */
export class RenderError extends SmartFormError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'RENDER_ERROR', details);
  }
}

export class ErrorUtils {
  /**
   * Error codes and messages
   */
  private static readonly ERROR_MESSAGES = {
    FIELD_NOT_FOUND: 'Field not found: {fieldName}',
    FORM_NOT_FOUND: 'Form not found: {formId}',
    INVALID_FIELD_TYPE: 'Invalid field type: {type}',
    INVALID_FIELD_CONFIG: 'Invalid field configuration: {details}',
    INVALID_FORM_CONFIG: 'Invalid form configuration: {details}',
    DUPLICATE_FIELD: 'Field already exists: {fieldName}',
    VALIDATION_FAILED: 'Validation failed: {details}',
    RENDER_FAILED: 'Failed to render: {details}',
    REQUIRED_FIELD: 'Field is required: {fieldName}',
    INVALID_FORMAT: 'Invalid format: {details}',
    FILE_TOO_LARGE: 'File is too large: {fileName}',
    INVALID_FILE_TYPE: 'Invalid file type: {fileType}',
    MAX_FILES_EXCEEDED: 'Maximum number of files exceeded: {maxFiles}',
    INVALID_DATE: 'Invalid date: {value}',
    NETWORK_ERROR: 'Network error: {details}',
    UNKNOWN_ERROR: 'An unknown error occurred',
  } as const;

  /**
   * Format error message with parameters
   */
  static formatMessage(message: string, params: Record<string, any> = {}): string {
    const safeParams = CollectionUtils.mapValues(params, (value: unknown) => String(value ?? ''));
    return message.replace(/\{(\w+)\}/g, (_, key) => safeParams[key] ?? `{${key}}`);
  }

  /**
   * Create field error
   */
  static createFieldError(
    code: keyof typeof ErrorUtils.ERROR_MESSAGES,
    fieldName: string,
    details?: Record<string, any>
  ): FieldError {
    const params = CollectionUtils.deepClone({ ...details, fieldName });
    const message = this.formatMessage(this.ERROR_MESSAGES[code], params);
    return new FieldError(message, fieldName, params);
  }

  /**
   * Create form error
   */
  static createFormError(
    code: keyof typeof ErrorUtils.ERROR_MESSAGES,
    formId: string,
    details?: Record<string, any>
  ): FormError {
    const params = CollectionUtils.deepClone({ ...details, formId });
    const message = this.formatMessage(this.ERROR_MESSAGES[code], params);
    return new FormError(message, formId, params);
  }

  /**
   * Create validation error
   */
  static createValidationError(
    code: keyof typeof ErrorUtils.ERROR_MESSAGES,
    details?: Record<string, any>
  ): ValidationError {
    const params = CollectionUtils.deepClone(details || {});
    const message = this.formatMessage(this.ERROR_MESSAGES[code], params);
    return new ValidationError(message, params);
  }

  /**
   * Create configuration error
   */
  static createConfigurationError(
    code: keyof typeof ErrorUtils.ERROR_MESSAGES,
    details?: Record<string, any>
  ): ConfigurationError {
    const params = CollectionUtils.deepClone(details || {});
    const message = this.formatMessage(this.ERROR_MESSAGES[code], params);
    return new ConfigurationError(message, params);
  }

  /**
   * Create render error
   */
  static createRenderError(
    code: keyof typeof ErrorUtils.ERROR_MESSAGES,
    details?: Record<string, any>
  ): RenderError {
    const params = CollectionUtils.deepClone(details || {});
    const message = this.formatMessage(this.ERROR_MESSAGES[code], params);
    return new RenderError(message, params);
  }

  /**
   * Handle error and return appropriate error instance
   */
  static handleError(error: unknown): SmartFormError {
    if (error instanceof SmartFormError) {
      return error;
    }

    if (error instanceof Error) {
      return new SmartFormError(
        error.message,
        'UNKNOWN_ERROR',
        CollectionUtils.deepClone({ originalError: error })
      );
    }

    return new SmartFormError(
      this.ERROR_MESSAGES.UNKNOWN_ERROR,
      'UNKNOWN_ERROR',
      CollectionUtils.deepClone({ originalError: error })
    );
  }

  /**
   * Check if error is instance of specific error class
   */
  static isErrorType<T extends typeof SmartFormError>(
    error: unknown,
    ErrorClass: T
  ): error is InstanceType<T> {
    return error instanceof ErrorClass;
  }

  /**
   * Get error code
   */
  static getErrorCode(error: unknown): string {
    if (error instanceof SmartFormError) {
      return error.code;
    }
    return 'UNKNOWN_ERROR';
  }

  /**
   * Get error details
   */
  static getErrorDetails(error: unknown): Record<string, any> | undefined {
    if (error instanceof SmartFormError) {
      return error.details;
    }
    return undefined;
  }
}
