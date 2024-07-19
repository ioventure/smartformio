import { FormInput } from "@components/input.base";
import { DateTimeInputOptions } from "./datetime.type";

export class DateTimeInput extends FormInput {
    constructor(options: DateTimeInputOptions) {
        super(options);
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('input', () => {
            const dateTimeValue = (this.inputElement as HTMLInputElement).value;
            const fieldName = this.options.name;

            this.clearErrorMessage(fieldName);

            if (this.options.required && !dateTimeValue) {
                this.setErrorMessage(fieldName, 'Date and time are required.');
            }

            if (this.options.min && new Date(dateTimeValue) < new Date(this.options.min)) {
                this.setErrorMessage(fieldName, `Date and time cannot be earlier than ${this.options.min}.`);
            }

            if (this.options.max && new Date(dateTimeValue) > new Date(this.options.max)) {
                this.setErrorMessage(fieldName, `Date and time cannot be later than ${this.options.max}.`);
            }
        });
    }
}
