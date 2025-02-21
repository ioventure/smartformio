/**
 * @file Logger service implementation
 */

import { CollectionUtils } from '@core/utils/collection.utils';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggerConfig {
  level?: LogLevel;
  prefix?: string;
  timestamp?: boolean;
  console?: boolean;
  customHandler?: (level: LogLevel, message: string) => void;
}

export class Logger {
  private static readonly LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private config: Required<LoggerConfig>;

  constructor(config?: LoggerConfig) {
    this.config = CollectionUtils.deepClone({
      level: config?.level ?? 'info',
      prefix: config?.prefix ?? 'SmartFormIO',
      timestamp: config?.timestamp ?? true,
      console: config?.console ?? true,
      customHandler: config?.customHandler ?? (() => {}),
    });
  }

  /**
   * Log debug message
   */
  debug(message: string, ...args: any[]): void {
    this.log('debug', message, args);
  }

  /**
   * Log info message
   */
  info(message: string, ...args: any[]): void {
    this.log('info', message, args);
  }

  /**
   * Log warning message
   */
  warn(message: string, ...args: any[]): void {
    this.log('warn', message, args);
  }

  /**
   * Log error message
   */
  error(message: string | Error, ...args: any[]): void {
    if (message instanceof Error) {
      this.log('error', message.message, [message.stack, ...args]);
    } else {
      this.log('error', message, args);
    }
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * Set prefix
   */
  setPrefix(prefix: string): void {
    this.config.prefix = prefix;
  }

  /**
   * Enable/disable timestamp
   */
  setTimestamp(enabled: boolean): void {
    this.config.timestamp = enabled;
  }

  /**
   * Enable/disable console output
   */
  setConsole(enabled: boolean): void {
    this.config.console = enabled;
  }

  /**
   * Set custom handler
   */
  setCustomHandler(handler: (level: LogLevel, message: string) => void): void {
    this.config.customHandler = handler;
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, args: any[]): void {
    // Check if we should log this level
    if (Logger.LOG_LEVELS[level] < Logger.LOG_LEVELS[this.config.level]) {
      return;
    }

    // Format message
    let formattedMessage = '';

    // Add timestamp if enabled
    if (this.config.timestamp) {
      formattedMessage += `[${new Date().toISOString()}] `;
    }

    // Add prefix if set
    if (this.config.prefix) {
      formattedMessage += `[${this.config.prefix}] `;
    }

    // Add level
    formattedMessage += `[${level.toUpperCase()}] `;

    // Add message
    formattedMessage += message;

    // Log to console if enabled
    if (this.config.console) {
      switch (level) {
        case 'debug':
          console.debug(formattedMessage, ...args);
          break;
        case 'info':
          console.info(formattedMessage, ...args);
          break;
        case 'warn':
          console.warn(formattedMessage, ...args);
          break;
        case 'error':
          console.error(formattedMessage, ...args);
          break;
      }
    }

    // Call custom handler if set
    this.config.customHandler(level, formattedMessage);
  }
}

/**
 * Log entry interface for type safety
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
}

/**
 * Memory logger for testing and debugging
 */
export class MemoryLogger extends Logger {
  private logs: LogEntry[] = [];

  constructor(config?: LoggerConfig) {
    super({
      ...config,
      customHandler: (level, message) => {
        this.logs.push(
          CollectionUtils.deepClone({
            level,
            message,
            timestamp: new Date(),
          })
        );
      },
    });
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return CollectionUtils.deepClone(this.logs);
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return CollectionUtils.deepClone(this.logs.filter((log) => log.level === level));
  }

  /**
   * Clear logs
   */
  clear(): void {
    this.logs = [];
  }
}
