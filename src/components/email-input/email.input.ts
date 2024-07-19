import { FormInput } from "@components/input.base";
import { EmailInputOptions } from "@components/email-input/email.type";

export class EmailInput extends FormInput {
    constructor(options: EmailInputOptions) {
        super(options);
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('keyup', () => {
            const value = this.inputElement.value;
            const fieldName = this.options.name;

            this.clearErrorMessage(fieldName);

            if (this.options.required && value.trim() === '') {
                this.setErrorMessage(fieldName, 'Field is required.');
            }

            if (!this.isValidEmail(value)) {
                this.setErrorMessage(fieldName, `Please enter valid ${fieldName}`);
            }

            if (this.options.customValidation && !this.options.customValidation(value)) {
                this.setErrorMessage(fieldName, 'Custom validation failed.');
            }
        });
    }

    protected isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}