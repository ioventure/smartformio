/**
 * @file Main export file for all SmartFormIO interfaces and types
 */

export type {
  ISmartFormConfig,
  IBaseField,
  IFormSchema,
} from "@interfaces/core.interface";
export type {
  ITextField,
  ISelectField,
  IDateField,
  IFileField,
  IRadioField,
  ICheckboxField,
  IFormFieldSchema,
  IFieldRenderer,
} from "@interfaces/field.interface";
export type {
  IValidationResult,
  IValidationHandler,
  IValidationUIManager,
} from "@interfaces/validation.interface";
export type { IFormSubmitEvent as FormSubmitEvent } from "@interfaces/events.interface";
