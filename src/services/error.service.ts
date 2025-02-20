import { logger } from "./logger.service";
import {
  ErrorType,
  IErrorInfo,
  IErrorHandlerConfig,
  IErrorListener,
  IApiErrorResponse,
  IRuntimeErrorDetails,
  IComponentErrorDetails,
  IValidationErrorDetails,
} from "@interfaces/error.interface";

/**
 * Singleton Error Handler Service for SmartFormIO
 */
export class ErrorHandlerService {
  private static instance: ErrorHandlerService;
  private static readonly LOG_CONTEXT = "ErrorHandler";
  private errorListeners: Map<string, IErrorListener> = new Map();
  private rateLimiter: Map<string, number> = new Map();

  private config: IErrorHandlerConfig = {
    handleWindowErrors: true,
    handlePromiseRejections: true,
    maxRetries: 3,
    retryDelay: 1000,
    rateLimitWindow: 5000,
    maxErrorsPerWindow: 10,
  };

  private constructor() {
    if (typeof window !== "undefined") {
      this.setupGlobalErrorHandlers();
    }
  }

  private setupGlobalErrorHandlers(): void {
    if (this.config.handleWindowErrors) {
      window.addEventListener("error", this.handleWindowError.bind(this));
    }

    if (this.config.handlePromiseRejections) {
      window.addEventListener(
        "unhandledrejection",
        this.handlePromiseRejection.bind(this)
      );
    }
  }

