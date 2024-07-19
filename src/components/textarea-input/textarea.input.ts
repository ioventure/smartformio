import { FormInput } from "@components/input.base";
import { TextareaInputOptions } from "./textarea.type";

export class TextareaInput extends FormInput {
    protected options: TextareaInputOptions;

    constructor(options: TextareaInputOptions) {
        super(options);
        this.options = options;
    }

    protected setupValidation(): void {
        // Use 'input' event to handle real-time validation
        this.inputElement.addEventListener('input', () => this.validate());

        // Optional: Additional validation on 'blur' event
        this.inputElement.addEventListener('blur', () => this.validate());
    }

    private validate(): void {
        const value = (this.inputElement as HTMLTextAreaElement).value;
        const fieldName = this.options.name;

        this.clearErrorMessage(fieldName);

        // Required Field Validation
        if (this.options.required && value.trim() === '') {
            this.setErrorMessage(fieldName, 'This field is required.');
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

        // Handle additional optional validations
        if (this.options.maxWords) {
            const wordCount = value.split(/\s+/).filter(Boolean).length;
            if (wordCount > this.options.maxWords) {
                this.setErrorMessage(fieldName, `Maximum word count is ${this.options.maxWords}.`);
            }
        }

        if (this.options.minWords) {
            const wordCount = value.split(/\s+/).filter(Boolean).length;
            if (wordCount < this.options.minWords) {
                this.setErrorMessage(fieldName, `Minimum word count is ${this.options.minWords}.`);
            }
        }
    }
}
