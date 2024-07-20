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
import { FormConfig, FormConfigs } from './form.type';
import { RangeInputOptions } from '@components/range-input/range.type';
import { ButtonInput } from '@components/button-input/button.input';

export class PPForm extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['config', 'styles'];
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (name === 'config' && oldValue !== newValue) {
      this._render(JSON.parse(newValue));
    }
    if (name === 'styles' && oldValue !== newValue) {
      this._setStyles(newValue);
    }
  }

  connectedCallback() {
    const config = this.getAttribute('config');
    if (config) {
      this._render(JSON.parse(config));
    }
    const styles = this.getAttribute('styles') || '';
    if (config) {
      this._setStyles(styles);
    }
  }

  private _render(config: FormConfigs) {
    this.shadow.innerHTML = ''; // Clear previous content
    let form = document.createElement('form');

    config.forEach(inputConfig => {
      const inputElement = this._createInput(inputConfig);
      if (inputElement) {
        form.appendChild(inputElement.render());
      }
    });

    // Attach submit event listener
    form.addEventListener('submit', event => this._handleSubmit(event));

    this.shadow.appendChild(form);
  }

  private _createInput(config: FormConfig): FormInput | ButtonInput | null {
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
      case 'button':
        return new ButtonInput(config);
      default:
        return null;
    }
  }

  private _handleSubmit(event: Event) {
    event.preventDefault(); // Prevent the default form submission
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Convert FormData to a plain object
    const data: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    console.log('Form Data Submitted:', data);
    // You can handle the form data here (e.g., send it to a server)
  }

  private _setStyles(styles: string) {
    const style = document.createElement('style');
    style.textContent = styles;
    this.shadow.appendChild(style);
  }
}

customElements.define('pp-form', PPForm);
