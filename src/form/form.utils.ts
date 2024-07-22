import { ButtonInput } from '@components/button-input/button.input';
import { ButtonInputOptions } from '@components/button-input/button.type';
import { CheckboxInput } from '@components/checkbox-input/checkbox.input';
import { ColorInput } from '@components/color-input/color.input';
import { DateInput } from '@components/date-input/date.input';
import { DateTimeInput } from '@components/datetime-input/datetime.input';
import { EmailInput } from '@components/email-input/email.input';
import { FileInput } from '@components/file-input/file.input';
import { HiddenInput } from '@components/hidden-input/hidden.input';
import { FormInput } from '@components/input.base';
import { InputOptions } from '@components/input.type';
import { MonthInput } from '@components/month-input/month.input';
import { NumberInput } from '@components/number-input/number.input';
import { PasswordInput } from '@components/password-input/password.input';
import { RadioInput } from '@components/radio-input/radio.input';
import { RangeInput } from '@components/range-input/range.input';
import { RangeInputOptions } from '@components/range-input/range.type';
import { SelectInput } from '@components/select-input/select.input';
import { TelInput } from '@components/tel-input/tel.input';
import { TextInput } from '@components/text-input/text.input';
import { TextareaInput } from '@components/textarea-input/textarea.input';
import { TimeInput } from '@components/time-input/time.input';
import { UrlInput } from '@components/url-input/url.input';
import { WeekInput } from '@components/week-input/week.input';
import { SmartForm } from './form.component';
import { FormConfig } from './form.type';
import { ApiService } from '@services/api/api.service';

/**
 * Utility class for handling form-related operations.
 */
export class FormUtils {
  private _smartForm: SmartForm;
  private _apiService: ApiService;

  /**
   * Creates an instance of FormUtils.
   * @param smartForm - Instance of the SmartForm.
   */
  constructor(smartForm: SmartForm, apiService: ApiService) {
    this._smartForm = smartForm;
    this._apiService = apiService;
  }

  /**
   * Creates an input element based on the provided configuration.
   * @param config - Configuration for the input element.
   * @returns Instance of FormInput or null if the type is not recognized.
   */
  createInput(config: InputOptions): FormInput | null {
    switch (config.type) {
      case 'text':
        return new TextInput(config);
      case 'email':
        return new EmailInput(config);
      case 'select':
        return new SelectInput(config, this._apiService);
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
        return new FileInput(config, this._apiService);
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

  /**
   * Creates a button element based on the provided configuration.
   * @param config - Configuration for the button element.
   * @returns Instance of ButtonInput or undefined if the button type is not recognized.
   */
  createButton(config: ButtonInputOptions): ButtonInput | undefined {
    switch (config.buttonType) {
      case 'submit':
      case 'reset':
        return new ButtonInput(config);
      default:
        return undefined;
    }
  }

  /**
   * Retrieves the form configuration.
   * @param config - Optional string representation of the configuration.
   * @returns Parsed configuration object or undefined if not available.
   */
  getConfig(config?: string): FormConfig | undefined {
    const _config =
      config || this._smartForm.getAttribute('config') || JSON.stringify({});
    if (_config) {
      return JSON.parse(_config);
    }
    return undefined;
  }

  /**
   * Extracts form data as a plain object.
   * @param form - HTMLFormElement from which to extract data.
   * @returns Plain object representing form data.
   */
  getFormData(form: HTMLFormElement) {
    const formData = new FormData(form);
    const data: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      // Ignore the File Data
      if (!(value instanceof File)) {
        data[key] = value;
      }
    });
    return data;
  }

  /**
   * Creates and dispatches a custom event.
   * @param eventName - Name of the event.
   * @param data - Data to be passed with the event.
   * @returns Boolean indicating whether the event was dispatched successfully.
   */
  createEvent(eventName: string, data: any): boolean {
    const submitEvent = new CustomEvent<any>(eventName, {
      detail: data,
      bubbles: true,
      composed: true,
    });
    return this._smartForm.dispatchEvent(submitEvent);
  }
}
