import { CheckboxInput } from '@components/checkbox-input/checkbox.input';
import { ColorInput } from '@components/color-input/color.input';
import { DateInput } from '@components/date-input/date.input';
import { DateTimeInput } from '@components/datetime-input/datetime.input';
import { EmailInput } from '@components/email-input/email.input';
import { FileInput } from '@components/file-input/file.input';
import { HiddenInput } from '@components/hidden-input/hidden.input';
import { FormInput } from '@components/input.base';
import { MonthInput } from '@components/month-input/month.input';
import { NumberInput } from '@components/number-input/number.input';
import { PasswordInput } from '@components/password-input/password.input';
import { RadioInput } from '@components/radio-input/radio.input';
import { RangeInput } from '@components/range-input/range.input';
import { SelectInput } from '@components/select-input/select.input';
import { TelInput } from '@components/tel-input/tel.input';
import { TextInput } from '@components/text-input/text.input';
import { TextareaInput } from '@components/textarea-input/textarea.input';
import { TimeInput } from '@components/time-input/time.input';
import { UrlInput } from '@components/url-input/url.input';
import { WeekInput } from '@components/week-input/week.input';
import { FormConfig } from './form.type';
import { RangeInputOptions } from '@components/range-input/range.type';
import { ButtonInput } from '@components/button-input/button.input';
import { InputOptions } from '@components/input.type';
import { ButtonInputOptions } from '@components/button-input/button.type';
import { ApiService } from '@services/api/api.service';
import { ApiRequestOption } from '@services/api/api.type';

export class PPForm extends HTMLElement {
  private _shadow: ShadowRoot;
  private _form?: HTMLFormElement;
  private _config?: FormConfig;
  private _submitButton?: ButtonInput;
  private _apiService: ApiService;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._apiService = new ApiService();
  }

  static get observedAttributes() {
    return ['config', 'styles'];
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (name === 'config' && oldValue !== newValue) {
      this._getAndSetConfig(newValue);
      if (this._config) {
        this._render(this._config);
      }
    }
    if (name === 'styles' && oldValue !== newValue) {
      this._setStyles(newValue);
    }
  }

  connectedCallback() {
    this._getAndSetConfig();
    if (this._config) {
      this._render(this._config);
      const styles = this.getAttribute('styles') || '';
      this._setStyles(styles);
    }
  }

  private _getAndSetConfig(config?: string) {
    const _config = config || this.getAttribute('config') || JSON.stringify({});
    if (config) {
      this._config = JSON.parse(_config);
    }
  }

  private _render(config: FormConfig) {
    this._form = document.createElement('form');
    this._shadow.innerHTML = '';
    this._renderInput(config.elements);
    this._renderButton(Object.values(config.actionButtons));
    this._form.addEventListener('submit', event => this._handleSubmit(event));
    this._shadow.appendChild(this._form);
  }

  private _renderInput(config: InputOptions[]) {
    config.forEach(inputConfig => {
      const inputElement = this._createInput(inputConfig);
      if (inputElement) {
        this._form?.appendChild(inputElement.render());
      }
    });
  }

  private _renderButton(config: ButtonInputOptions[]) {
    config.forEach(buttonConfig => {
      const buttonElement = this._createButton(buttonConfig);
      if (buttonElement) {
        this._form?.appendChild(buttonElement.render());
      }
    });
  }

  private _createInput(config: InputOptions): FormInput | ButtonInput | null {
    switch (config.type) {
      case 'text':
        return new TextInput(config);
      case 'email':
        return new EmailInput(config);
      case 'select':
        return new SelectInput(config);
      case 'password':
        return new PasswordInput(config);
      case 'number':
        return new NumberInput(config);
      case 'checkbox':
        return new CheckboxInput(config);
      case 'color':
        return new ColorInput(config);
      case 'date':
        return new DateInput(config);
      case 'datetime-local':
        return new DateTimeInput(config);
      case 'file':
        return new FileInput(config);
      case 'hidden':
        return new HiddenInput(config);
      case 'month':
        return new MonthInput(config);
      case 'radio':
        return new RadioInput(config);
      case 'range':
        return new RangeInput(config as RangeInputOptions);
      case 'tel':
        return new TelInput(config);
      case 'textarea':
        return new TextareaInput(config);
      case 'time':
        return new TimeInput(config);
      case 'url':
        return new UrlInput(config);
      case 'week':
        return new WeekInput(config);
      default:
        return null;
    }
  }

  private _createButton(config: ButtonInputOptions): ButtonInput | null {
    switch (config.buttonType) {
      case 'submit':
        this._submitButton = new ButtonInput(config);
        return this._submitButton;
      case 'reset':
        return new ButtonInput(config);
      default:
        return null;
    }
  }

  private async _handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    // Convert FormData to a plain object
    const data: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    // Handle API Calls
    if (this._config) {
      const apiOptions: ApiRequestOption = {
        ...this._config.submitApi,
        body: data,
      };
      this._submitButton?.showLoader(true);
      await this._apiService.request(apiOptions);
      this._submitButton?.showLoader(false);
    }
  }

  private _setStyles(styles: string) {
    const style = document.createElement('style');
    style.textContent = styles;
    this._shadow.appendChild(style);
  }
}

customElements.define('pp-form', PPForm);
