/**
 * @file Field components and types exports
 */

// Field components
export { TextFieldElement } from './text-field.element';
export { SelectFieldElement } from './select-field.element';
export { RadioFieldElement } from './radio-field.element';
export { CheckboxFieldElement } from './checkbox-field.element';
export { DateFieldElement } from './date-field.element';
export { FileFieldElement } from './file-field.element';

// Field-specific types
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface FileValidation {
  maxFileSize?: number; // in bytes
  maxTotalSize?: number; // in bytes
  maxFiles?: number;
  accept?: string;
}

export interface DateValidation {
  min?: string | Date;
  max?: string | Date;
}

// Field display types
export type FieldDisplay = 'horizontal' | 'vertical';

// Field icon types
export interface FieldIcon {
  svg: string;
  position: 'leading' | 'trailing';
  onClick?: () => void;
}

// Field state types
export type FieldState =
  | 'default'
  | 'focused'
  | 'disabled'
  | 'readonly'
  | 'valid'
  | 'invalid'
  | 'touched'
  | 'untouched'
  | 'dirty'
  | 'pristine';

// Field event types
export type FieldEventType =
  | 'change'
  | 'focus'
  | 'blur'
  | 'input'
  | 'keydown'
  | 'keyup'
  | 'keypress'
  | 'click'
  | 'dragover'
  | 'dragleave'
  | 'drop';

// Field CSS parts
export const FIELD_PARTS = {
  root: 'field-root',
  label: 'label',
  labelHidden: 'label-hidden',
  input: 'input',
  inputWrapper: 'input-wrapper',
  helpText: 'help-text',
  errorText: 'error-text',
  requiredMark: 'required-mark',
  description: 'description',
  icon: {
    leading: 'leading-icon',
    trailing: 'trailing-icon',
  },
  select: {
    wrapper: 'select-wrapper',
    select: 'select',
    arrow: 'select-arrow',
    option: 'select-option',
    optionGroup: 'select-option-group',
  },
  checkbox: {
    wrapper: 'checkbox-wrapper',
    container: 'checkbox-container',
    checkbox: 'checkbox',
    label: 'checkbox-label',
    description: 'checkbox-description',
    group: 'checkbox-group',
  },
  radio: {
    wrapper: 'radio-wrapper',
    container: 'radio-container',
    radio: 'radio',
    label: 'radio-label',
    description: 'radio-description',
    group: 'radio-group',
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
    fileProgress: 'file-progress',
    fileError: 'file-error',
  },
  date: {
    wrapper: 'date-wrapper',
    input: 'date-input',
    calendarIcon: 'calendar-icon',
    calendar: 'date-calendar',
    calendarHeader: 'date-calendar-header',
    calendarBody: 'date-calendar-body',
    calendarDay: 'date-calendar-day',
    calendarDaySelected: 'date-calendar-day-selected',
    calendarDayDisabled: 'date-calendar-day-disabled',
  },
} as const;

// Field CSS classes
export const FIELD_CLASSES = {
  state: {
    focused: 'focused',
    disabled: 'disabled',
    readonly: 'readonly',
    valid: 'valid',
    invalid: 'invalid',
    touched: 'touched',
    untouched: 'untouched',
    dirty: 'dirty',
    pristine: 'pristine',
  },
  display: {
    horizontal: 'horizontal',
    vertical: 'vertical',
  },
} as const;

// Field constants
export const FIELD_CONSTANTS = {
  dateFormat: 'YYYY-MM-DD',
  defaultDisplay: 'vertical',
  defaultIcon: {
    size: 20,
    color: 'currentColor',
  },
  validation: {
    defaultMaxFileSize: 5 * 1024 * 1024, // 5MB
    defaultMaxTotalSize: 10 * 1024 * 1024, // 10MB
    defaultMaxFiles: 5,
  },
} as const;
