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
  context: string;
  enabled: boolean;
}

/**
 * Singleton Logger Service for SmartFormIO
 * Handles logging in both static and SSR environments
 */
export class LoggerService {
  private static instance: LoggerService;
  private static defaultConfig: LoggerConfig = {
    level: LogLevel.INFO,
    context: "SmartFormIO",
    enabled: true,
  };

  private context: string;
  private enabled: boolean;
  private level: LogLevel;

  private constructor() {
    // Start with logging disabled by default until configured
    this.enabled = false;
    this.level = LoggerService.defaultConfig.level;
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
   * Configure the logger with new settings
   * @param config Partial configuration to update. Only valid values will be applied:
   * - level: must be a valid LogLevel
   * - context: must be a non-empty string
   * - enabled: must be a boolean
   */
  public configure(config: Partial<LoggerConfig>): void {
    if (!config) return;

    // Update level if valid
    if (
      config.level !== undefined &&
      Object.values(LogLevel).includes(config.level)
    ) {
      this.level = config.level;
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
