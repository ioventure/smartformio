import { FormInput } from "@components/input.base";
import { TelInputOptions } from "./tel.type";

export class TelInput extends FormInput {
    constructor(options: TelInputOptions) {
        super(options);
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('input', () => {
            const value = (this.inputElement as HTMLInputElement).value;
            const fieldName = this.options.name;

            this.clearErrorMessage(fieldName);

            if (this.options.required && value.trim() === '') {
                this.setErrorMessage(fieldName, 'Phone number is required.');
            }

            if (this.options.pattern && !this.options.pattern.test(value)) {
                this.setErrorMessage(fieldName, 'Please enter a valid phone number.');
            }
        });
    }
}
