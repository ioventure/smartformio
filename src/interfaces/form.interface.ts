/**
 * Base properties common to all form fields.
 */
export interface BaseField {
  /** Unique identifier for the field */
  name: string;
  /** Label text to display above the field */
  label?: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Default value for the field */
  defaultValue?: string | number | boolean;
  /** Whether the field is readonly */
  readonly?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Additional CSS classes to apply */
  className?: string;
  /** Help text to display below the field */
  helpText?: string;
  /** Custom validation message */
  validationMessage?: string;
  /** Hide the label visually but keep it for screen readers */
  hiddenLabel?: boolean;
}

/**
 * Properties for text-based input fields.
 */
export interface TextField extends BaseField {
  type: "text" | "email" | "password" | "number" | "textarea";
  /** Regular expression pattern for validation */
  pattern?: string;
  /** Icon to display at the start of the input */
  leadingIcon?: string;
  /** Icon to display at the end of the input */
  trailingIcon?: string;
  /** Minimum length for text input */
  minLength?: number;
  /** Maximum length for text input */
  maxLength?: number;
  /** Minimum value for number input */
  min?: number;
  /** Maximum value for number input */
  max?: number;
}

/**
 * Properties for select dropdowns.
 */
export interface SelectField extends BaseField {
  type: "select";
  /** Array of options to display in the dropdown */
  options: string[];
}

/**
 * Properties for date inputs.
 */
export interface DateField extends BaseField {
  type: "date";
  /** Date format string */
  format?: string;
  /** Minimum allowed date */
  min?: string | number;
  /** Maximum allowed date */
  max?: string | number;
}

/**
 * Properties for file inputs.
 */
export interface FileField extends BaseField {
  type: "file";
  /** Accepted file types */
  accept?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
}

/**
 * Properties for radio button groups.
 */
export interface RadioField extends BaseField {
  type: "radio";
  /** Array of radio button options */
  options: string[];
}

/**
 * Properties for checkbox inputs.
 */
export interface CheckboxField extends BaseField {
  type: "checkbox";
  /** Array of checkbox options for groups */
  options?: string[];
  /** Array of descriptions for each option */
  descriptions?: string[];
  /** Position of the label relative to the checkbox */
  labelPosition?: "left" | "right";
}

/**
 * Union type of all possible field types.
 */
export type FormFieldSchema =
  | TextField
  | SelectField
  | DateField
  | FileField
  | RadioField
  | CheckboxField;

/**
 * Configuration for the entire form.
 */
export interface FormSchema {
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
  /** Array of form fields */
  fields: FormFieldSchema[];
  /** Enable real-time validation on input */
  validateOnChange?: boolean;
  /** Show the submit button */
  showSubmitButton?: boolean;
  /** Custom text for the submit button */
  submitButtonText?: string;
}

/**
 * Form submission event detail type.
 */
export interface FormSubmitEvent extends CustomEvent {
  detail: Record<string, any>;
}
