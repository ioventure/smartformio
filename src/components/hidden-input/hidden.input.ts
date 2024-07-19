import { FormInput } from "@components/input.base";
import { HiddenInputOptions } from "./hidden.type";

export class HiddenInput extends FormInput {
    protected options: HiddenInputOptions;

    constructor(options: HiddenInputOptions) {
        super(options);
        this.options = options;
    }

    protected setupValidation(): void {
        if (this.options.required) {
            this.validate();
        }
    }

    private validate(): void {
        const value = (this.inputElement as HTMLInputElement).value;
        const fieldName = this.options.name;

        this.clearErrorMessage(fieldName);

        if (this.options.required && value.trim() === '') {
            this.setErrorMessage(fieldName, `${this.options.label ? this.options.label : 'Field'} is required.`);
        }

        if (this.options.customValidation && !this.options.customValidation(value)) {
            this.setErrorMessage(fieldName, 'Custom validation failed.');
        }
    }
}
