import { ButtonInputOptions } from './button.type';

/**
 * Class representing a button input element.
 */
export class ButtonInput {
  protected options: ButtonInputOptions;
  protected buttonElement!: HTMLButtonElement;

  /**
   * Constructs a new ButtonInput instance.
   * @param options - Options for configuring the button input element.
   */
  constructor(options: ButtonInputOptions) {
    this.options = options;
    this._createButtonElement();
  }

  /**
   * Renders the button element.
   * @returns The rendered HTML button element.
   */
  public render(): HTMLDivElement {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    buttonContainer.appendChild(this.buttonElement);
    return buttonContainer;
  }

  /**
   * Creates the input element for the button with specified options.
   */
  protected _createButtonElement(): void {
    this.buttonElement = document.createElement('button');
    this._setButtonAttributes();
  }

  /**
   * Sets button-specific attributes.
   */
  private _setButtonAttributes(): void {
    const { buttonType, name, label, disabled, id } = this.options;
    if (buttonType) {
      (this.buttonElement as HTMLButtonElement).type = buttonType;
    }
    if (name) {
      (this.buttonElement as HTMLButtonElement).name = name;
    }
    if (label) {
      (this.buttonElement as HTMLButtonElement).textContent = label;
    }
    if (disabled) {
      (this.buttonElement as HTMLButtonElement).disabled = disabled;
    }
    if (id) {
      (this.buttonElement as HTMLButtonElement).id = id;
    }
  }
}
