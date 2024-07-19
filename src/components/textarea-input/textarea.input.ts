import { FormInput } from "@components/input.base";
import { TextareaInputOptions } from "./textarea.type";

export class TextareaInput extends FormInput {
    constructor(options: TextareaInputOptions ) {
        super(options);
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('input', () => {
            const value = (this.inputElement as HTMLInputElement).value;
            const fieldName = this.options.name;

            this.clearErrorMessage(fieldName);

            if (this.options.required && value.trim() === '') {
                this.setErrorMessage(fieldName, 'This field is required.');
            }

            if (this.options.minLength && value.length < this.options.minLength) {
                this.setErrorMessage(fieldName, `Minimum length should be ${this.options.minLength}.`);
            }

            if (this.options.maxLength && value.length > this.options.maxLength) {
                this.setErrorMessage(fieldName, `Maximum length should be ${this.options.maxLength}.`);
            }

            if (this.options.pattern && !this.options.pattern.test(value)) {
                this.setErrorMessage(fieldName, `Please enter valid ${fieldName}.`);
            }

            if (this.options.customValidation && !this.options.customValidation(value)) {
                this.setErrorMessage(fieldName, 'Custom validation failed.');
            }
        });
    }
}