  private handleWindowError(event: ErrorEvent): void {
    const details: IRuntimeErrorDetails = {
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
  }

  private handlePromiseRejection(event: PromiseRejectionEvent): void {
    const details: IRuntimeErrorDetails = {
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
  }

  public static getInstance(): ErrorHandlerService {
    if (!ErrorHandlerService.instance) {
      ErrorHandlerService.instance = new ErrorHandlerService();
    }
    return ErrorHandlerService.instance;
  }

  public configure(config: Partial<IErrorHandlerConfig>): void {
    this.config = { ...this.config, ...config };
    this.validateConfig();
  }

  private validateConfig(): void {
    if (this.config.maxRetries && this.config.maxRetries < 0) {
      this.config.maxRetries = 0;
    }
    if (this.config.retryDelay && this.config.retryDelay < 0) {
      this.config.retryDelay = 1000;
    }
  }

  private isRateLimited(type: ErrorType): boolean {
    const now = Date.now();
    const window = this.config.rateLimitWindow || 5000;
    const maxErrors = this.config.maxErrorsPerWindow || 10;
    const key = `${type}_${Math.floor(now / window)}`;
    const count = this.rateLimiter.get(key) || 0;

    if (count >= maxErrors) {
      return true;
    }

    this.rateLimiter.set(key, count + 1);
    this.cleanupOldEntries(type, now, window);
    return false;
  }

  private cleanupOldEntries(
    type: ErrorType,
    now: number,
    window: number
  ): void {
    for (const [existingKey] of this.rateLimiter) {
      if (!existingKey.startsWith(`${type}_${Math.floor(now / window)}`)) {
        this.rateLimiter.delete(existingKey);
      }
    }
  }

  private formatError(
    type: ErrorType,
    error: Error | string,
    code: string = "UNKNOWN_ERROR",
    details?: any
  ): IErrorInfo {
    if (this.config.errorFormatter) {
      return this.config.errorFormatter(error, code);
    }

    const errorMessage = typeof error === "string" ? error : error.message;
    const errorStack = error instanceof Error ? error.stack : undefined;

    return {
      type,
      code,
      message: errorMessage,
      details: details || errorStack,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      recoverable: true,
    };
  }

  private async formatAndNotify(
    type: ErrorType,
    error: Error | string,
    code: string,
    details?: any
  ): Promise<IErrorInfo> {
    if (this.isRateLimited(type)) {
      logger.warn(
        `Error rate limit exceeded for type: ${type}`,
        ErrorHandlerService.LOG_CONTEXT
      );
      return this.formatError(
        type,
        "Rate limit exceeded",
        "RATE_LIMIT_EXCEEDED"
      );
    }

    const formattedError = this.formatError(type, error, code, details);

    try {
      this.logError(type, formattedError, error);
      await this.notifyListeners(formattedError);
      return formattedError;
    } catch (notifyError) {
      logger.error(
        "Error in error notification",
        notifyError instanceof Error
          ? notifyError
          : new Error(String(notifyError)),
        ErrorHandlerService.LOG_CONTEXT
      );
      return formattedError;
    }
  }

  private logError(
    type: ErrorType,
    formattedError: IErrorInfo,
    error: Error | string
  ): void {
    if (type === ErrorType.VALIDATION) {
      logger.warn(
        `Validation Error: ${formattedError.message}`,
        ErrorHandlerService.LOG_CONTEXT
      );
    } else {
      logger.error(
        `${type.charAt(0).toUpperCase() + type.slice(1)} Error: ${formattedError.message}`,
        error instanceof Error ? error : new Error(String(error)),
        ErrorHandlerService.LOG_CONTEXT
      );
    }
  }

  public async handleApiError(
    error: Error | string | IApiErrorResponse,
    code?: string,
    details?: any,
    retryCount: number = 0
  ): Promise<IErrorInfo> {
    // Handle API error response
    if (typeof error === "object" && !("stack" in error) && "status" in error) {
      const apiError = error as IApiErrorResponse;
      const errorInfo = await this.formatAndNotify(
        ErrorType.API,
        new Error(apiError.message),
        apiError.code || code || `HTTP_${apiError.status}`,
        {
          ...apiError.details,
          ...details,
          retryable: apiError.retryable,
          retryCount,
        }
      );

      // Implement retry mechanism for retryable errors
      if (
        apiError.retryable !== false &&
        this.config.maxRetries &&
        retryCount < this.config.maxRetries &&
        this.isRetryableError(errorInfo)
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.config.retryDelay || 1000)
        );
        return this.handleApiError(error, code, details, retryCount + 1);
      }

      return errorInfo;
    }

    // Handle generic error
    const errorInfo = await this.formatAndNotify(
      ErrorType.API,
      error instanceof Error ? error : new Error(String(error)),
      code || "API_ERROR",
      { ...details, retryCount }
    );

    // Implement retry mechanism for generic errors
    if (
      this.config.maxRetries &&
      retryCount < this.config.maxRetries &&
      this.isRetryableError(errorInfo)
    ) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.config.retryDelay || 1000)
      );
      return this.handleApiError(error, code, details, retryCount + 1);
    }

    return errorInfo;
  }

  private isRetryableError(error: IErrorInfo): boolean {
    const retryableCodes = ["NETWORK_ERROR", "TIMEOUT", "SERVER_ERROR"];
    return (error.recoverable ?? true) && retryableCodes.includes(error.code);
  }

  public async handleValidationError(
    error: Error | string,
    code?: string,
    details?: IValidationErrorDetails
  ): Promise<IErrorInfo> {
    return this.formatAndNotify(
      ErrorType.VALIDATION,
      error,
      code || "VALIDATION_ERROR",
      details
    );
  }

  public async handleComponentError(
    error: Error | string,
    code?: string,
    details?: IComponentErrorDetails
  ): Promise<IErrorInfo> {
    return this.formatAndNotify(
      ErrorType.COMPONENT,
      error,
      code || "COMPONENT_ERROR",
      details
    );
  }

  public async handleRuntimeError(
    error: Error | string,
    code?: string,
    details?: IRuntimeErrorDetails
  ): Promise<IErrorInfo> {
    return this.formatAndNotify(
      ErrorType.RUNTIME,
      error,
      code || "RUNTIME_ERROR",
      details
    );
  }

  public addErrorListener(id: string, listener: IErrorListener): void {
    this.errorListeners.set(id, listener);
  }

  public removeErrorListener(id: string): void {
    this.errorListeners.delete(id);
  }

  public clearListeners(): void {
    this.errorListeners.clear();
  }

  private async notifyListeners(error: IErrorInfo): Promise<void> {
    const notificationPromises = Array.from(this.errorListeners.entries()).map(
      async ([id, listener]) => {
        try {
          await listener(error);
        } catch (listenerError) {
          logger.error(
            `Error in listener ${id}`,
            listenerError instanceof Error
              ? listenerError
              : new Error(String(listenerError)),
            ErrorHandlerService.LOG_CONTEXT
          );
          // Remove failed listener to prevent future errors
          this.errorListeners.delete(id);
        }
      }
    );

    await Promise.all(notificationPromises);
  }
}

// Export singleton instance
export const errorHandler = ErrorHandlerService.getInstance();
