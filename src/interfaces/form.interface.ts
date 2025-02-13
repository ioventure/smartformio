/**
 * Base properties common to all fields.
 */
interface BaseField {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
  readonly?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Fields that accept text-based input.
 */
export interface TextField extends BaseField {
  type: "text" | "email" | "password" | "number" | "textarea";
  pattern?: string;
  /** Hides the label visually while keeping it accessible. */
  hiddenLabel?: boolean;
  /** Help text displayed below the input. */
  helpText?: string;
  /** Error message shown when validation fails. */
  validationMessage?: string;
  /** Leading icon HTML snippet or icon class. */
  leadingIcon?: string;
  /** Trailing icon HTML snippet or icon class. */
  trailingIcon?: string;
}
/**
 * Fields for select dropdowns.
 */
export interface SelectField extends BaseField {
  type: "select";
  options: string[];
}

/**
 * Fields for date inputs.
 */
export interface DateField extends BaseField {
  type: "date";
  format?: string;
  min?: string | number;
  max?: string | number;
}

/**
 * Fields for file inputs.
 */
export interface FileField extends BaseField {
  type: "file";
}

/**
 * Fields for radio button groups.
 */
export interface RadioField extends BaseField {
  type: "radio";
  options: string[];
}

/**
 * Fields for checkboxes.
 * For a group of checkboxes, `options` (and optionally `descriptions`) must be provided.
 * For a single checkbox, omit `options` and use `labelPosition` to control label placement.
 */
export interface CheckboxField extends BaseField {
  type: "checkbox";
  options?: string[];
  descriptions?: string[];
  labelPosition?: "left" | "right";
}

/**
 * The complete form field schema as a union of all possible field types.
 */
export type FormFieldSchema =
  | TextField
  | SelectField
  | DateField
  | FileField
  | RadioField
  | CheckboxField;

/**
 * Type definition for the entire form schema.
 */
export interface FormSchema {
  title?: string;
  description?: string;
  fields: FormFieldSchema[];
  validateOnChange?: boolean;
  showSubmitButton?: boolean;
  submitButtonText?: string;
}
