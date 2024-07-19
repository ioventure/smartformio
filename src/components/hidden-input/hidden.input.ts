import { FormInput } from "@components/input.base";
import { HiddenInputOptions } from "./hidden.type";

export class HiddenInput extends FormInput {
    constructor(options: HiddenInputOptions) {
        super(options);
    }

    protected setupValidation(): void {
        if (this.options.required) {
            this.inputElement.addEventListener('change', () => {
                const value = (this.inputElement as HTMLInputElement).value;
                const fieldName = this.options.name;

                this.clearErrorMessage(fieldName);

                if (this.options.required && value.trim() === '') {
                    this.setErrorMessage(fieldName, 'Field is required.');
                }
            });
        }
    }
}
