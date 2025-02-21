/**
 * @file Core field domain model
 */

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "date"
  | "file"
  | "radio"
  | "checkbox";

export interface FieldValue {
  raw: any;
  formatted: string;
  valid: boolean;
}

export class Field {
  private _value: FieldValue;
  private _errors: string[] = [];
  private _touched: boolean = false;
  private _dirty: boolean = false;

  constructor(
    public readonly name: string,
    public readonly type: FieldType,
    public readonly config: FieldConfig
  ) {
    this._value = {
      raw: config.defaultValue,
      formatted: String(config.defaultValue || ""),
      valid: true,
    };
  }

  get value(): FieldValue {
    return this._value;
  }

  get errors(): string[] {
    return this._errors;
  }

  get isValid(): boolean {
    return this._errors.length === 0;
  }

  get isTouched(): boolean {
    return this._touched;
  }

  get isDirty(): boolean {
    return this._dirty;
  }

  setValue(value: any): void {
    this._value = {
      raw: value,
      formatted: String(value || ""),
      valid: this.isValid,
    };
    this._dirty = true;
  }

  setErrors(errors: string[]): void {
    this._errors = errors;
    this._value = {
      ...this._value,
      valid: errors.length === 0,
    };
  }

  markAsTouched(): void {
    this._touched = true;
  }

  reset(): void {
    this._value = {
      raw: this.config.defaultValue,
      formatted: String(this.config.defaultValue || ""),
      valid: true,
    };
    this._errors = [];
    this._touched = false;
    this._dirty = false;
  }
}

export interface FieldConfig {
  label?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  readonly?: boolean;
  disabled?: boolean;
  className?: string;
  helpText?: string;
  validationMessage?: string;
  hiddenLabel?: boolean;
  validation?: FieldValidation;
}

export interface FieldValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}
