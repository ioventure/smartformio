import { FormInput } from "@components/input.base";
import { MonthInputOptions } from "./month.type";

export class MonthInput extends FormInput {
    protected options: MonthInputOptions;

    constructor(options: MonthInputOptions) {
        super(options);
        this.options = options;
    }

    protected setupValidation(): void {
        // Handle validation on 'input' and 'change' events
        this.inputElement.addEventListener('input', () => this.validate());
        this.inputElement.addEventListener('change', () => this.validate());
    }

    private validate(): void {
        const monthValue = (this.inputElement as HTMLInputElement).value;
        const fieldName = this.options.name;

        this.clearErrorMessage(fieldName);

        // Required field validation
        if (this.options.required && !monthValue) {
            this.setErrorMessage(fieldName, `${this.options.label ? this.options.label : 'Field'} is required.`);
            return;
        }

        // Check if monthValue is a valid month format (YYYY-MM)
        if (!this.isValidMonthFormat(monthValue)) {
            this.setErrorMessage(fieldName, 'Please enter a valid month in the format YYYY-MM.');
            return;
        }

        // Date range validation
        const monthDate = new Date(monthValue + '-01');
        if (this.options.min && monthDate < new Date(this.options.min + '-01')) {
            this.setErrorMessage(fieldName, `Month cannot be earlier than ${this.options.min}.`);
        }

        if (this.options.max && monthDate > new Date(this.options.max + '-01')) {
            this.setErrorMessage(fieldName, `Month cannot be later than ${this.options.max}.`);
        }

        // Custom validation
        if (this.options.customValidation && !this.options.customValidation(monthValue)) {
            this.setErrorMessage(fieldName, 'Custom validation failed.');
        }
    }

    private isValidMonthFormat(value: string): boolean {
        // Validates if the input is in the format YYYY-MM
        const monthFormatRegex = /^\d{4}-\d{2}$/;
        return monthFormatRegex.test(value) && this.isValidMonthValue(value);
    }

    private isValidMonthValue(value: string): boolean {
        // Check if the value is a valid month and year
        const [year, month] = value.split('-').map(Number);
        return month >= 1 && month <= 12;
    }
}
