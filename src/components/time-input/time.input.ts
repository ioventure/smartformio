import { FormInput } from "@components/input.base";
import { TimeInputOptions } from "./time.type";

export class TimeInput extends FormInput {
    protected options: TimeInputOptions;

    constructor(options: TimeInputOptions) {
        super(options);
        this.options = options;
    }

    protected setupValidation(): void {
        // Validate on input event for real-time feedback
        this.inputElement.addEventListener('input', () => this.validate());

        // Optional: Additional validation on blur event
        this.inputElement.addEventListener('blur', () => this.validate());
    }

    private validate(): void {
        const value = (this.inputElement as HTMLInputElement).value;
        const fieldName = this.options.name;

        this.clearErrorMessage(fieldName);

        // Required Field Validation
        if (this.options.required && !value) {
            this.setErrorMessage(fieldName, 'Time is required.');
        }

        // Time Format Validation (Ensure value is a valid time)
        if (!this.isValidTime(value)) {
            this.setErrorMessage(fieldName, 'Please enter a valid time in HH:MM format.');
        }

        // Min Time Validation
        if (this.options.min && value < this.options.min) {
            this.setErrorMessage(fieldName, `Time cannot be earlier than ${this.options.min}.`);
        }

        // Max Time Validation
        if (this.options.max && value > this.options.max) {
            this.setErrorMessage(fieldName, `Time cannot be later than ${this.options.max}.`);
        }
    }

    // Helper method to validate time format
    private isValidTime(time: string): boolean {
        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return timePattern.test(time);
    }
}
