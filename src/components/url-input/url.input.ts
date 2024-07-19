import { FormInput } from "@components/input.base";
import { UrlInputOptions } from "./url.type";

export class UrlInput extends FormInput {
    constructor(options: UrlInputOptions) {
        super(options);
    }


    protected setupValidation(): void {
        this.inputElement.addEventListener('input', () => {
            const value = (this.inputElement as HTMLInputElement).value;
            const fieldName = this.options.name;

            this.clearErrorMessage(fieldName);

            if (this.options.required && !value) {
                this.setErrorMessage(fieldName, 'URL is required.');
            }

            if (this.options.pattern && !this.options.pattern.test(value)) {
                this.setErrorMessage(fieldName, 'Please enter a valid URL.');
            }
        });
    }
}
