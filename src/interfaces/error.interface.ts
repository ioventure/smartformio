import { LogLevel } from "@services/logger.service";

/**
 * Error types for different scenarios
 */
export enum ErrorType {
  VALIDATION = "validation",
  API = "api",
  COMPONENT = "component",
  RUNTIME = "runtime",
}

/**
 * Runtime error details interface
 */
export interface IRuntimeErrorDetails {
  stack?: string;
  context?: any;
  filename?: string;
  lineno?: number;
  colno?: number;
  reason?: any;
}

/**
 * Component error details interface
 */
export interface IComponentErrorDetails {
  method?: string;
  component?: string;
  props?: Record<string, any>;
  attribute?: string;
  schema?: string;
  instanceId?: string; // Added for tracking individual component instances
}

/**
 * Validation error details interface
 */
export interface IValidationErrorDetails {
  field?: string;
  value?: any;
  constraints?: Record<string, string>;
}

/**
 * API Error response interface
 */
export interface IApiErrorResponse {
  message: string;
  code: string;
  details?: any;
  status?: number;
  retryable?: boolean;
}

/**
 * Retry configuration for error handling
 */
export interface IRetryConfig {
  /** Current retry attempt number */
  retryCount: number;
  /** Maximum number of retry attempts */
  maxRetries: number;
  /** Delay between retries in milliseconds */
  retryDelay: number;
}

/**
 * Interface for structured error information
 */
export interface IErrorInfo {
  type: ErrorType;
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  retryCount?: number;
  recoverable?: boolean;
}

/**
 * Logger configuration interface
 */
export interface ILoggerConfig {
  level: LogLevel;
  context?: string;
  enabled?: boolean;
}

/**
 * Error handler configuration interface
 */
export interface IErrorHandlerConfig {
  /** Whether to automatically handle window errors */
  handleWindowErrors?: boolean;
  /** Whether to automatically handle unhandled promise rejections */
  handlePromiseRejections?: boolean;
  /** Custom error formatter function */
  errorFormatter?: (error: Error | string, code?: string) => IErrorInfo;
  /** Maximum number of retry attempts for recoverable errors */
  maxRetries?: number;
  /** Delay between retry attempts in milliseconds */
  retryDelay?: number;
  /** Rate limiting window in milliseconds */
  rateLimitWindow?: number;
  /** Maximum errors allowed in rate limit window */
  maxErrorsPerWindow?: number;
}

/**
 * Error listener function type
 */
export type IErrorListener = (error: IErrorInfo) => void;
