/**
 * @file Form utility functions
 */

import { Form } from '@domain/form';
import { Field, FieldConfig, FieldType, FieldValidation } from '@domain/field';
import { ValidationResult } from '@domain/validation';
import { ValidationUtils } from './validation.utils';
import { FieldUtils } from './field.utils';

export class FormUtils {
  /**
   * Get form values as an object
   */
  static getFormValues(form: Form): Record<string, any> {
    const values: Record<string, any> = {};
    form.fields.forEach((field) => {
      values[field.name] = field.value.raw;
    });
    return values;
  }

  /**
   * Set form values from an object
   */
  static setFormValues(form: Form, values: Record<string, any>): void {
    Object.entries(values).forEach(([name, value]) => {
      const field = form.getField(name);
      if (field) {
        field.setValue(value);
      }
    });
  }

  /**
   * Reset form to initial values
   */
  static resetForm(form: Form): void {
    form.fields.forEach((field) => {
      field.reset();
    });
  }

  /**
   * Validate entire form
   */
  static validateForm(form: Form): ValidationResult {
    const errors: string[] = [];
    let isValid = true;

    form.fields.forEach((field) => {
      const result = ValidationUtils.validateField(field);
      if (!result.isValid) {
        errors.push(...result.errors);
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  /**
   * Get form data
   */
  static getFormData(form: Form): FormData {
    const formData = new FormData();

    form.fields.forEach((field) => {
      const value = field.value.raw;

      if (value instanceof FileList) {
        Array.from(value).forEach((file) => {
          formData.append(field.name, file);
        });
      } else if (Array.isArray(value)) {
        value.forEach((val) => {
          formData.append(field.name, val);
        });
      } else if (value !== null && value !== undefined) {
        formData.append(field.name, value);
      }
    });

    return formData;
  }

  /**
   * Get form JSON
   */
  static getFormJSON(form: Form): Record<string, any> {
    const json: Record<string, any> = {};

    form.fields.forEach((field) => {
      const value = field.value.raw;

      if (value instanceof FileList) {
        json[field.name] = Array.from(value).map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
        }));
      } else {
        json[field.name] = value;
      }
    });

    return json;
  }

  /**
   * Get form errors
   */
  static getFormErrors(form: Form): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    form.fields.forEach((field) => {
      if (field.errors.length > 0) {
        errors[field.name] = field.errors;
      }
    });

    return errors;
  }

  /**
   * Check if form is valid
   */
  static isFormValid(form: Form): boolean {
    return form.fields.every((field) => field.isValid);
  }

  /**
   * Check if form is dirty
   */
  static isFormDirty(form: Form): boolean {
    return form.fields.some((field) => field.isDirty);
  }

  /**
   * Check if form is touched
   */
  static isFormTouched(form: Form): boolean {
    return form.fields.some((field) => field.isTouched);
  }

  /**
   * Get field by name
   */
  static getFieldByName(form: Form, name: string): Field | undefined {
    return form.fields.find((field) => field.name === name);
  }

  /**
   * Get fields by type
   */
  static getFieldsByType(form: Form, type: FieldType): Field[] {
    return form.fields.filter((field) => field.type === type);
  }

  /**
   * Get field value
   */
  static getFieldValue<T = any>(form: Form, name: string): T | undefined {
    const field = this.getFieldByName(form, name);
    return field ? field.value.raw : undefined;
  }

  /**
   * Set field value
   */
  static setFieldValue(form: Form, name: string, value: any): void {
    const field = this.getFieldByName(form, name);
    if (field) {
      field.setValue(value);
    }
  }

  /**
   * Parse form values based on field types
   */
  static parseFormValues(form: Form): Record<string, any> {
    const values: Record<string, any> = {};

    form.fields.forEach((field) => {
      values[field.name] = FieldUtils.parseValue(field.value.raw, field.type);
    });

    return values;
  }

  /**
   * Create field config
   */
  static createFieldConfig(type: FieldType, options: Partial<FieldConfig> = {}): FieldConfig {
    const config: FieldConfig = {};

    if (options.label !== undefined) config.label = options.label;
    if (options.placeholder !== undefined) config.placeholder = options.placeholder;
    if (options.required !== undefined) config.required = options.required;
    if (options.disabled !== undefined) config.disabled = options.disabled;
    if (options.readonly !== undefined) config.readonly = options.readonly;
    if (options.className !== undefined) config.className = options.className;
    if (options.helpText !== undefined) config.helpText = options.helpText;
    if (options.validationMessage !== undefined)
      config.validationMessage = options.validationMessage;
    if (options.hiddenLabel !== undefined) config.hiddenLabel = options.hiddenLabel;
    if (options.defaultValue !== undefined) config.defaultValue = options.defaultValue;
    if (options.validation !== undefined) config.validation = options.validation;

    return config;
  }

  /**
   * Get form summary
   */
  static getFormSummary(form: Form): {
    totalFields: number;
    validFields: number;
    invalidFields: number;
    touchedFields: number;
    dirtyFields: number;
    requiredFields: number;
    disabledFields: number;
    readonlyFields: number;
  } {
    return {
      totalFields: form.fields.length,
      validFields: form.fields.filter((f) => f.isValid).length,
      invalidFields: form.fields.filter((f) => !f.isValid).length,
      touchedFields: form.fields.filter((f) => f.isTouched).length,
      dirtyFields: form.fields.filter((f) => f.isDirty).length,
      requiredFields: form.fields.filter((f) => f.config.required).length,
      disabledFields: form.fields.filter((f) => f.config.disabled).length,
      readonlyFields: form.fields.filter((f) => f.config.readonly).length,
    };
  }
}
