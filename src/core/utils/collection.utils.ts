/**
 * @file Collection utility functions for arrays and objects
 */

type Primitive = string | number | boolean | null | undefined;
type DeepPartial<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends Date
      ? T
      : T extends RegExp
        ? T
        : {
            [P in keyof T]?: DeepPartial<T[P]>;
          };

export class CollectionUtils {
  /**
   * Deep clone an object or array
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as any;
    }

    if (obj instanceof RegExp) {
      return new RegExp(obj) as any;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepClone(item)) as any;
    }

    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, this.deepClone(value)])
    ) as T;
  }

  /**
   * Deep merge objects
   */
  static deepMerge<T extends Record<string, any>>(target: T, ...sources: DeepPartial<T>[]): T {
    if (!sources.length) return target;

    const source = sources.shift();
    if (!source) return target;

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, { [key]: {} });
          }
          this.deepMerge(target[key], source[key] as DeepPartial<T[keyof T]>);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.deepMerge(target, ...sources);
  }

  /**
   * Check if value is object
   */
  static isObject(item: unknown): item is Record<string, any> {
    return Boolean(item && typeof item === 'object' && !Array.isArray(item));
  }

  /**
   * Group array by key
   */
  static groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce(
      (result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
          result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
      },
      {} as Record<string, T[]>
    );
  }

  /**
   * Sort array by key
   */
  static sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /**
   * Remove duplicates from array
   */
  static unique<T>(array: T[]): T[] {
    return Array.from(new Set(array));
  }

  /**
   * Remove duplicates from array by key
   */
  static uniqueBy<T>(array: T[], key: keyof T): T[] {
    return Array.from(new Map(array.map((item) => [item[key], item])).values());
  }

  /**
   * Flatten array
   */
  static flatten<T>(array: (T | T[])[]): T[] {
    return array.reduce<T[]>(
      (flat, item) => flat.concat(Array.isArray(item) ? this.flatten(item) : item),
      []
    );
  }

  /**
   * Chunk array into smaller arrays
   */
  static chunk<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, (index + 1) * size)
    );
  }

  /**
   * Pick object properties
   */
  static pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  }

  /**
   * Omit object properties
   */
  static omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };
    keys.forEach((key) => {
      delete result[key];
    });
    return result;
  }

  /**
   * Map object values
   */
  static mapValues<T extends object, U>(
    obj: T,
    fn: (value: T[keyof T]) => U
  ): { [K in keyof T]: U } {
    const result = {} as { [K in keyof T]: U };
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = fn(obj[key]);
      }
    }
    return result;
  }

  /**
   * Filter object properties
   */
  static filterObject<T extends object>(
    obj: T,
    predicate: (value: T[keyof T], key: keyof T) => boolean
  ): Partial<T> {
    const result = {} as Partial<T>;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && predicate(obj[key], key)) {
        result[key] = obj[key];
      }
    }
    return result;
  }

  /**
   * Get object keys typed
   */
  static keys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
  }

  /**
   * Get object values typed
   */
  static values<T extends object>(obj: T): T[keyof T][] {
    return Object.values(obj) as T[keyof T][];
  }

  /**
   * Get object entries typed
   */
  static entries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
    return Object.entries(obj) as [keyof T, T[keyof T]][];
  }

  /**
   * Check if arrays are equal
   */
  static areArraysEqual<T>(a: T[], b: T[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((item, index) => this.isEqual(item, b[index]));
  }

  /**
   * Check if objects are equal
   */
  static areObjectsEqual(a: Record<string, any>, b: Record<string, any>): boolean {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    return keysA.every((key) => this.isEqual(a[key], b[key]));
  }

  /**
   * Deep equality check
   */
  static isEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (typeof a !== typeof b) return false;

    if (typeof a === 'object' && typeof b === 'object') {
      if (Array.isArray(a) && Array.isArray(b)) {
        return this.areArraysEqual(a, b);
      }
      if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
      }
      if (a instanceof RegExp && b instanceof RegExp) {
        return a.toString() === b.toString();
      }
      return this.areObjectsEqual(a as Record<string, any>, b as Record<string, any>);
    }

    return false;
  }
}
