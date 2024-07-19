import { FormInput } from "@components/input.base";
import { MonthInputOptions } from "./month.type";

export class MonthInput extends FormInput {
    constructor(options: MonthInputOptions) {
        super(options);
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('input', () => {
            const monthValue = (this.inputElement as HTMLInputElement).value;
            const fieldName = this.options.name;

            this.clearErrorMessage(fieldName);

            if (this.options.required && !monthValue) {
                this.setErrorMessage(fieldName, 'Month is required.');
            }

            if (this.options.min && new Date(monthValue + '-01') < new Date(this.options.min + '-01')) {
                this.setErrorMessage(fieldName, `Month cannot be earlier than ${this.options.min}.`);
            }

            if (this.options.max && new Date(monthValue + '-01') > new Date(this.options.max + '-01')) {
                this.setErrorMessage(fieldName, `Month cannot be later than ${this.options.max}.`);
            }
        });
    }
}
