/**
 * Logger levels for different types of logs
 * Ordered from most verbose to least verbose
 */
export enum LogLevel {
  DEBUG = "debug", // Most verbose (4)
  INFO = "info", // (3)
  WARN = "warn", // (2)
  ERROR = "error", // Least verbose (1)
}

/**
 * Logger configuration interface
 */
export interface LoggerConfig {
  level: LogLevel | string; // Allow string for configuration
  context: string;
  enabled: boolean;
}

/**
 * Singleton Logger Service for SmartFormIO
 * Handles logging in both static and SSR environments
 */
export class LoggerService {
  private static instance: LoggerService;
  private static readonly LOG_CONTEXT = "LoggerService";

  private static defaultConfig: LoggerConfig = {
    level: LogLevel.INFO,
    context: "SmartFormIO",
    enabled: true,
  };

  // Level value mapping
  private static readonly LEVEL_VALUES: Record<LogLevel, number> = {
    [LogLevel.DEBUG]: 4, // Show all logs
    [LogLevel.INFO]: 3, // Show info, warn, error
    [LogLevel.WARN]: 2, // Show warn, error
    [LogLevel.ERROR]: 1, // Show only errors
  };

  private context: string;
  private enabled: boolean;
  private level: LogLevel;

  private constructor() {
    this.enabled = false;
    this.level = LoggerService.defaultConfig.level as LogLevel;
    this.context = LoggerService.defaultConfig.context;
  }

  /**
   * Get or initialize the singleton instance of LoggerService
   * @param config Optional configuration to initialize the logger with
   */
  public static getInstance(config?: Partial<LoggerConfig>): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
      if (config) {
        LoggerService.instance.configure(config);
      }
    }
    return LoggerService.instance;
  }

  /**
   * Convert string level to LogLevel enum
   * @private
   */
  private parseLogLevel(level: string | LogLevel): LogLevel {
    if (typeof level === "string") {
      const normalizedLevel = level.toLowerCase();
      switch (normalizedLevel) {
        case "debug":
          return LogLevel.DEBUG;
        case "info":
          return LogLevel.INFO;
        case "warn":
          return LogLevel.WARN;
        case "error":
          return LogLevel.ERROR;
        default:
          console.warn(
            `[${LoggerService.LOG_CONTEXT}] Invalid log level: ${level}, defaulting to INFO`
          );
          return LogLevel.INFO;
      }
    }
    return level;
  }

  /**
   * Configure the logger with new settings
   * @param config Partial configuration to update
   */
  public configure(config: Partial<LoggerConfig>): void {
    if (!config) return;

    // Update level if provided
    if (config.level !== undefined) {
      const newLevel = this.parseLogLevel(config.level);
      this.level = newLevel;
    }

    // Update context if valid string
    if (config.context !== undefined) {
      const trimmedContext = config.context.trim();
      if (trimmedContext) {
        this.context = trimmedContext;
      }
    }

    // Update enabled if boolean
    if (typeof config.enabled === "boolean") {
      this.enabled = config.enabled;
    }
  }

  /**
   * Get current logger configuration
   */
  public getConfig(): LoggerConfig {
    return {
      level: this.level,
      context: this.context,
      enabled: this.enabled,
    };
  }

  /**
   * Format log message with context and timestamp
   * @private
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
   * @private
   */
  private shouldLog(messageLevel: LogLevel): boolean {
    if (!this.enabled) return false;

    const configuredValue = LoggerService.LEVEL_VALUES[this.level];
    const messageValue = LoggerService.LEVEL_VALUES[messageLevel];

    // Message should be logged if its value is less than or equal to the configured level value
    // Example: If level is DEBUG (4), show all messages (1-4)
    //         If level is INFO (3), show messages with values 1-3 (ERROR, WARN, INFO)
    return messageValue <= configuredValue;
  }

  /**
   * Log debug message
   */
  public debug(message: string, context?: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage(message, LogLevel.DEBUG, context));
    }
  }

  /**
   * Log information message
   */
  public info(message: string, context?: string): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(message, LogLevel.INFO, context));
    }
  }

  /**
   * Log warning message
   */
  public warn(message: string, context?: string): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(message, LogLevel.WARN, context));
    }
  }

  /**
   * Log error message
   */
  public error(message: string, error?: Error, context?: string): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(
        this.formatMessage(message, LogLevel.ERROR, context, error)
      );
    }
  }
}

// Export logger interface with lazy initialization
let instance: LoggerService | undefined;

export const logger = {
  configure: (config?: Partial<LoggerConfig>) => {
    if (!instance) {
      instance = LoggerService.getInstance(config);
    } else {
      instance.configure(config || {});
    }
  },
  info: (message: string, context?: string) => {
    if (!instance) instance = LoggerService.getInstance();
    instance.info(message, context);
  },
  warn: (message: string, context?: string) => {
    if (!instance) instance = LoggerService.getInstance();
    instance.warn(message, context);
  },
  error: (message: string, error?: Error, context?: string) => {
    if (!instance) instance = LoggerService.getInstance();
    instance.error(message, error, context);
  },
  debug: (message: string, context?: string) => {
    if (!instance) instance = LoggerService.getInstance();
    instance.debug(message, context);
  },
  getConfig: () => {
    if (!instance) instance = LoggerService.getInstance();
    return instance.getConfig();
  },
};
