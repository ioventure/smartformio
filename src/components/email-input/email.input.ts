import { FormInput } from "@components/input.base";
import { EmailInputOptions } from "./email.type";

export class EmailInput extends FormInput {
    protected options: EmailInputOptions;

    constructor(options: EmailInputOptions) {
        super(options);
        this.options = options;
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('input', () => {
            this._validate();
        });
    }

    private _validate(): void {
        const value = (this.inputElement as HTMLInputElement).value;
        const fieldName = this.options.name;

        this.clearErrorMessage(fieldName);

        // Required field validation
        if (this.options.required && value.trim() === '') {
            this.setErrorMessage(fieldName, `${this.options.label ? this.options.label : 'Field'} is required.`);
        }

        // Email format validation
        if (!this.isValidEmail(value)) {
            this.setErrorMessage(fieldName, `Please enter a valid ${fieldName}.`);
        }

        // Min length validation
        if (this.options.minLength !== undefined && value.length < this.options.minLength) {
            this.setErrorMessage(fieldName, `Email must be at least ${this.options.minLength} characters long.`);
        }

        // Max length validation
        if (this.options.maxLength !== undefined && value.length > this.options.maxLength) {
            this.setErrorMessage(fieldName, `Email cannot exceed ${this.options.maxLength} characters.`);
        }

        // Pattern validation
        if (this.options.pattern && !new RegExp(this.options.pattern).test(value)) {
            this.setErrorMessage(fieldName, 'Email does not match the required pattern.');
        }

        // Custom validation
        if (this.options.customValidation && !this.options.customValidation(value)) {
            this.setErrorMessage(fieldName, 'Custom validation failed.');
        }
    }

    protected isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
