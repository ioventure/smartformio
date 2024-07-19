import { FormInput } from "@components/input.base";
import { TimeInputOptions } from "./time.type";

export class TimeInput extends FormInput {
    constructor(options: TimeInputOptions) {
        super(options);
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('input', () => {
            const value = (this.inputElement as HTMLInputElement).value;
            const fieldName = this.options.name;

            this.clearErrorMessage(fieldName);

            if (this.options.required && !value) {
                this.setErrorMessage(fieldName, 'Time is required.');
            }

            if (this.options.min && value < this.options.min) {
                this.setErrorMessage(fieldName, `Time cannot be earlier than ${this.options.min}.`);
            }

            if (this.options.max && value > this.options.max) {
                this.setErrorMessage(fieldName, `Time cannot be later than ${this.options.max}.`);
            }
        });
    }
}
