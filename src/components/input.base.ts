/**
 * Abstract class representing a form input element with validation and error handling.
 */
export abstract class FormInput {
    protected inputElement!: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    protected labelElement?: HTMLLabelElement;
    private inputErrorElement!: HTMLDivElement;
    protected options: InputOptions;
    protected errorMessages: InputErrorMessages;

    /**
     * Constructs a new FormInput instance.
     * @param options - Options for configuring the input element.
     */
    constructor(options: InputOptions) {
        this.options = options;
        this.errorMessages = {};
        this.createInputElement();
        this.createLabelElement();
        this.createInputErrorElement();
        this.setupValidation();
        this.handleInputElementError();
    }

    /**
     * Renders the input element.
     * @returns The rendered HTMLInputElement.
     */
    public render() {
        const inputContainer = document.createElement('div');
        inputContainer.classList.add('input-container');
        if (this.labelElement) {
            switch (this.options.labelPosition) {
                case 'top':
                    const labelContainer = document.createElement('div');
                    labelContainer.classList.add('label-container')
                    labelContainer.appendChild(this.labelElement);
                    inputContainer.appendChild(labelContainer);
                    inputContainer.appendChild(this.inputElement);
                    break;
                case 'left':
                    inputContainer.appendChild(this.labelElement);
                    inputContainer.appendChild(this.inputElement);
                    break;
                case 'right':
                    inputContainer.appendChild(this.inputElement);
                    inputContainer.appendChild(this.labelElement);
                    break;
            }
        } else {
            inputContainer.appendChild(this.inputElement);
        }

        if (this.inputErrorElement) {
            inputContainer.appendChild(this.inputErrorElement);
        }

        return inputContainer;
    }

    /**
     * Abstract method to be implemented by subclasses for setting up validation rules.
     */
    protected abstract setupValidation(): void;

    /**
     * Sets an error message for the specified field.
     * @param fieldName - The name of the field.
     * @param message - The error message to display.
     */
    protected setErrorMessage(fieldName: string, message: string): void {
        this.errorMessages[fieldName] = message;
        this.displayError();
    }

    /**
     * Clears the error message for the specified field.
     * @param fieldName - The name of the field.
     */
    protected clearErrorMessage(fieldName: string): void {
        delete this.errorMessages[fieldName];
        this.displayError();
    }

    /**
     * Handles input element errors and updates error display accordingly.
     */
    private handleInputElementError(): void {
        this.inputElement.addEventListener('input', () => {
            this.displayError();
        });

        this.inputElement.addEventListener('invalid', (event) => {
            event.preventDefault();
            this.displayError();
        });
    }

    /**
     * Displays error messages if present.
     */
    private displayError(): void {
        const fieldName = this.options.name;
        const errorMessage = this.errorMessages[fieldName];
        if (errorMessage) {
            this.inputErrorElement.textContent = errorMessage;
            this.inputElement.setCustomValidity(errorMessage);
        } else {
            this.inputErrorElement.textContent = '';
            this.inputElement.setCustomValidity('');
        }
        if (!this.inputErrorElement.parentNode && this.inputElement.parentNode) {
            this.inputElement.parentNode.insertBefore(this.inputErrorElement, this.inputElement.nextSibling);
        }
    }

    /**
     * Creates the error message element.
     */
    private createInputErrorElement() {
        this.inputErrorElement = document.createElement('div');
        this.inputErrorElement.setAttribute('role', 'alert');
        this.inputErrorElement.classList.add('error-message');
    }

    protected createLabelElement() {
        if (this.options.label) {
            this.labelElement = document.createElement('label');
            this.labelElement.classList.add('label')
            this.labelElement.textContent = this.options.label;
            if (this.inputElement.id) {
                this.labelElement.setAttribute('for', this.inputElement.id);
            }
        }
    }

    /**
     * Creates the input element with specified options.
     */
    protected createInputElement() {
        if (this.options.type && this.options.type === 'select') {
            this.inputElement = document.createElement('select');
        } else if (this.options.type && this.options.type === 'textarea') {
            this.inputElement = document.createElement('textarea');
        }else {
            this.inputElement = document.createElement('input');
        }
        if (this.options.type && this.options.type !== 'select' && this.options.type !== 'textarea') {
            this.inputElement.setAttribute('type', this.options.type);
        }
        if (this.options.name) {
            this.inputElement.setAttribute('name', this.options.name);
        }
        if (this.options.value) {
            this.inputElement.setAttribute('value', this.options.value);
        }
        if (this.options.placeholder) {
            this.inputElement.setAttribute('placeholder', this.options.placeholder || '');
        }
        if (this.options.required) {
            this.inputElement.setAttribute('required', 'true');
        }
        if (this.options.minLength) {
            this.inputElement.setAttribute('minLength', this.options.minLength.toString());
        }
        if (this.options.maxLength && this.options.maxLength !== Infinity) {
            this.inputElement.setAttribute('maxLength', this.options.maxLength.toString());
        }
        if (this.options.pattern) {
            this.inputElement.setAttribute('pattern', this.options.pattern.source);
        }
        if (this.options.min !== undefined) {
            this.inputElement.setAttribute('min', this.options.min.toString());
        }
        if (this.options.max !== undefined) {
            this.inputElement.setAttribute('max', this.options.max.toString());
        }
        if (this.options.rows) {
            this.inputElement.setAttribute('rows', this.options.rows.toString());
        }
        if (this.options.cols) {
            this.inputElement.setAttribute('cols', this.options.cols.toString());
        }
    }
}
