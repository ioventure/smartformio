import { FormInput } from "@components/input.base";
import { ColorInputOptions } from "./color.type";

export class ColorInput extends FormInput {
    protected options: ColorInputOptions;
    constructor(options: ColorInputOptions) {
        super(options); 
        this.options = options;
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('keyup', () => {
            const colorValue = (this.inputElement as HTMLInputElement).value;
            const fieldName = this.options.name;

            this.clearErrorMessage(fieldName);

            if (this.options.required && !colorValue) {
                this.setErrorMessage(fieldName, 'Color selection is required.');
            }
        });
    }
}
