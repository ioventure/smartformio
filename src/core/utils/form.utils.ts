/**
 * @file Form utility functions
 */

import { Form } from '@domain/form';
import { Field, FieldConfig, FieldType } from '@domain/field';
import { FieldUtils } from './field.utils';
import { CollectionUtils } from './collection.utils';

export class FormUtils {
  /**
   * Get form values as an object
   */
  static getFormValues(form: Form): Record<string, any> {
    const fieldsByName = CollectionUtils.groupBy(form.fields, 'name');
    return CollectionUtils.mapValues(fieldsByName, (fields: Field[]) => fields[0]?.value.raw);
  }

  /**
   * Set form values from an object
   */
  static setFormValues(form: Form, values: Record<string, any>): void {
    CollectionUtils.entries(values).forEach(([name, value]) => {
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
    form.fields.forEach((field: Field) => {
      field.reset();
    });
  }

  /**
   * Get form data
   */
  static getFormData(form: Form): FormData {
    const formData = new FormData();

    form.fields.forEach((field: Field) => {
      const value = field.value.raw;

      if (value instanceof FileList) {
        CollectionUtils.unique(Array.from(value)).forEach((file) => {
          formData.append(field.name, file);
        });
      } else if (Array.isArray(value)) {
        CollectionUtils.unique(value).forEach((val) => {
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
    const fieldsByName = CollectionUtils.groupBy(form.fields, 'name');
    return CollectionUtils.mapValues(fieldsByName, (fields: Field[]) => {
      const value = fields[0]?.value.raw;
      if (value instanceof FileList) {
        return CollectionUtils.unique(Array.from(value)).map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
        }));
      }
      return value;
    });
  }

  /**
   * Get form errors
   */
  static getFormErrors(form: Form): Record<string, string[]> {
    const fieldsByName = CollectionUtils.groupBy(form.fields, 'name');
    const errorsByName = CollectionUtils.mapValues(
      fieldsByName,
      (fields: Field[]) => fields[0]?.errors || []
    );
    return CollectionUtils.filterObject(errorsByName, (errors) => errors.length > 0) as Record<
      string,
      string[]
    >;
  }

  /**
   * Check if form is valid
   */
  static isFormValid(form: Form): boolean {
    return form.fields.every((field: Field) => field.isValid);
  }

  /**
   * Check if form is dirty
   */
  static isFormDirty(form: Form): boolean {
    return form.fields.some((field: Field) => field.isDirty);
  }

  /**
   * Check if form is touched
   */
  static isFormTouched(form: Form): boolean {
    return form.fields.some((field: Field) => field.isTouched);
  }

  /**
   * Get field by name
   */
  static getFieldByName(form: Form, name: string): Field | undefined {
    return form.fields.find((field: Field) => field.name === name);
  }

  /**
   * Get fields by type
   */
  static getFieldsByType(form: Form, type: FieldType): Field[] {
    return form.fields.filter((field: Field) => field.type === type);
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
      field.setValue(CollectionUtils.deepClone(value));
    }
  }

  /**
   * Parse form values based on field types
   */
  static parseFormValues(form: Form): Record<string, any> {
    const fieldsByName = CollectionUtils.groupBy(form.fields, 'name');
    return CollectionUtils.mapValues(fieldsByName, (fields: Field[]) => {
      const field = fields[0];
      return field ? FieldUtils.parseValue(field.value.raw, field.type) : undefined;
    });
  }

  /**
   * Create field config
   */
  static createFieldConfig(type: FieldType, options: Partial<FieldConfig> = {}): FieldConfig {
    const defaultConfig = {
      label: '',
      placeholder: '',
      required: false,
      disabled: false,
      readonly: false,
      className: '',
      helpText: '',
      validationMessage: '',
      hiddenLabel: false,
      defaultValue: null,
    } as const;

    // Create a new config by merging the default config with the provided options
    const mergedConfig = CollectionUtils.deepMerge(
      defaultConfig,
      CollectionUtils.omit(options, ['validation'])
    );

    // Handle validation separately to ensure type safety
    if (options.validation) {
      (mergedConfig as FieldConfig).validation = options.validation;
    }

    return mergedConfig as FieldConfig;
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
    const fields = form.fields;
    return {
      totalFields: fields.length,
      validFields: fields.filter((f: Field) => f.isValid).length,
      invalidFields: fields.filter((f: Field) => !f.isValid).length,
      touchedFields: fields.filter((f: Field) => f.isTouched).length,
      dirtyFields: fields.filter((f: Field) => f.isDirty).length,
      requiredFields: fields.filter((f: Field) => f.config.required).length,
      disabledFields: fields.filter((f: Field) => f.config.disabled).length,
      readonlyFields: fields.filter((f: Field) => f.config.readonly).length,
    };
  }
}
