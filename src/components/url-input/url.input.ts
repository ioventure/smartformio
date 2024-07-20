import { FormInput } from '@components/input.base';
import { UrlInputOptions } from './url.type';

export class UrlInput extends FormInput {
  protected options: UrlInputOptions;

  constructor(options: UrlInputOptions) {
    super(options);
    this.options = options;
  }

  protected setupValidation(): void {
    // Validate on input event for real-time feedback
    this.inputElement.addEventListener('input', () => this._validate());

    // Optional: Additional validation on blur event
    this.inputElement.addEventListener('blur', () => this._validate());
  }

  private _validate(): void {
    const value = (this.inputElement as HTMLInputElement).value;
    const fieldName = this.options.name;

    this.clearErrorMessage(fieldName);

    // Required Field Validation
    if (this.options.required && !value.trim()) {
      this.setErrorMessage(
        fieldName,
        `${this.options.label ? this.options.label : 'Field'} is required.`
      );
    }

    // URL Format Validation
    if (value && !this._isValidUrl(value)) {
      this.setErrorMessage(fieldName, 'Please enter a valid URL.');
    }

    // Custom Validation
    if (
      this.options.customValidation &&
      !this.options.customValidation(value)
    ) {
      this.setErrorMessage(fieldName, 'Custom validation failed.');
    }
  }

  // Helper method to validate URL format
  private _isValidUrl(url: string): boolean {
    try {
      // Check if URL is valid using the URL constructor
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
