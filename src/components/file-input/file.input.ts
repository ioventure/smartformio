import { FormInput } from "@components/input.base";
import { FileInputOptions } from "./file.type";

export class FileInput extends FormInput {
    constructor(options: FileInputOptions) {
        super(options);
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('change', () => {
            const files = (this.inputElement as HTMLInputElement).files;
            const fieldName = this.options.name;

            this.clearErrorMessage(fieldName);

            if (this.options.required && (!files || files.length === 0)) {
                this.setErrorMessage(fieldName, 'File is required.');
            }
        });
    }
}
