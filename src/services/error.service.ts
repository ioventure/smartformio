import { logger } from "./logger.service";
import {
  ErrorType,
  ErrorInfo,
  ErrorHandlerConfig,
  ErrorListener,
  ApiErrorResponse,
  RuntimeErrorDetails,
  ComponentErrorDetails,
  ValidationErrorDetails,
} from "@interfaces/error.interface";

/**
 * Singleton Error Handler Service for SmartFormIO
 */
export class ErrorHandlerService {
  private static instance: ErrorHandlerService;
  private errorListeners: Set<ErrorListener> = new Set();

  private config: ErrorHandlerConfig = {
    handleWindowErrors: true,
    handlePromiseRejections: true,
  };

  private constructor() {
    if (typeof window !== "undefined" && this.config.handleWindowErrors) {
      // Handle runtime errors
      window.addEventListener("error", (event) => {
        const details: RuntimeErrorDetails = {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
          context: { type: "window.error" },
        };

        this.handleRuntimeError(
          event.error || new Error(event.message),
          "WINDOW_ERROR",
          details
        );
      });

      // Handle unhandled promise rejections
      if (this.config.handlePromiseRejections) {
        window.addEventListener("unhandledrejection", (event) => {
          const details: RuntimeErrorDetails = {
            reason: event.reason,
            context: { type: "promise.rejection" },
          };

          this.handleRuntimeError(
            event.reason instanceof Error
              ? event.reason
              : new Error(String(event.reason)),
            "UNHANDLED_REJECTION",
            details
          );
        });
      }
    }
  }

  /**
   * Get the singleton instance of ErrorHandlerService
   */
  public static getInstance(): ErrorHandlerService {
    if (!ErrorHandlerService.instance) {
      ErrorHandlerService.instance = new ErrorHandlerService();
    }
    return ErrorHandlerService.instance;
  }

  /**
   * Configure the error handler
   */
  public configure(config: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Format error details into a structured format
   */
  private formatError(
    type: ErrorType,
    error: Error | string,
    code: string = "UNKNOWN_ERROR",
    details?: any
  ): ErrorInfo {
    // Use custom formatter if provided
    if (this.config.errorFormatter) {
      return this.config.errorFormatter(error, code);
    }

    const errorMessage = typeof error === "string" ? error : error.message;

    return {
      type,
      code,
      message: errorMessage,
      details: details || (error instanceof Error ? error.stack : undefined),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Format error and notify listeners
   */
  private formatAndNotify(
    type: ErrorType,
    error: Error | string,
    code: string,
    details?: any
  ): ErrorInfo {
    const formattedError = this.formatError(type, error, code, details);

    // Log error with appropriate level
    if (type === ErrorType.VALIDATION) {
      logger.warn(`Validation Error: ${formattedError.message}`);
    } else {
      logger.error(
        `${type.charAt(0).toUpperCase() + type.slice(1)} Error: ${formattedError.message}`,
        error instanceof Error ? error : undefined
      );
    }

    this.notifyListeners(formattedError);
    return formattedError;
  }

  /**
   * Handle API errors with structured response
   */
  public handleApiError(
    error: Error | string | ApiErrorResponse,
    code?: string,
    details?: any
  ): ErrorInfo {
    // Handle structured API error response
    if (typeof error === "object" && !("stack" in error) && "status" in error) {
      const apiError = error as ApiErrorResponse;
      return this.formatAndNotify(
        ErrorType.API,
        new Error(apiError.message),
        apiError.code || `HTTP_${apiError.status}`,
        apiError.details || details
      );
    }

    // Handle generic error
    return this.formatAndNotify(
      ErrorType.API,
      error instanceof Error ? error : new Error(String(error)),
      code || "API_ERROR",
      details
    );
  }

  /**
   * Handle validation errors with field information
   */
  public handleValidationError(
    error: Error | string,
    code?: string,
    details?: ValidationErrorDetails
  ): ErrorInfo {
    return this.formatAndNotify(
      ErrorType.VALIDATION,
      error,
      code || "VALIDATION_ERROR",
      details
    );
  }

  /**
   * Handle component errors with component context
   */
  public handleComponentError(
    error: Error | string,
    code?: string,
    details?: ComponentErrorDetails
  ): ErrorInfo {
    return this.formatAndNotify(
      ErrorType.COMPONENT,
      error,
      code || "COMPONENT_ERROR",
      details
    );
  }

  /**
   * Handle runtime errors with stack trace
   */
  public handleRuntimeError(
    error: Error | string,
    code?: string,
    details?: RuntimeErrorDetails
  ): ErrorInfo {
    return this.formatAndNotify(
      ErrorType.RUNTIME,
      error,
      code || "RUNTIME_ERROR",
      details
    );
  }

  /**
   * Add error listener
   */
  public addErrorListener(listener: ErrorListener): void {
    this.errorListeners.add(listener);
  }

  /**
   * Remove error listener
   */
  public removeErrorListener(listener: ErrorListener): void {
    this.errorListeners.delete(listener);
  }

  /**
   * Clear all error listeners
   */
  public clearListeners(): void {
    this.errorListeners.clear();
  }

  /**
   * Notify all error listeners
   */
  private notifyListeners(error: ErrorInfo): void {
    this.errorListeners.forEach((listener) => {
      try {
        listener(error);
      } catch (err) {
        logger.error(
          "Error in error listener",
          err instanceof Error ? err : new Error(String(err))
        );
      }
    });
  }
}

// Export singleton instance
export const errorHandler = ErrorHandlerService.getInstance();
