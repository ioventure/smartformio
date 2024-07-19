import { FormInput } from "@components/input.base";
import { CheckboxInputOptions } from "./checkbox.type";

export class CheckboxInput extends FormInput {
    protected options: CheckboxInputOptions
    constructor(options: CheckboxInputOptions) {
        super(options);
        this.options = options;
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('change', () => {
            const isChecked = (this.inputElement as HTMLInputElement).checked;
            const fieldName = this.options.name;

            this.clearErrorMessage(fieldName);

            if (this.options.required && !isChecked) {
                this.setErrorMessage(fieldName, 'This checkbox is required.');
            }
        });
    }
}