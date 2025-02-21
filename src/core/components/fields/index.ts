/**
 * @file Field components index
 * @description Centralizes exports for all field components
 */

// Export field components
export { TextFieldElement } from "./text-field.element";
export { SelectFieldElement } from "./select-field.element";
export { CheckboxFieldElement } from "./checkbox-field.element";
export { RadioFieldElement } from "./radio-field.element";
export { FileFieldElement } from "./file-field.element";
export { DateFieldElement } from "./date-field.element";

// Export field types mapping
export const FIELD_COMPONENTS = {
  text: "smart-text-field",
  email: "smart-text-field",
  password: "smart-text-field",
  number: "smart-text-field",
  textarea: "smart-text-field",
  select: "smart-select-field",
  checkbox: "smart-checkbox-field",
  radio: "smart-radio-field",
  file: "smart-file-field",
  date: "smart-date-field",
} as const;

// Export field types
export type FieldType = keyof typeof FIELD_COMPONENTS;

// Export component registration function
export function registerFieldComponents(): void {
  // Components will auto-register when their modules are imported
  // This function is provided for explicit registration if needed
}

// Export field validation types
export interface FieldValidation {
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number | string | Date;
  max?: number | string | Date;
  custom?: (value: any) => string | null;
}

// Export field option types
export interface SelectOption {
  value: string;
  label: string;
}

export interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface FileValidation {
  maxFileSize?: number;
  maxTotalSize?: number;
  maxFiles?: number;
  accept?: string;
}

export interface DateValidation {
  min?: string | Date;
  max?: string | Date;
  format?: string;
}

// Export field configuration types
export interface BaseFieldConfig {
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  className?: string;
  helpText?: string;
  validationMessage?: string;
  hiddenLabel?: boolean;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "password" | "number" | "textarea";
  validation?: FieldValidation;
  leadingIcon?: string;
  trailingIcon?: string;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options: (SelectOption | string)[];
  multiple?: boolean;
  validation?: FieldValidation;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
  options?: (CheckboxOption | string)[];
  display?: "vertical" | "horizontal";
  validation?: FieldValidation;
  description?: string;
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: "radio";
  options: (RadioOption | string)[];
  display?: "vertical" | "horizontal";
  validation?: FieldValidation;
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: "file";
  multiple?: boolean;
  validation?: FileValidation;
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: "date";
  validation?: DateValidation;
}

// Export union type of all field configs
export type FieldConfig =
  | TextFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig
  | RadioFieldConfig
  | FileFieldConfig
  | DateFieldConfig;
