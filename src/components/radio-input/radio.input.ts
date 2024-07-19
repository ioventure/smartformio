import { FormInput } from "@components/input.base";
import { RadioInputOptions } from "./radio.type";

export class RadioInput extends FormInput {
    protected options: RadioInputOptions;
    private parentInputContainer?: HTMLDivElement;

    constructor(options: RadioInputOptions) {
        super(options);
        this.options = options;
    }

    public render() {
        this.parentInputContainer = super.render();
        this.parentInputContainer.classList.add('radio-group');
        if (this.parentInputContainer && this.parentInputContainer.firstChild) {
            const firstChild = this.parentInputContainer.firstChild;
            if (firstChild.nodeName === 'INPUT') {
                this.parentInputContainer.removeChild(this.parentInputContainer.firstChild);
            } else {
                this.parentInputContainer.removeChild(this.parentInputContainer.children[1]);
            }
        }
        this.createOptions();
        return this.parentInputContainer;
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('change', () => this.validate());
    }

    private validate(): void {
        const selected = (this.inputElement as HTMLDivElement).querySelector('input[type="radio"]:checked');
        const fieldName = this.options.name;

        this.clearErrorMessage(fieldName);

        if (this.options.required && !selected) {
            this.setErrorMessage(fieldName, 'Selection is required.');
        }

        // Custom Validation
        if (this.options.customValidation && !this.options.customValidation(selected)) {
            this.setErrorMessage(fieldName, 'Custom validation failed.');
        }
    }

    private createOptions() {
        this.options.options.forEach((option, index) => {
            const radioWrapper = document.createElement('div');
            radioWrapper.classList.add('radio-option');
            this.options = { ...this.options, ...option }
            super.createInputElement();
            super.createLabelElement();
            if (this.options.labelPosition && this.options.labelPosition === 'left') {
                radioWrapper.appendChild(this.labelElement!);
                radioWrapper.appendChild(this.inputElement);
            } else {
                radioWrapper.appendChild(this.inputElement);
                radioWrapper.appendChild(this.labelElement!);
            }
            if (this.parentInputContainer && this.parentInputContainer.children && this.parentInputContainer.children.length > 0) {
                const lastElement = this.parentInputContainer.children[this.parentInputContainer.children.length - 1]
                this.parentInputContainer.insertBefore(radioWrapper, lastElement)
            }
        });
    }
}
