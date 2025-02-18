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
export interface RuntimeErrorDetails {
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
export interface ComponentErrorDetails {
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
export interface ValidationErrorDetails {
  field?: string;
  value?: any;
  constraints?: Record<string, string>;
}

/**
 * API Error response interface
 */
export interface ApiErrorResponse {
  message: string;
  code: string;
  details?: any;
  status?: number;
}

/**
 * Interface for structured error information
 */
export interface ErrorInfo {
  type: ErrorType;
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

/**
 * Logger configuration interface
 */
export interface LoggerConfig {
  level: LogLevel;
  context?: string;
  enabled?: boolean;
}

/**
 * Error handler configuration interface
 */
export interface ErrorHandlerConfig {
  /** Whether to automatically handle window errors */
  handleWindowErrors?: boolean;
  /** Whether to automatically handle unhandled promise rejections */
  handlePromiseRejections?: boolean;
  /** Custom error formatter function */
  errorFormatter?: (error: Error | string, code?: string) => ErrorInfo;
}

/**
 * Error listener function type
 */
export type ErrorListener = (error: ErrorInfo) => void;
