/**
 * @file Main entry point for SmartFormIO
 */

// Export domain models
export { Form } from '@domain/form';
export type { FormConfig } from '@domain/form';

export { Field } from '@domain/field';
export type { FieldConfig, FieldType, FieldValue, FieldValidation } from '@domain/field';

export { BaseValidator, DefaultValidator } from '@domain/validation';
export type { ValidationResult, FormValidationResult } from '@domain/validation';

// Export interfaces
export { BaseFormRenderer } from '@interfaces/renderers/form-renderer.interface';
export type {
  IFormRenderer,
  RenderOptions,
  FormRenderResult,
  FieldRenderResult,
} from '@interfaces/renderers/form-renderer.interface';

export { ValidationRules } from '@interfaces/validators/validator.interface';
export type {
  IFormValidator,
  IFieldValidator,
  ValidationRule,
} from '@interfaces/validators/validator.interface';

export { FormEventType, BaseEventHandler } from '@interfaces/events/event-handler.interface';
export type {
  IEventHandler,
  FormEvent,
  IFieldEvent,
  IFormSubmitEvent,
  IFormValidationEvent,
} from '@interfaces/events/event-handler.interface';

// Export services
export { FormService } from '@core/services/form.service';
export type { FormServiceConfig } from '@core/services/form.service';

export { Logger, MemoryLogger } from '@core/services/logger.service';
export type { LogLevel, LoggerConfig } from '@core/services/logger.service';

// Export base components
export { BaseFormElement } from '@components/base/form-element.base';
export { BaseFieldElement } from '@components/base/field-element.base';
export { SmartFormElement } from '@components/form/smart-form.element';

// Export field components and types
export {
  TextFieldElement,
  CheckboxFieldElement,
  DateFieldElement,
  FileFieldElement,
  RadioFieldElement,
  SelectFieldElement,
} from '@components/fields';

export type {
  SelectOption,
  CheckboxOption,
  RadioOption,
  FileValidation,
  DateValidation,
} from '@components/fields';

// Export version
export const VERSION = '1.0.0';

// Export library info
export const LIBRARY_INFO = {
  name: 'SmartFormIO',
  version: VERSION,
  description: 'A framework-agnostic dynamic form library with built-in validation',
  repository: 'https://github.com/ioventure/smartformio',
  license: 'MIT',
  author: 'IOVenture',
} as const;
