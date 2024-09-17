import { FormInput } from '@components/input.base';
import { RadioInputOptions } from './radio.type';

export class RadioInput extends FormInput {
  protected options: RadioInputOptions;
  private _parentInputContainer?: HTMLDivElement;

  constructor(options: RadioInputOptions) {
    super(options);
    this.options = options;
  }

  public render() {
    this._parentInputContainer = super.render();
    this._parentInputContainer.classList.add('radio-group');
    if (this._parentInputContainer && this._parentInputContainer.firstChild) {
      const firstChild = this._parentInputContainer.firstChild;
      if (firstChild.nodeName === 'INPUT') {
        this._parentInputContainer.removeChild(
          this._parentInputContainer.firstChild
        );
      } else {
        this._parentInputContainer.removeChild(
          this._parentInputContainer.children[1]
        );
      }
    }
    this._createOptions();
    return this._parentInputContainer;
  }

  protected setupValidation(): void {
    this.inputElement.addEventListener('change', () => this._validate());
  }

  private _validate(): void {
    const selected = (this.inputElement as HTMLDivElement).querySelector(
      'input[type="radio"]:checked'
    );
    const fieldName = this.options.name;

    this.clearErrorMessage(fieldName);

    if (this.options.required && !selected) {
      this.setErrorMessage(
        fieldName,
        `${this.options.label ? this.options.label : 'Field'} is required.`
      );
    }

    // Custom Validation
    if (
      this.options.customValidation &&
      !this.options.customValidation(selected)
    ) {
      this.setErrorMessage(fieldName, 'Custom validation failed.');
    }
  }

  private _createOptions() {
    this.options.options.forEach((option, index) => {
      const radioWrapper = document.createElement('div');
      radioWrapper.classList.add('radio-option');
      this.options = { ...this.options, ...option };
      super.createInputElement();
      super.createLabelElement();
      if (this.options.labelPosition && this.options.labelPosition === 'left') {
        radioWrapper.appendChild(this.labelElement!);
        radioWrapper.appendChild(this.inputElement);
      } else {
        radioWrapper.appendChild(this.inputElement);
        radioWrapper.appendChild(this.labelElement!);
      }
      if (
        this._parentInputContainer &&
        this._parentInputContainer.children &&
        this._parentInputContainer.children.length > 0
      ) {
        const lastElement =
          this._parentInputContainer.children[
            this._parentInputContainer.children.length - 1
          ];
        this._parentInputContainer.insertBefore(radioWrapper, lastElement);
      }
    });
  }
}