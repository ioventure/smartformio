/**
 * @file SmartFormIO - A framework-agnostic dynamic form library
 * @version 1.0.0
 * @license MIT
 * 
 * SmartFormIO is a customizable form library that works with any framework.
 * It provides a web component core that can be used directly or through framework wrappers.
 * 
 * @example
 * ```typescript
 * // Vanilla JS/TS
 * import { SmartForm } from '@ioventure/smartformio';
 * ```
 */

// Register the web component
import "./web-components/smartform";

// Export core components
export { SmartForm } from "./web-components/smartform";

// Export interfaces and types
export * from "./interfaces";

// Export validation utilities for custom implementations
export { validateField, validateForm } from "./utils/validation";

/**
 * Library version
 * @constant {string}
 */
export const VERSION = "1.0.0";

/**
 * Custom element tag name used for the web component
 * @constant {string}
 */
export const CUSTOM_ELEMENT_TAG = "smart-form-io";

/**
 * Event name emitted on form submission
 * @constant {string}
 */
export const SUBMIT_EVENT = "smartformio:submit";

/**
 * Default validation debounce time in milliseconds
 * @constant {number}
 */
export const VALIDATION_DEBOUNCE = 200;
