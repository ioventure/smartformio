import { FormInput } from "@components/input.base";
import { WeekInputOptions } from "./week.type";

export class WeekInput extends FormInput {
    protected options: WeekInputOptions;

    constructor(options: WeekInputOptions) {
        super(options);
        this.options = options;
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('input', () => this.validate());

        // Optional: Additional validation on blur event
        this.inputElement.addEventListener('blur', () => this.validate());
    }

    private validate(): void {
        const value = (this.inputElement as HTMLInputElement).value;
        const fieldName = this.options.name;

        this.clearErrorMessage(fieldName);

        // Required Field Validation
        if (this.options.required && !value.trim()) {
            this.setErrorMessage(fieldName, `${this.options.label ? this.options.label : 'Field'} is required.`);
            return;
        }

        // Week Format Validation (assumes ISO week format: YYYY-Www)
        if (value && !this.isValidWeek(value)) {
            this.setErrorMessage(fieldName, 'Please enter a valid week in format YYYY-Www.');
            return;
        }

        // Min Week Validation
        if (this.options.min && value < this.options.min) {
            this.setErrorMessage(fieldName, `Week cannot be earlier than ${this.options.min}.`);
            return;
        }

        // Max Week Validation
        if (this.options.max && value > this.options.max) {
            this.setErrorMessage(fieldName, `Week cannot be later than ${this.options.max}.`);
            return;
        }

        // Custom Validation
        if (this.options.customValidation && !this.options.customValidation(value)) {
            this.setErrorMessage(fieldName, 'Custom validation failed.');
        }
    }

    // Helper method to validate week format
    private isValidWeek(week: string): boolean {
        // Regex to match ISO week format: YYYY-Www (e.g., 2024-W30)
        const weekRegex = /^\d{4}-W[0-5][0-9]$/;
        return weekRegex.test(week);
    }
}
