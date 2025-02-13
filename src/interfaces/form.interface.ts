/**
 * Type definition for a single form field.
 */
export interface FormFieldSchema {
  type: string; // e.g., "text", "email", "password", "number", "select", etc.
  name: string;
  label?: string;
  required?: boolean;
  options?: string[]; // Only used for fields like "select"
}

/**
 * Type definition for the entire form schema.
 */
export interface FormSchema {
  title?: string;
  fields: FormFieldSchema[];
  // Future extensions: validation rules, dependencies, etc.
}

/**
 * Options for the form renderer.
 * When disableDefaultStyles is true, the component will not load the default stylesheet.
 */
export interface FormRendererOptions {
  disableDefaultStyles?: boolean;
}
