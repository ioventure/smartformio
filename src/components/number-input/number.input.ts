import { FormInput } from '@components/input.base';
import { NumberInputOptions } from './number.type';

export class NumberInput extends FormInput {
  protected options: NumberInputOptions;

  constructor(options: NumberInputOptions) {
    super(options);
    this.options = options;
  }

  protected setupValidation(): void {
    // Attach event listeners for validation
    this.inputElement.addEventListener('input', () => this._validate());
    this.inputElement.addEventListener('change', () => this._validate());
  }

  private _validate(): void {
    const value = (this.inputElement as HTMLInputElement).value;
    const fieldName = this.options.name;

    this.clearErrorMessage(fieldName);

    // Required field validation
    if (this.options.required && value.trim() === '') {
      this.setErrorMessage(
        fieldName,
        `${this.options.label ? this.options.label : 'Field'} is required.`
      );
      return;
    }

    // Pattern validation
    if (this.options.pattern && !new RegExp(this.options.pattern).test(value)) {
      this.setErrorMessage(fieldName, `Please enter a valid ${fieldName}.`);
      return;
    }

    // Numeric value validation
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) {
      this.setErrorMessage(fieldName, 'Value must be a number.');
      return;
    }

    // Range validation
    if (this.options.min !== undefined && numberValue < this.options.min) {
      this.setErrorMessage(
        fieldName,
        `Value must be greater than or equal to ${this.options.min}.`
      );
    }

    if (this.options.max !== undefined && numberValue > this.options.max) {
      this.setErrorMessage(
        fieldName,
        `Value must be less than or equal to ${this.options.max}.`
      );
    }

    // Step validation
    if (this.options.step !== undefined) {
      const step = parseFloat(this.options.step.toString());
      if (step > 0 && numberValue % step !== 0) {
        this.setErrorMessage(
          fieldName,
          `Value must be a multiple of ${this.options.step}.`
        );
      }
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
