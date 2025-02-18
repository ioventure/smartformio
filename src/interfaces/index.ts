/**
 * @file Main export file for all SmartFormIO interfaces and types
 */

export type {
  SmartFormConfig,
  BaseField,
  FormSchema,
} from "@interfaces/core.interface";
export type {
  TextField,
  SelectField,
  DateField,
  FileField,
  RadioField,
  CheckboxField,
  FormFieldSchema,
  FieldRenderer,
} from "@interfaces/field.interface";
export type {
  ValidationResult,
  ValidationHandler,
  ValidationUIManager,
} from "@interfaces/validation.interface";
export type { FormSubmitEvent } from "@interfaces/events.interface";
export type {
  SmartFormElement,
  SmartFormAttributes,
  SmartFormParts,
  FormElements,
} from "@interfaces/components.interface";
