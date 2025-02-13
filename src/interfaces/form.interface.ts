/**
 * Type definition for a single form field.
 */
export interface FormFieldSchema {
  /**
   * Field type, e.g., "text", "email", "password", "number", "select", "date", "file", "radio", "checkbox", etc.
   */
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "date"
    | "file"
    | "radio"
    | "checkbox"
    | "textarea"
    | string; // Allows custom input types

  /**
   * Unique field name.
   */
  name: string;

  /**
   * Optional field label.
   */
  label?: string;

  /**
   * Optional placeholder text.
   */
  placeholder?: string;

  /**
   * Indicates if the field is required.
   */
  required?: boolean;

  /**
   * Options for fields like "select", "radio", or "checkbox".
   */
  options?: string[];

  /**
   * Descriptions for each option (mainly for checkbox groups).
   */
  descriptions?: string[];

  /**
   * Defines label position for checkboxes.
   */
  labelPosition?: "left" | "right";

  /**
   * Optional default value.
   */
  defaultValue?: string | number | boolean;

  /**
   * Optional date format.
   */
  format?: string;

  /**
   * Minimum value (for date/number).
   */
  min?: string | number;

  /**
   * Maximum value (for date/number).
   */
  max?: string | number;

  /**
   * Determines if the field is readonly.
   */
  readonly?: boolean;

  /**
   * Determines if the field is disabled.
   */
  disabled?: boolean;

  /**
   * Custom validation pattern for text fields.
   */
  pattern?: string;

  /**
   * Custom validation message.
   */
  validationMessage?: string;

  /**
   * Custom CSS class for styling.
   */
  className?: string;
}

/**
 * Type definition for the entire form schema.
 */
export interface FormSchema {
  /**
   * Optional form title.
   */
  title?: string;

  /**
   * Optional form description.
   */
  description?: string;

  /**
   * Array of form fields.
   */
  fields: FormFieldSchema[];

  /**
   * Enables auto-validation on change.
   */
  validateOnChange?: boolean;

  /**
   * Displays a submit button.
   */
  showSubmitButton?: boolean;

  /**
   * Submit button text.
   */
  submitButtonText?: string;
}
