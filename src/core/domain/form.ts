/**
 * @file Core form domain model
 */

import { Field, FieldConfig, FieldType } from '@domain/field';
import { CollectionUtils } from '@core/utils/collection.utils';

export interface FormConfig {
  title?: string;
  description?: string;
  validateOnChange?: boolean;
  submitButtonText?: string;
  disabled?: boolean;
  readonly?: boolean;
}

export interface FormState {
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  submitCount: number;
  errors: Record<string, string[]>;
}

export class Form {
  private _fields: Map<string, Field> = new Map();
  private _state: FormState;

  constructor(
    public readonly id: string,
    public readonly config: FormConfig
  ) {
    this._state = {
      isValid: true,
      isDirty: false,
      isSubmitting: false,
      submitCount: 0,
      errors: {},
    };
  }

  /**
   * Add a field to the form
   */
  addField(name: string, type: FieldType, config: FieldConfig): Field {
    if (this._fields.has(name)) {
      throw new Error(`Field with name ${name} already exists`);
    }

    const field = new Field(name, type, config);
    this._fields.set(name, field);
    return field;
  }

  /**
   * Get a field by name
   */
  getField(name: string): Field | undefined {
    return this._fields.get(name);
  }

  /**
   * Get all form fields
   */
  get fields(): Field[] {
    return Array.from(this._fields.values());
  }

  /**
   * Get form state
   */
  get state(): FormState {
    return CollectionUtils.deepClone(this._state);
  }

  /**
   * Get form values
   */
  get values(): Record<string, any> {
    return CollectionUtils.mapValues(Object.fromEntries(this._fields), (field) => field.value.raw);
  }

  /**
   * Set field value
   */
  setFieldValue(name: string, value: any): void {
    const field = this._fields.get(name);
    if (!field) {
      throw new Error(`Field ${name} not found`);
    }

    field.setValue(value);
    this._updateFormState();
  }

  /**
   * Set field errors
   */
  setFieldErrors(name: string, errors: string[]): void {
    const field = this._fields.get(name);
    if (!field) {
      throw new Error(`Field ${name} not found`);
    }

    field.setErrors(errors);
    this._updateFormState();
  }

  /**
   * Mark field as touched
   */
  touchField(name: string): void {
    const field = this._fields.get(name);
    if (!field) {
      throw new Error(`Field ${name} not found`);
    }

    field.markAsTouched();
  }

  /**
   * Reset form to initial state
   */
  reset(): void {
    this._fields.forEach((field) => field.reset());
    this._state = {
      isValid: true,
      isDirty: false,
      isSubmitting: false,
      submitCount: 0,
      errors: {},
    };
  }

  /**
   * Start form submission
   */
  startSubmit(): void {
    this._state = CollectionUtils.deepClone({
      ...this._state,
      isSubmitting: true,
      submitCount: this._state.submitCount + 1,
    });
  }

  /**
   * End form submission
   */
  endSubmit(): void {
    this._state = CollectionUtils.deepClone({
      ...this._state,
      isSubmitting: false,
    });
  }

  /**
   * Update form state based on fields
   */
  private _updateFormState(): void {
    const fieldsArray = Array.from(this._fields.entries());
    const fieldErrors = Object.fromEntries(
      fieldsArray
        .filter(([_, field]) => field.errors.length > 0)
        .map(([name, field]) => [name, field.errors])
    ) as Record<string, string[]>;

    const isValid = Object.keys(fieldErrors).length === 0;
    const isDirty = fieldsArray.some(([_, field]) => field.isDirty);

    this._state = CollectionUtils.deepClone({
      ...this._state,
      isValid,
      isDirty,
      errors: fieldErrors,
    });
  }
}
