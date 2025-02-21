/**
 * @file Core module index
 * @description Main entry point for the SmartFormIO core module
 */

// Import services and their types
import {
  Logger,
  type LogLevel,
  type LoggerConfig,
} from "./services/logger.service";
import { FormService, type FormServiceConfig } from "./services/form.service";

// Import components and registration function
import {
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

  // Component Types
  type ComponentConfig,
  type ComponentState,
  type ComponentPart,

  // Component Registry
  COMPONENTS,
  COMPONENT_PARTS,

  // Registration Functions
  registerComponents,
} from "./components";

// Export all imported items
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

  // Component Types
  type ComponentConfig,
  type ComponentState,
  type ComponentPart,

  // Component Registry
  COMPONENTS,
  COMPONENT_PARTS,

  // Registration Functions
  registerComponents,
};

// Export domain models
export { Form, type FormConfig } from "./domain/form";

export {
  Field,
  type FieldConfig,
  type FieldType,
  type FieldValue,
} from "./domain/field";

export {
  Validation,
  type ValidationResult,
  type FormValidationResult,
} from "./domain/validation";

// Export interfaces
export {
  type IFormRenderer,
  type RenderOptions,
  type FormRenderResult,
  type FieldRenderResult,
} from "./interfaces/renderers/form-renderer.interface";

export {
  type IFormValidator,
  type IFieldValidator,
  type ValidationRule,
} from "./interfaces/validators/validator.interface";

export {
  type IEventHandler,
  type FormEventType,
  type FormEvent,
  type IFieldEvent,
  type IFormSubmitEvent,
  type IFormValidationEvent,
} from "./interfaces/events/event-handler.interface";

// Export services and their types
export {
  FormService,
  type FormServiceConfig,
  Logger,
  type LogLevel,
  type LoggerConfig,
};

// Export field types and configurations
export {
  // Field Types
  FIELD_COMPONENTS,

  // Field Configurations
  type BaseFieldConfig,
  type TextFieldConfig,
  type SelectFieldConfig,
  type CheckboxFieldConfig,
  type RadioFieldConfig,
  type FileFieldConfig,
  type DateFieldConfig,

  // Field Options
  type SelectOption,
  type CheckboxOption,
  type RadioOption,

  // Validation Types
  type FieldValidation,
  type FileValidation,
  type DateValidation,
} from "./components/fields";

/**
 * Initialize SmartFormIO
 */
export interface SmartFormIOConfig {
  logger?: LoggerConfig;
  validateOnChange?: boolean;
}

export function initialize(config?: SmartFormIOConfig): void {
  // Initialize logger if configured
  if (config?.logger) {
    const logger = new Logger(config.logger);
    logger.info("SmartFormIO initialized");
  }

  // Register components
  registerComponents();
}

// Export version
export const VERSION = "1.0.0";

// Export library info
export const LIBRARY_INFO = {
  name: "SmartFormIO",
  version: VERSION,
  description:
    "A framework-agnostic dynamic form library with built-in validation",
  repository: "https://github.com/ioventure/smartformio",
  license: "MIT",
  author: "IOVenture",
} as const;
