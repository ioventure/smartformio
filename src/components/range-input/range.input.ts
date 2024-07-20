import { FormInput } from '@components/input.base';
import { RangeInputOptions } from './range.type';

export class RangeInput extends FormInput {
  protected options: RangeInputOptions;

  constructor(options: RangeInputOptions) {
    super(options);
    this.options = options;
  }

  protected setupValidation(): void {
    this.inputElement.addEventListener('input', () => this._validate());
  }

  private _validate(): void {
    const value = (this.inputElement as HTMLInputElement).valueAsNumber;
    const fieldName = this.options.name;

    this.clearErrorMessage(fieldName);

    // Check if a value is required
    if (this.options.required && isNaN(value)) {
      this.setErrorMessage(
        fieldName,
        `${this.options.label ? this.options.label : 'Field'} is required.`
      );
      return; // Exit early to avoid further checks
    }

    // Validate against min and max values
    if (this.options.min !== undefined && value < +this.options.min) {
      this.setErrorMessage(
        fieldName,
        `Value cannot be less than ${this.options.min}.`
      );
    }

    if (this.options.max !== undefined && value > +this.options.max) {
      this.setErrorMessage(
        fieldName,
        `Value cannot be more than ${this.options.max}.`
      );
    }

    // Validate against pattern if provided
    if (
      this.options.pattern &&
      !new RegExp(this.options.pattern).test(value.toString())
    ) {
      this.setErrorMessage(
        fieldName,
        `Value must match the pattern ${this.options.pattern}.`
      );
    }

    // Custom validation
    if (
      this.options.customValidation &&
      !this.options.customValidation(value)
    ) {
      this.setErrorMessage(fieldName, 'Custom validation failed.');
    }
  }
}
