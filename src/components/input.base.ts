import { TextareaInputOptions } from "@components/textarea-input/textarea.type";
import { InputOptions, NumberInputBaseOptions, TextInputBaseOptions } from "./input.type";

/**
 * Abstract class representing a form input element with validation and error handling.
 */
export abstract class FormInput {
    protected inputElement!: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    protected labelElement?: HTMLLabelElement;
    protected options: InputOptions;
    protected errorMessages: { [key: string]: string } = {};
    private _inputErrorElement!: HTMLDivElement;

    /**
     * Constructs a new FormInput instance.
     * @param options - Options for configuring the input element.
     */
    constructor(options: InputOptions) {
        this.options = options;
        this.createInputElement();
        this.createLabelElement();
        this.setupValidation();
        this._createInputErrorElement();
        this._handleInputError();
    }

    /**
     * Abstract method to be implemented by subclasses for setting up validation rules.
     */
    protected abstract setupValidation(): void;

    /**
     * Renders the input element.
     * @returns The rendered HTML element.
     */
    public render(): HTMLDivElement {
        const inputContainer = document.createElement('div');
        inputContainer.classList.add('input-container');
        if (this.labelElement) {
            const labelContainer = document.createElement('div');
            labelContainer.classList.add('label-container');
            switch (this.options.labelPosition) {
                case 'top':
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
        if (this._inputErrorElement) {
            inputContainer.appendChild(this._inputErrorElement);
        }
        return inputContainer;
    }

    /**
     * Creates the input element with specified options.
     */
    protected createInputElement(): void {
        const { type } = this.options;
        switch (type) {
            case 'select':
                this.inputElement = document.createElement('select');
                break;
            case 'textarea':
                this.inputElement = document.createElement('textarea');
                this._setTextareaAttributes();
                break;
            case 'text':
            case 'password':
            case 'email':
            case 'tel':
            case 'url':
            case 'date':
            case 'datetime-local':
            case 'month':
            case 'time':
            case 'week':
            case 'file':
            case 'hidden':
            case 'color':
            case 'radio':
            case 'checkbox':
                this.inputElement = document.createElement('input');
                (this.inputElement as HTMLInputElement).type = type;
                this._setTextAttributes();
                break;
            case 'number':
            case 'range':
                this.inputElement = document.createElement('input');
                (this.inputElement as HTMLInputElement).type = type;
                this._setNumberAttributes();
                break;
            default:
                throw new Error(`Unsupported input type: ${type}`);
        }
        this._setCommonAttributes();
    }

    /**
     * Creates the label element based on options.
     */
    protected createLabelElement(): void {
        if (this.options.label) {
            this.labelElement = document.createElement('label');
            this.labelElement.classList.add('label');
            this.labelElement.textContent = this.options.label;
            if (this.inputElement.id) {
                this.labelElement.setAttribute('for', this.inputElement.id);
            }
        }
    }

    /**
     * Sets an error message for the specified field.
     * @param fieldName - The name of the field.
     * @param message - The error message to display.
     */
    protected setErrorMessage(fieldName: string, message: string): void {
        this.errorMessages[fieldName] = message;
        this._displayError();
    }

     /**
     * Clears the error message for the specified field.
     * @param fieldName - The name of the field.
     */
     protected clearErrorMessage(fieldName: string): void {
        delete this.errorMessages[fieldName];
        this._displayError();
    }

     /**
     * Creates the error message element.
     */
    private _createInputErrorElement(): void {
        this._inputErrorElement = document.createElement('div');
        this._inputErrorElement.setAttribute('role', 'alert');
        this._inputErrorElement.classList.add('error-message');
    }

    /**
     * Handles input element errors and updates error display accordingly.
     */
    private _handleInputError(): void {
        this.inputElement.addEventListener('input', () => this._displayError());
        this.inputElement.addEventListener('invalid', (event) => {
            event.preventDefault();
            this._displayError();
        });
    }

    /**
     * Displays error messages if present.
     */
    private _displayError(): void {
        const fieldName = this.options.name;
        const errorMessage = this.errorMessages[fieldName];
        if (errorMessage) {
            this._inputErrorElement.textContent = errorMessage;
            this.inputElement.setCustomValidity(errorMessage);
        } else {
            this._inputErrorElement.textContent = '';
            this.inputElement.setCustomValidity('');
        }
        if (!this._inputErrorElement.parentNode && this.inputElement.parentNode) {
            this.inputElement.parentNode.insertBefore(this._inputErrorElement, this.inputElement.nextSibling);
        }
    }

    /**
     * Set common attributes to the input element.
     */
    private _setCommonAttributes(): void {
        const { name, placeholder, required, value } = this.options;
        if (name) {
            this.inputElement.setAttribute('name', name);
        }
        if (placeholder) {
            this.inputElement.setAttribute('placeholder', placeholder);
        }
        if (required) {
            this.inputElement.setAttribute('required', 'true');
        }
        if (value) {
            (this.inputElement as HTMLInputElement).value = value;
        }
    }

    /**
     * Set text-specific attributes.
     */
    private _setTextAttributes(): void {
        const { minLength, maxLength, pattern } = this.options as TextInputBaseOptions;
        if (minLength !== undefined) {
            (this.inputElement as HTMLInputElement).setAttribute('minLength', minLength.toString());
        }
        if (maxLength !== undefined) {
            (this.inputElement as HTMLInputElement).setAttribute('maxLength', maxLength.toString());
        }
        if (pattern) {
            (this.inputElement as HTMLInputElement).setAttribute('pattern', pattern.source);
        }
    }

    /**
     * Set number-specific attributes.
     */
    private _setNumberAttributes(): void {
        const { pattern, min, max } = this.options as NumberInputBaseOptions;
        if (min !== undefined) {
            (this.inputElement as HTMLInputElement).setAttribute('min', min.toString());
        }
        if (max !== undefined) {
            (this.inputElement as HTMLInputElement).setAttribute('max', max.toString());
        }
        if (pattern) {
            (this.inputElement as HTMLInputElement).setAttribute('pattern', pattern.source);
        }
    }

    /**
     * Set textarea-specific attributes.
     */
    private _setTextareaAttributes(): void {
        const { rows, cols } = this.options as TextareaInputOptions;
        if (rows !== undefined) {
            (this.inputElement as HTMLTextAreaElement).rows = rows;
        }
        if (cols !== undefined) {
            (this.inputElement as HTMLTextAreaElement).cols = cols;
        }
    }
}