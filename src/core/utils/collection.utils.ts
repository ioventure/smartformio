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

type Predicate<T> = (value: T, index: number, array: readonly T[]) => boolean;
type Comparator<T> = (a: T, b: T) => number;

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
   * Type guards
   */
  static isObject(item: unknown): item is Record<string, any> {
    return Boolean(item && typeof item === 'object' && !Array.isArray(item));
  }

  static isArray<T>(item: unknown): item is readonly T[] {
    return Array.isArray(item);
  }

  static isDate(item: unknown): item is Date {
    return item instanceof Date;
  }

  static isRegExp(item: unknown): item is RegExp {
    return item instanceof RegExp;
  }

  /**
   * Array operations
   */
  static groupBy<T>(array: readonly T[], key: keyof T): Record<string, T[]> {
    return array.reduce(
      (result, item) => {
        const groupKey = String(item[key]);
        (result[groupKey] = result[groupKey] || []).push(item);
        return result;
      },
      {} as Record<string, T[]>
    );
  }

  static sortBy<T>(array: readonly T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    const multiplier = order === 'asc' ? 1 : -1;
    return [...array].sort((a, b) => {
      if (a[key] < b[key]) return -1 * multiplier;
      if (a[key] > b[key]) return 1 * multiplier;
      return 0;
    });
  }

  static unique<T>(array: readonly T[]): T[] {
    return [...new Set(array)];
  }

  static uniqueBy<T, K extends keyof T>(array: readonly T[], key: K): T[] {
    const seen = new Map<T[K], T>();
    array.forEach((item) => {
      if (!seen.has(item[key])) {
        seen.set(item[key], item);
      }
    });
    return Array.from(seen.values());
  }

  static flatten<T>(array: readonly (T | readonly T[])[]): T[] {
    return array.reduce<T[]>(
      (flat, item) => flat.concat(Array.isArray(item) ? this.flatten(item) : item),
      []
    );
  }

  static chunk<T>(array: readonly T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, (i + 1) * size)
    );
  }

  /**
   * Object operations
   */
  static pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = obj[key];
      }
    });
    return result;
  }

  static omit<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
    const result = { ...obj };
    keys.forEach((key) => {
      delete result[key];
    });
    return result;
  }

  static mapValues<T extends object, U>(
    obj: T,
    fn: (value: T[keyof T], key: keyof T) => U
  ): { [K in keyof T]: U } {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, fn(value as T[keyof T], key as keyof T)])
    ) as { [K in keyof T]: U };
  }

  static filterObject<T extends object>(
    obj: T,
    predicate: (value: T[keyof T], key: keyof T) => boolean
  ): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => predicate(value as T[keyof T], key as keyof T))
    ) as Partial<T>;
  }

  /**
   * Type-safe object methods
   */
  static keys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
  }

  static values<T extends object>(obj: T): T[keyof T][] {
    return Object.values(obj) as T[keyof T][];
  }

  static entries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
    return Object.entries(obj) as [keyof T, T[keyof T]][];
  }

  /**
   * Equality checks
   */
  static areArraysEqual<T>(a: readonly T[], b: readonly T[], comparator?: Comparator<T>): boolean {
    if (a.length !== b.length) return false;
    return a.every((item, index) => {
      const bItem = b[index];
      if (bItem === undefined) return false;
      return comparator ? comparator(item, bItem) === 0 : this.isEqual(item, bItem);
    });
  }

  static areObjectsEqual(a: Record<string, any>, b: Record<string, any>): boolean {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => this.isEqual(a[key], b[key]));
  }

  static isEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (typeof a !== typeof b) return false;

    if (typeof a === 'object' && typeof b === 'object') {
      if (this.isArray(a) && this.isArray(b)) {
        return this.areArraysEqual(a, b);
      }
      if (this.isDate(a) && this.isDate(b)) {
        return a.getTime() === b.getTime();
      }
      if (this.isRegExp(a) && this.isRegExp(b)) {
        return a.toString() === b.toString();
      }
      return this.areObjectsEqual(a as Record<string, any>, b as Record<string, any>);
    }

    return false;
  }

  /**
   * Array transformations
   */
  static partition<T>(array: readonly T[], predicate: Predicate<T>): [T[], T[]] {
    return array.reduce(
      ([pass, fail], elem, index, arr) => {
        return predicate(elem, index, arr) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
      },
      [[], []] as [T[], T[]]
    );
  }

  static groupByMultiple<T>(array: readonly T[], keys: readonly (keyof T)[]): Record<string, T[]> {
    return array.reduce(
      (result, item) => {
        const groupKey = keys.map((key) => String(item[key])).join('|');
        (result[groupKey] = result[groupKey] || []).push(item);
        return result;
      },
      {} as Record<string, T[]>
    );
  }

  static findDuplicates<T>(array: readonly T[]): T[] {
    const seen = new Set<T>();
    return array.filter((item) => {
      if (seen.has(item)) return true;
      seen.add(item);
      return false;
    });
  }

  static findDuplicatesBy<T, K extends keyof T>(array: readonly T[], key: K): T[] {
    const seen = new Set<T[K]>();
    return array.filter((item) => {
      const value = item[key];
      if (seen.has(value)) return true;
      seen.add(value);
      return false;
    });
  }

  static difference<T>(array1: readonly T[], array2: readonly T[]): T[] {
    const set = new Set(array2);
    return array1.filter((item) => !set.has(item));
  }

  static intersection<T>(array1: readonly T[], array2: readonly T[]): T[] {
    const set = new Set(array2);
    return array1.filter((item) => set.has(item));
  }

  static union<T>(array1: readonly T[], array2: readonly T[]): T[] {
    return this.unique([...array1, ...array2]);
  }
}
