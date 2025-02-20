/**
 * @file Events module index
 * @module Events
 * @description Centralizes exports for all event-related functionality.
 * This includes form events, field handlers, validation utilities, and form submission handling.
 */

/**
 * Form event handling
 * @see {@link FormEventHandler}
 */
export * from "@events/form.event";

/**
 * Form API events and submission handling
 * @see {@link FormApiHandler}
 */
export * from "@events/form.api.events";

/**
 * Field-specific event handlers
 * @see {@link CheckboxInputHandler}
 * @see {@link DateInputHandler}
 * @see {@link FileInputHandler}
 * @see {@link RadioInputHandler}
 * @see {@link SelectInputHandler}
 * @see {@link TextInputHandler}
 */
export * from "@events/field-handlers";

/**
 * Validation utilities
 * @see {@link applyErrorState}
 * @see {@link clearErrorState}
 */
export * from "@events/validation.utils";

/**
 * Form submission handling
 * @see {@link FormSubmissionHandler}
 */
export * from "@events/form.submission";

/**
 * @example
 * ```typescript
 * // Import specific handlers
 * import { formEventHandler, formApiHandler } from '@events';
 *
 * // Import field handlers
 * import { attachTextInputHandler, attachCheckboxHandler } from '@events';
 *
 * // Import validation utilities
 * import { applyErrorState, clearErrorState } from '@events';
 *
 * // Import form submission utilities
 * import { formSubmissionHandler, collectFormData } from '@events';
 * ```
 */
