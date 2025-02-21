/**
 * @file Common field configuration interfaces
 */

import { FieldType } from '@domain/field';
import {
  SelectOption,
  CheckboxOption,
  RadioOption,
  FileValidation,
  DateValidation,
} from '@components/fields';

/**
 * Base field configuration interface
 */
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

/**
 * Text field configuration
 */
export interface TextFieldConfig extends BaseFieldConfig {
  type: Extract<FieldType, 'text' | 'email' | 'password' | 'number' | 'textarea'>;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

/**
 * Select field configuration
 */
export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  options: (string | SelectOption)[];
  multiple?: boolean;
}

/**
 * Checkbox field configuration
 */
export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox';
  options?: (string | CheckboxOption)[];
  display?: 'vertical' | 'horizontal';
}

/**
 * Radio field configuration
 */
export interface RadioFieldConfig extends BaseFieldConfig {
  type: 'radio';
  options: (string | RadioOption)[];
  display?: 'vertical' | 'horizontal';
}

/**
 * File field configuration
 */
export interface FileFieldConfig extends BaseFieldConfig {
  type: 'file';
  accept?: string;
  multiple?: boolean;
  validation?: FileValidation;
}

/**
 * Date field configuration
 */
export interface DateFieldConfig extends BaseFieldConfig {
  type: 'date';
  validation?: DateValidation;
}

/**
 * Union type of all field configurations
 */
export type FieldConfig =
  | TextFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig
  | RadioFieldConfig
  | FileFieldConfig
  | DateFieldConfig;
