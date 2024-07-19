import { FormInput } from '@components/input.base';
import { TextInputOptions } from '@components/text-input/text.type';

export class TextInput extends FormInput {
    protected options: TextInputOptions;

    constructor(options: TextInputOptions) {
        super(options);
        this.options = options;
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('input', () => {
            this.validate();
        });

        // Additional validation on blur event to handle cases when the user leaves the field
        this.inputElement.addEventListener('blur', () => {
            this.validate();
        });
    }

    private validate(): void {
        const value = this.inputElement.value;
        const fieldName = this.options.name;

        this.clearErrorMessage(fieldName);

        // Required Field Validation
        if (this.options.required && value.trim() === '') {
            this.setErrorMessage(fieldName, 'Field is required.');
        }

        // Min Length Validation
        if (this.options.minLength !== undefined && value.length < this.options.minLength) {
            this.setErrorMessage(fieldName, `Minimum length should be ${this.options.minLength}.`);
        }

        // Max Length Validation
        if (this.options.maxLength !== undefined && value.length > this.options.maxLength) {
            this.setErrorMessage(fieldName, `Maximum length should be ${this.options.maxLength}.`);
        }

        // Pattern Validation
        if (this.options.pattern && !new RegExp(this.options.pattern).test(value)) {
            this.setErrorMessage(fieldName, `Please enter a valid ${fieldName}.`);
        }

        // Custom Validation
        if (this.options.customValidation && !this.options.customValidation(value)) {
            this.setErrorMessage(fieldName, 'Custom validation failed.');
        }
    }
}
