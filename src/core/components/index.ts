/**
 * @file Components index
 * @description Centralizes exports for all components and their types
 */

// Import base components
import { BaseFormElement } from "./base/form-element.base";
import { BaseFieldElement } from "./base/field-element.base";

// Import form component
import { SmartFormElement } from "./form/smart-form.element";

// Import field components and types
import {
  // Field Components
  TextFieldElement,
  SelectFieldElement,
  CheckboxFieldElement,
  RadioFieldElement,
  FileFieldElement,
  DateFieldElement,

  // Field Types
  FIELD_COMPONENTS,
  type FieldType,

  // Field Configurations
  type BaseFieldConfig,
  type TextFieldConfig,
  type SelectFieldConfig,
  type CheckboxFieldConfig,
  type RadioFieldConfig,
  type FileFieldConfig,
  type DateFieldConfig,
  type FieldConfig,

  // Field Options
  type SelectOption,
  type CheckboxOption,
  type RadioOption,

  // Validation Types
  type FieldValidation,
  type FileValidation,
  type DateValidation,

  // Registration Function
  registerFieldComponents,
} from "./fields";

// Export all imports
export {
  // Base Components
  BaseFormElement,
  BaseFieldElement,

  // Form Component
  SmartFormElement,

  // Field Components
  TextFieldElement,
  SelectFieldElement,
  CheckboxFieldElement,
  RadioFieldElement,
  FileFieldElement,
  DateFieldElement,

  // Field Types
  FIELD_COMPONENTS,
  type FieldType,

  // Field Configurations
  type BaseFieldConfig,
  type TextFieldConfig,
  type SelectFieldConfig,
  type CheckboxFieldConfig,
  type RadioFieldConfig,
  type FileFieldConfig,
  type DateFieldConfig,
  type FieldConfig,

  // Field Options
  type SelectOption,
  type CheckboxOption,
  type RadioOption,

  // Validation Types
  type FieldValidation,
  type FileValidation,
  type DateValidation,
};

// Export component registration function
export function registerComponents(): void {
  // Register form component
  if (!customElements.get("smart-form")) {
    customElements.define("smart-form", SmartFormElement);
  }

  // Register field components
  registerFieldComponents();
}

// Export component types
export interface ComponentConfig {
  tag: string;
  component: CustomElementConstructor;
}

// Export component registry
export const COMPONENTS: Record<string, ComponentConfig> = {
  form: {
    tag: "smart-form",
    component: SmartFormElement,
  },
  text: {
    tag: "smart-text-field",
    component: TextFieldElement,
  },
  select: {
    tag: "smart-select-field",
    component: SelectFieldElement,
  },
  checkbox: {
    tag: "smart-checkbox-field",
    component: CheckboxFieldElement,
  },
  radio: {
    tag: "smart-radio-field",
    component: RadioFieldElement,
  },
  file: {
    tag: "smart-file-field",
    component: FileFieldElement,
  },
  date: {
    tag: "smart-date-field",
    component: DateFieldElement,
  },
};

// Export component parts for styling
export const COMPONENT_PARTS = {
  form: {
    root: "form",
    title: "title",
    description: "description",
    fields: "fields",
    field: "field",
    submitButton: "submit-button",
  },
  field: {
    root: "field-root",
    container: "field-container",
    label: "label",
    labelHidden: "label-hidden",
    requiredMark: "required-mark",
    inputWrapper: "input-wrapper",
    input: "input",
    helpText: "help-text",
    errorMessage: "error-message",
  },
  select: {
    wrapper: "select-wrapper",
    select: "select",
    arrow: "select-arrow",
  },
  checkbox: {
    wrapper: "checkbox-wrapper",
    container: "checkbox-container",
    checkbox: "checkbox",
    label: "checkbox-label",
    description: "checkbox-description",
  },
  radio: {
    wrapper: "radio-wrapper",
    container: "radio-container",
    radio: "radio",
    label: "radio-label",
    description: "radio-description",
  },
  file: {
    wrapper: "file-wrapper",
    dropZone: "drop-zone",
    input: "file-input",
    uploadIcon: "upload-icon",
    uploadText: "upload-text",
    fileList: "file-list",
    fileItem: "file-item",
    fileName: "file-name",
    fileSize: "file-size",
  },
  date: {
    wrapper: "date-wrapper",
    input: "date-input",
    calendarIcon: "calendar-icon",
  },
  states: {
    focused: "focused",
    valid: "valid",
    invalid: "invalid",
    disabled: "disabled",
    readonly: "readonly",
    loading: "loading",
    dragover: "dragover",
  },
} as const;

// Export component state types
export type ComponentState = keyof typeof COMPONENT_PARTS.states;

// Export component part types
export type ComponentPart =
  | keyof typeof COMPONENT_PARTS.form
  | keyof typeof COMPONENT_PARTS.field
  | keyof typeof COMPONENT_PARTS.select
  | keyof typeof COMPONENT_PARTS.checkbox
  | keyof typeof COMPONENT_PARTS.radio
  | keyof typeof COMPONENT_PARTS.file
  | keyof typeof COMPONENT_PARTS.date;
