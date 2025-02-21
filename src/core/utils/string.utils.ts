/**
 * @file String utility functions
 */

export class StringUtils {
  /**
   * Convert camelCase to kebab-case
   */
  static toKebabCase(str: string): string {
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
      .toLowerCase();
  }

  /**
   * Convert kebab-case to camelCase
   */
  static toCamelCase(str: string): string {
    return str.toLowerCase().replace(/-(.)/g, (_, group1) => group1.toUpperCase());
  }

  /**
   * Convert string to PascalCase
   */
  static toPascalCase(str: string): string {
    return str.toLowerCase().replace(/(^|-)(.)/g, (_, separator, char) => char.toUpperCase());
  }

  /**
   * Convert string to snake_case
   */
  static toSnakeCase(str: string): string {
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1_$2')
      .toLowerCase();
  }

  /**
   * Capitalize first letter
   */
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Uncapitalize first letter
   */
  static uncapitalize(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  /**
   * Convert to title case
   */
  static toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => this.capitalize(word))
      .join(' ');
  }

  /**
   * Convert to sentence case
   */
  static toSentenceCase(str: string): string {
    return this.capitalize(str.toLowerCase());
  }

  /**
   * Truncate string
   */
  static truncate(str: string, length: number, suffix: string = '...'): string {
    if (str.length <= length) return str;
    return str.slice(0, length - suffix.length) + suffix;
  }

  /**
   * Generate random string
   */
  static random(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  }

  /**
   * Generate UUID v4
   */
  static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Slugify string
   */
  static slugify(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Format number with leading zeros
   */
  static padNumber(num: number, length: number = 2): string {
    return String(num).padStart(length, '0');
  }

  /**
   * Format bytes to human readable string
   */
  static formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  }

  /**
   * Format date to string
   */
  static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = this.padNumber(date.getMonth() + 1);
    const day = this.padNumber(date.getDate());
    const hours = this.padNumber(date.getHours());
    const minutes = this.padNumber(date.getMinutes());
    const seconds = this.padNumber(date.getSeconds());

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Parse date string
   */
  static parseDate(dateString: string, format: string = 'YYYY-MM-DD'): Date | null {
    const parts = format.split(/[-/\s:]/);
    const values = dateString.split(/[-/\s:]/);
    const indexes = {
      YYYY: parts.indexOf('YYYY'),
      MM: parts.indexOf('MM'),
      DD: parts.indexOf('DD'),
      HH: parts.indexOf('HH'),
      mm: parts.indexOf('mm'),
      ss: parts.indexOf('ss'),
    };

    const date = new Date();
    if (indexes.YYYY !== -1) date.setFullYear(Number(values[indexes.YYYY]));
    if (indexes.MM !== -1) date.setMonth(Number(values[indexes.MM]) - 1);
    if (indexes.DD !== -1) date.setDate(Number(values[indexes.DD]));
    if (indexes.HH !== -1) date.setHours(Number(values[indexes.HH]));
    if (indexes.mm !== -1) date.setMinutes(Number(values[indexes.mm]));
    if (indexes.ss !== -1) date.setSeconds(Number(values[indexes.ss]));

    return isNaN(date.getTime()) ? null : date;
  }

  /**
   * Escape HTML special characters
   */
  static escapeHTML(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Unescape HTML special characters
   */
  static unescapeHTML(str: string): string {
    const div = document.createElement('div');
    div.innerHTML = str;
    return div.textContent || '';
  }
}
