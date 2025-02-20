/**
 * @file Field handlers index
 * @module FieldHandlers
 * @description Centralizes exports for all field handler implementations.
 * Each handler is responsible for managing events and validation for specific form field types.
 */

/**
 * Checkbox input handler
 * @see {@link CheckboxInputHandler}
 */
export { attachCheckboxHandler } from "@events/field-handlers/checkbox-input.handler";

/**
 * Date input handler
 * @see {@link DateInputHandler}
 */
export { attachDateInputHandler } from "@events/field-handlers/date-input.handler";

/**
 * File input handler
 * @see {@link FileInputHandler}
 */
export { attachFileInputHandler } from "@events/field-handlers/file-input.handler";

/**
 * Radio input handler
 * @see {@link RadioInputHandler}
 */
export { attachRadioHandler } from "@events/field-handlers/radio-input.handler";

/**
 * Select input handler
 * @see {@link SelectInputHandler}
 */
export { attachSelectHandler } from "@events/field-handlers/select-input.handler";

/**
 * Text input handler
 * @see {@link TextInputHandler}
 */
export { attachTextInputHandler } from "@events/field-handlers/text-input.handler";

/**
 * @example
 * ```typescript
 * // Import specific handlers
 * import { attachTextInputHandler } from '@events/field-handlers';
 *
 * // Or import all handlers
 * import * as fieldHandlers from '@events/field-handlers';
 * ```
 */
