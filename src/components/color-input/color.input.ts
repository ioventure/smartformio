import { FormInput } from '@components/input.base';
import { ColorInputOptions } from './color.type';

export class ColorInput extends FormInput {
  protected options: ColorInputOptions;

  constructor(options: ColorInputOptions) {
    super(options);
    this.options = options;
  }

  protected setupValidation(): void {
    this.inputElement.addEventListener('input', () => {
      this._validate();
    });
  }

  private _validate(): void {
    const colorValue = (this.inputElement as HTMLInputElement).value;
    const fieldName = this.options.name;

    this.clearErrorMessage(fieldName);

    // Required validation
    if (this.options.required && !colorValue) {
      this.setErrorMessage(
        fieldName,
        `${this.options.label ? this.options.label : 'Field'} is required.`
      );
    }

    // Custom validation
    if (
      this.options.customValidation &&
      !this.options.customValidation(colorValue)
    ) {
      this.setErrorMessage(fieldName, 'Custom validation failed.');
    }
  }
}
