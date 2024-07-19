import { FormInput } from "@components/input.base";
import { FileInputOptions } from "./file.type";

export class FileInput extends FormInput {
    protected options: FileInputOptions;

    constructor(options: FileInputOptions) {
        super(options);
        this.options = options;
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('change', () => {
            this.validate();
        });
    }

    private validate(): void {
        let files = (this.inputElement as HTMLInputElement).files;
        const fieldName = this.options.name;
        this.clearErrorMessage(fieldName);
        if (!files) {
            files = new FileList();
        }
        // Required file validation
        if (this.options.required && (!files || files.length === 0)) {
            this.setErrorMessage(fieldName, 'File is required.');
            return;
        }
        // File type validation
        if (this.options.accept) {
            const acceptedTypes = this.options.accept.split(',').map(type => type.trim());
            for (let i = 0; i < files.length; i++) {
                if (!acceptedTypes.includes(files[i].type)) {
                    this.setErrorMessage(fieldName, `Invalid file type. Only ${this.options.accept} are allowed.`);
                    return;
                }
            }
        }
        // File size validation
        if (this.options.maxSize || this.options.minSize) {
            for (let i = 0; i < files.length; i++) {
                if (this.options.minSize && files[i].size < this.options.minSize) {
                    this.setErrorMessage(fieldName, `File is too small. Minimum size is ${this.options.minSize} bytes.`);
                    return;
                }
                if (this.options.maxSize && files[i].size > this.options.maxSize) {
                    this.setErrorMessage(fieldName, `File is too large. Maximum size is ${this.options.maxSize} bytes.`);
                    return;
                }
            }
        }
        // File count validation
        if (this.options.maxFiles !== undefined && files.length > this.options.maxFiles) {
            this.setErrorMessage(fieldName, `You can upload a maximum of ${this.options.maxFiles} files.`);
            return;
        }
        if (this.options.minFiles !== undefined && files.length < this.options.minFiles) {
            this.setErrorMessage(fieldName, `You must upload at least ${this.options.minFiles} files.`);
            return;
        }
    }
}
