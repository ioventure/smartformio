import { FormInput } from "@components/input.base";
import { WeekInputOptions } from "./week.type";

export class WeekInput extends FormInput {
    constructor(options: WeekInputOptions) {
        super(options);
    }


    protected setupValidation(): void {
        this.inputElement.addEventListener('input', () => {
            const value = (this.inputElement as HTMLInputElement).value;
            const fieldName = this.options.name;

            this.clearErrorMessage(fieldName);

            if (this.options.required && !value) {
                this.setErrorMessage(fieldName, 'Week is required.');
            }

            if (this.options.min && value < this.options.min) {
                this.setErrorMessage(fieldName, `Week cannot be earlier than ${this.options.min}.`);
            }

            if (this.options.max && value > this.options.max) {
                this.setErrorMessage(fieldName, `Week cannot be later than ${this.options.max}.`);
            }
        });
    }
}
