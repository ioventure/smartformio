import { FormInput } from '@components/input.base';
import { DateInputOptions } from './date.type';

export class DateInput extends FormInput {
  protected options: DateInputOptions;

  constructor(options: DateInputOptions) {
    super(options);
    this.options = options;
  }

  protected setupValidation(): void {
    this.inputElement.addEventListener('input', () => {
      this._validate();
    });
  }

  private _validate(): void {
    const dateValue = (this.inputElement as HTMLInputElement).value;
    const fieldName = this.options.name;

    this.clearErrorMessage(fieldName);

    // Required validation
    if (this.options.required && !dateValue) {
      this.setErrorMessage(
        fieldName,
        `${this.options.label ? this.options.label : 'Field'} is required.`
      );
    }

    // Minimum date validation
    if (this.options.min && new Date(dateValue) < new Date(this.options.min)) {
      this.setErrorMessage(
        fieldName,
        `Date cannot be earlier than ${this.options.min}.`
      );
    }

    // Maximum date validation
    if (this.options.max && new Date(dateValue) > new Date(this.options.max)) {
      this.setErrorMessage(
        fieldName,
        `Date cannot be later than ${this.options.max}.`
      );
    }

    // Custom validation
    if (
      this.options.customValidation &&
      !this.options.customValidation(dateValue)
    ) {
      this.setErrorMessage(fieldName, 'Custom validation failed.');
    }
  }
}
