/**
 * @file Component-related constants
 */

/**
 * Component parts for styling
 */
export const COMPONENT_PARTS = {
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
    labelHidden: 'label-hidden',
    input: 'input',
    inputWrapper: 'input-wrapper',
    helpText: 'help-text',
    errorText: 'error-text',
    requiredMark: 'required-mark',
    description: 'description',
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

/**
 * Display orientations
 */
export const DISPLAY_ORIENTATIONS = {
  vertical: 'vertical',
  horizontal: 'horizontal',
} as const;

/**
 * Input types
 */
export const INPUT_TYPES = {
  text: 'text',
  email: 'email',
  password: 'password',
  number: 'number',
  textarea: 'textarea',
  select: 'select',
  checkbox: 'checkbox',
  radio: 'radio',
  file: 'file',
  date: 'date',
} as const;

/**
 * Validation messages
 */
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: (min: number) => `Minimum length is ${min} characters`,
  maxLength: (max: number) => `Maximum length is ${max} characters`,
  min: (min: number) => `Minimum value is ${min}`,
  max: (max: number) => `Maximum value is ${max}`,
  pattern: 'Please enter a valid value',
  fileSize: (size: string) => `File size cannot exceed ${size}`,
  fileType: 'File type not supported',
  dateRange: 'Please select a date within the valid range',
} as const;

/**
 * Event names
 */
export const EVENT_NAMES = {
  change: 'change',
  focus: 'focus',
  blur: 'blur',
  keydown: 'keydown',
  click: 'click',
  dragover: 'dragover',
  dragleave: 'dragleave',
  drop: 'drop',
  submit: 'submit',
} as const;

/**
 * ARIA attributes
 */
export const ARIA_ATTRIBUTES = {
  invalid: 'aria-invalid',
  errormessage: 'aria-errormessage',
  required: 'aria-required',
  disabled: 'aria-disabled',
  hidden: 'aria-hidden',
  label: 'aria-label',
  labelledby: 'aria-labelledby',
  describedby: 'aria-describedby',
} as const;

/**
 * File size units
 */
export const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB'] as const;

/**
 * Date format
 */
export const DATE_FORMAT = 'YYYY-MM-DD' as const;

/**
 * Default values
 */
export const DEFAULTS = {
  submitButtonText: 'Submit',
  dateFormat: DATE_FORMAT,
  displayOrientation: DISPLAY_ORIENTATIONS.vertical,
} as const;
