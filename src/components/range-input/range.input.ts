import { FormInput } from "@components/input.base";
import { RangeInputOptions } from "./range.type";

export class RangeInput extends FormInput {
    constructor(options: RangeInputOptions) {
        super(options);
    }

  
    protected setupValidation(): void {
        this.inputElement.addEventListener('input', () => {
            const value = (this.inputElement as HTMLInputElement).valueAsNumber;
            const fieldName = this.options.name;

            this.clearErrorMessage(fieldName);

            if (this.options.required && isNaN(value)) {
                this.setErrorMessage(fieldName, 'Value is required.');
            }

            if (this.options.min !== undefined && value < +this.options.min) {
                this.setErrorMessage(fieldName, `Value cannot be less than ${this.options.min}.`);
            }

            if (this.options.max !== undefined && value > +this.options.max) {
                this.setErrorMessage(fieldName, `Value cannot be more than ${this.options.max}.`);
            }
        });
    }
}
