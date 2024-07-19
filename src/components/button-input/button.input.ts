import { ButtonInputOptions } from "./button.type";

/**
 * Class representing a button input element.
 */
export class ButtonInput {
    protected options: ButtonInputOptions;
    protected inputElement!: HTMLButtonElement;

    /**
     * Constructs a new ButtonInput instance.
     * @param options - Options for configuring the button input element.
     */
    constructor(options: ButtonInputOptions) {
        this.options = options;
        this.createInputElement();
    }

    /**
     * Renders the button element.
     * @returns The rendered HTML button element.
     */
    public render(): HTMLButtonElement {
        return this.inputElement;
    }


    /**
     * Creates the input element for the button with specified options.
     */
    protected createInputElement(): void {
        this.inputElement = document.createElement('button');
        this._setButtonAttributes();
    }

    /**
     * Sets button-specific attributes.
     */
    private _setButtonAttributes(): void {
        const { buttonType, name, label, disabled, id } = this.options;
        if (buttonType) {
            (this.inputElement as HTMLButtonElement).type = buttonType;
        }
        if (name) {
            (this.inputElement as HTMLButtonElement).name = name;
        }
        if (label) {
            (this.inputElement as HTMLButtonElement).textContent = label;
        }
        if (disabled) {
            (this.inputElement as HTMLButtonElement).disabled = disabled;
        }
        if (id) {
            (this.inputElement as HTMLButtonElement).id = id;
        }

    }
}
