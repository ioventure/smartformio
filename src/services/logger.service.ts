/**
 * Logger levels for different types of logs
 */
export enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  DEBUG = "debug",
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
 * Singleton Logger Service for SmartFormIO
 * Handles logging in both static and SSR environments
 */
export class LoggerService {
  private static instance: LoggerService;
  private context: string = "SmartFormIO";
  private enabled: boolean = true;
  private level: LogLevel = LogLevel.INFO;

  private constructor() {
    // Private constructor to enforce singleton pattern
    if (typeof window !== "undefined") {
      this.context =
        window?.document?.currentScript?.getAttribute("data-logger-context") ||
        this.context;
    }
  }

  /**
   * Get the singleton instance of LoggerService
   */
  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  /**
   * Configure the logger
   */
  public configure(config: LoggerConfig): void {
    this.level = config.level;
    if (config.context) this.context = config.context;
    if (typeof config.enabled !== "undefined") this.enabled = config.enabled;
  }

  /**
   * Format log message with context and timestamp
   */
  private formatMessage(
    message: string,
    level: LogLevel,
    context?: string,
    error?: Error
  ): string {
    const timestamp = new Date().toISOString();
    const ctx = context ? `${this.context}:${context}` : this.context;
    let formattedMessage = `[${timestamp}] [${ctx}] [${level.toUpperCase()}]: ${message}`;

    if (error) {
      formattedMessage += `\nError: ${error.message}\nStack: ${error.stack}`;
    }

    return formattedMessage;
  }

  /**
   * Check if the log level should be processed
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false;

    const levels = Object.values(LogLevel);
    const currentLevelIndex = levels.indexOf(this.level);
    const targetLevelIndex = levels.indexOf(level);

    return targetLevelIndex >= currentLevelIndex;
  }

  /**
   * Log information message
   */
  public info(message: string, context?: string): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    console.info(this.formatMessage(message, LogLevel.INFO, context));
  }

  /**
   * Log warning message
   */
  public warn(message: string, context?: string): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    console.warn(this.formatMessage(message, LogLevel.WARN, context));
  }

  /**
   * Log error message
   */
  public error(message: string, error?: Error, context?: string): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    console.error(this.formatMessage(message, LogLevel.ERROR, context, error));
  }

  /**
   * Log debug message
   */
  public debug(message: string, context?: string): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    console.debug(this.formatMessage(message, LogLevel.DEBUG, context));
  }
}

// Export singleton instance
export const logger = LoggerService.getInstance();
