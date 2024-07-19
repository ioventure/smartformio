import { FormInput } from "@components/input.base";
import { NumberInputOptions } from "./number.type";

export class NumberInput extends FormInput {
    protected options: NumberInputOptions;
    constructor(options: NumberInputOptions) {
        super(options);
        this.options = options;
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('keyup', () => {
            const value = (this.inputElement as HTMLInputElement).value;
            const fieldName = this.options.name;

            this.clearErrorMessage(fieldName);

            if (this.options.required && value.trim() === '') {
                this.setErrorMessage(fieldName, 'Field is required.');
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

            const numberValue = parseFloat(value);
            
            if (isNaN(numberValue)) {
                this.setErrorMessage(fieldName, 'Value must be a number.');
            } else {
                if (this.options.min !== undefined && numberValue < this.options.min) {
                    this.setErrorMessage(fieldName, `Value must be greater than or equal to ${this.options.min}.`);
                }

                if (this.options.max !== undefined && numberValue > this.options.max) {
                    this.setErrorMessage(fieldName, `Value must be less than or equal to ${this.options.max}.`);
                }
            }
        });
    }
}