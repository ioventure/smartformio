import { FormInput } from "@components/input.base";
import { CheckboxInputOptions } from "./checkbox.type";

export class CheckboxInput extends FormInput {
    protected options: CheckboxInputOptions;

    constructor(options: CheckboxInputOptions) {
        super(options);
        this.options = options;
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('change', () => {
            this.validate();
        });
    }

    private validate(): void {
        const isChecked = (this.inputElement as HTMLInputElement).checked;
        const fieldName = this.options.name;

        this.clearErrorMessage(fieldName);

        // Required validation
        if (this.options.required && !isChecked) {
            this.setErrorMessage(fieldName, `${this.options.label ? this.options.label : 'Field'} is required.`);
        }

        // Custom validation
        if (this.options.customValidation && !this.options.customValidation(isChecked)) {
            this.setErrorMessage(fieldName, 'Custom validation failed.');
        }
    }
}
