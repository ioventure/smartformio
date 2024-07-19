import { FormInput } from "@components/input.base";
import { DateInputOptions } from "./date.type";

export class DateInput extends FormInput {
    constructor(options: DateInputOptions) {
        super(options); 
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('keyup', () => {
            const dateValue = (this.inputElement as HTMLInputElement).value;
            const fieldName = this.options.name;

            this.clearErrorMessage(fieldName);

            if (this.options.required && !dateValue) {
                this.setErrorMessage(fieldName, 'Date is required.');
            }

            if (this.options.min && new Date(dateValue) < new Date(this.options.min)) {
                this.setErrorMessage(fieldName, `Date cannot be earlier than ${this.options.min}.`);
            }

            if (this.options.max && new Date(dateValue) > new Date(this.options.max)) {
                this.setErrorMessage(fieldName, `Date cannot be later than ${this.options.max}.`);
            }
        });
    }
}