import { FormInput } from "@components/input.base";
import { DateTimeInputOptions } from "./datetime.type";

export class DateTimeInput extends FormInput {
    protected options: DateTimeInputOptions;

    constructor(options: DateTimeInputOptions) {
        super(options);
        this.options = options;
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('input', () => {
            this.validate();
        });
    }

    private validate(): void {
        const dateTimeValue = (this.inputElement as HTMLInputElement).value;
        const fieldName = this.options.name;

        this.clearErrorMessage(fieldName);

        // Required validation
        if (this.options.required && !dateTimeValue) {
            this.setErrorMessage(fieldName, `${this.options.label ? this.options.label : 'Field'} is required.`);
        }

        // Minimum date and time validation
        if (this.options.min && new Date(dateTimeValue) < new Date(this.options.min)) {
            this.setErrorMessage(fieldName, `Date and time cannot be earlier than ${this.options.min}.`);
        }

        // Maximum date and time validation
        if (this.options.max && new Date(dateTimeValue) > new Date(this.options.max)) {
            this.setErrorMessage(fieldName, `Date and time cannot be later than ${this.options.max}.`);
        }

        // Custom validation
        if (this.options.customValidation && !this.options.customValidation(dateTimeValue)) {
            this.setErrorMessage(fieldName, 'Custom validation failed.');
        }
    }
}
