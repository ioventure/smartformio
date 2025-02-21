/**
 * @file String utility functions
 */

import { CollectionUtils } from './collection.utils';

interface DateFormatIndexes {
  YYYY: number;
  MM: number;
  DD: number;
  HH: number;
  mm: number;
  ss: number;
}

type DateFormatPart = keyof DateFormatIndexes;

interface DateFormatValues {
  YYYY: number;
  MM: string;
  DD: string;
  HH: string;
  mm: string;
  ss: string;
}

export class StringUtils {
  private static readonly BYTE_UNITS = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;
  private static readonly RANDOM_CHARS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  private static readonly UUID_TEMPLATE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  private static readonly DATE_FORMAT_PARTS: DateFormatPart[] = [
    'YYYY',
    'MM',
    'DD',
    'HH',
    'mm',
    'ss',
  ];

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
    return CollectionUtils.unique(str.toLowerCase().split(' '))
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
    return Array.from({ length }, () =>
      this.RANDOM_CHARS.charAt(Math.floor(Math.random() * this.RANDOM_CHARS.length))
    ).join('');
  }

  /**
   * Generate UUID v4
   */
  static uuid(): string {
    return this.UUID_TEMPLATE.replace(/[xy]/g, (c) => {
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
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${this.BYTE_UNITS[i]}`;
  }

  /**
   * Format date to string
   */
  static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const formatValues: DateFormatValues = {
      YYYY: date.getFullYear(),
      MM: this.padNumber(date.getMonth() + 1),
      DD: this.padNumber(date.getDate()),
      HH: this.padNumber(date.getHours()),
      mm: this.padNumber(date.getMinutes()),
      ss: this.padNumber(date.getSeconds()),
    };

    return CollectionUtils.entries(formatValues).reduce(
      (result, [part, value]) => result.replace(part, String(value)),
      format
    );
  }

  /**
   * Parse date string
   */
  static parseDate(dateString: string, format: string = 'YYYY-MM-DD'): Date | null {
    const parts = format.split(/[-/\s:]/);
    const values = dateString.split(/[-/\s:]/);

    const indexes = this.DATE_FORMAT_PARTS.reduce<Partial<DateFormatIndexes>>((acc, part) => {
      acc[part] = parts.indexOf(part);
      return acc;
    }, {}) as DateFormatIndexes;

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

  /**
   * Check if string is empty or whitespace
   */
  static isBlank(str: string | null | undefined): boolean {
    return !str || /^\s*$/.test(str);
  }

  /**
   * Check if string contains only numbers
   */
  static isNumeric(str: string): boolean {
    return /^\d+$/.test(str);
  }

  /**
   * Check if string is valid email
   */
  static isEmail(str: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  }

  /**
   * Check if string is valid URL
   */
  static isUrl(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }
}
