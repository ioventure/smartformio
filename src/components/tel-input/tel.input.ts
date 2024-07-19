import { FormInput } from "@components/input.base";
import { TelInputOptions } from "./tel.type";

export class TelInput extends FormInput {
    protected options: TelInputOptions;

    constructor(options: TelInputOptions) {
        super(options);
        this.options = options;
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('input', () => {
            this.validate();
        });

        // Additional validation on blur or change events if required
        this.inputElement.addEventListener('blur', () => {
            this.validate();
        });
    }

    private validate(): void {
        const value = (this.inputElement as HTMLInputElement).value;
        const fieldName = this.options.name;

        this.clearErrorMessage(fieldName);

        // Required Field Validation
        if (this.options.required && value.trim() === '') {
            this.setErrorMessage(fieldName, `${this.options.label ? this.options.label : 'Field'} is required.`);
        }

        // Pattern Validation
        if (this.options.pattern && !new RegExp(this.options.pattern).test(value)) {
            this.setErrorMessage(fieldName, 'Please enter a valid phone number.');
        }

        // Custom Validation
        if (this.options.customValidation && !this.options.customValidation(value)) {
            this.setErrorMessage(fieldName, 'Custom validation failed.');
        }

        // Min/Max Length Validation
        if (this.options.minLength && value.length < this.options.minLength) {
            this.setErrorMessage(fieldName, `Phone number must be at least ${this.options.minLength} characters long.`);
        }

        if (this.options.maxLength && value.length > this.options.maxLength) {
            this.setErrorMessage(fieldName, `Phone number must be no more than ${this.options.maxLength} characters long.`);
        }
    }
}
