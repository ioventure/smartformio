/**
 * @file Utility exports
 */

// Collection utilities
export { CollectionUtils } from './collection.utils';

// DOM utilities
export { DOMUtils } from './dom.utils';

// Error utilities
export {
  ErrorUtils,
  SmartFormError,
  ValidationError,
  FieldError,
  FormError,
  ConfigurationError,
  RenderError,
} from './error.utils';

// Event utilities
export { EventUtils, EventEmitter } from './event.utils';

// Field utilities
export { FieldUtils } from './field.utils';

// Form utilities
export { FormUtils } from './form.utils';

// String utilities
export { StringUtils } from './string.utils';

// Style utilities
export { StyleUtils } from './style.utils';

// Validation utilities
export { ValidationUtils } from './validation.utils';

/**
 * Common type utilities
 */
export type Primitive = string | number | boolean | null | undefined;

export type RecordOf<T> = Record<string, T>;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type ValueOf<T> = T[keyof T];

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

/**
 * Function type utilities
 */
export type AnyFunction = (...args: any[]) => any;

export type AsyncFunction = (...args: any[]) => Promise<any>;

export type FunctionParameters<T extends AnyFunction> = T extends (...args: infer P) => any
  ? P
  : never;

export type FunctionReturn<T extends AnyFunction> = T extends (...args: any[]) => infer R
  ? R
  : never;

/**
 * Object type utilities
 */
export type ObjectKeys<T> = T extends object ? keyof T : never;

export type ObjectValues<T> = T extends object ? T[keyof T] : never;

export type ObjectEntries<T> = T extends object ? [keyof T, T[keyof T]][] : never;

/**
 * Array type utilities
 */
export type ArrayElement<T> = T extends (infer E)[] ? E : never;

export type NonEmptyArray<T> = [T, ...T[]];

export type TupleOf<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;

type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

/**
 * Utility type guards
 */
export const isNonNullable = <T>(value: T): value is NonNullable<T> =>
  value !== null && value !== undefined;

export const isPromise = <T = any>(value: any): value is Promise<T> => value instanceof Promise;

export const isObject = (value: unknown): value is object =>
  typeof value === 'object' && value !== null;

export const isFunction = (value: unknown): value is AnyFunction => typeof value === 'function';

export const isAsyncFunction = (value: unknown): value is AsyncFunction =>
  isFunction(value) && value.constructor.name === 'AsyncFunction';

/**
 * Common utility functions
 */
export const noop = () => {};

export const identity = <T>(value: T): T => value;

export const asyncIdentity = async <T>(value: T): Promise<T> => value;

export const memoize = <T extends AnyFunction>(
  fn: T,
  getKey: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args)
): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = getKey(...args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

export const debounce = <T extends AnyFunction>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <T extends AnyFunction>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
