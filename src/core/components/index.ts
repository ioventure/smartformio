/**
 * @file Components index
 * @description Centralizes exports for all components and their types
 */

// Export base components
export { BaseFormElement } from './base/form-element.base';
export { BaseFieldElement, type InputElementType } from './base/field-element.base';

// Export form components
export { SmartFormElement } from './form/smart-form.element';

// Export field components
export {
  TextFieldElement,
  CheckboxFieldElement,
  DateFieldElement,
  FileFieldElement,
  RadioFieldElement,
  SelectFieldElement,
} from './fields';

// Export field-specific types
export type {
  SelectOption,
  CheckboxOption,
  RadioOption,
  FileValidation,
  DateValidation,
} from './fields';

// Export component configuration types
export interface ComponentConfig {
  tag: string;
}

// Define component parts for styling
const COMPONENT_PARTS = {
  states: {
    disabled: 'disabled',
    readonly: 'readonly',
    focused: 'focused',
    valid: 'valid',
    invalid: 'invalid',
    touched: 'touched',
    untouched: 'untouched',
    dirty: 'dirty',
    pristine: 'pristine',
  },
  form: {
    root: 'form',
    title: 'title',
    description: 'description',
    fields: 'fields',
    submitButton: 'submit-button',
  },
  field: {
    root: 'field-root',
    label: 'label',
    input: 'input',
    helpText: 'help-text',
    errorText: 'error-text',
    requiredMark: 'required-mark',
  },
  select: {
    wrapper: 'select-wrapper',
    select: 'select',
    arrow: 'select-arrow',
    option: 'select-option',
  },
  checkbox: {
    wrapper: 'checkbox-wrapper',
    container: 'checkbox-container',
    checkbox: 'checkbox',
    label: 'checkbox-label',
    description: 'checkbox-description',
  },
  radio: {
    wrapper: 'radio-wrapper',
    container: 'radio-container',
    radio: 'radio',
    label: 'radio-label',
    description: 'radio-description',
  },
  file: {
    wrapper: 'file-wrapper',
    dropZone: 'drop-zone',
    input: 'file-input',
    uploadIcon: 'upload-icon',
    uploadText: 'upload-text',
    fileList: 'file-list',
    fileItem: 'file-item',
    fileName: 'file-name',
    fileSize: 'file-size',
  },
  date: {
    wrapper: 'date-wrapper',
    input: 'date-input',
    calendarIcon: 'calendar-icon',
  },
} as const;

// Export component styling types
export type ComponentState = keyof typeof COMPONENT_PARTS.states;
export type ComponentPart =
  | keyof typeof COMPONENT_PARTS.form
  | keyof typeof COMPONENT_PARTS.field
  | keyof typeof COMPONENT_PARTS.select
  | keyof typeof COMPONENT_PARTS.checkbox
  | keyof typeof COMPONENT_PARTS.radio
  | keyof typeof COMPONENT_PARTS.file
  | keyof typeof COMPONENT_PARTS.date;

// Export component parts for styling
export { COMPONENT_PARTS };
