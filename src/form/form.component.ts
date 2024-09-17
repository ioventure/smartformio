import {
  FormAttributes,
  FormConfig,
  FormDefaultConfig,
  FormElement,
  FormEvents,
  FormGroup,
} from './form.type';
import { ButtonInput } from '@components/button-input/button.input';
import { InputOptions } from '@components/input.type';
import { ButtonInputOptions } from '@components/button-input/button.type';
import { ApiService } from '@services/api/api.service';
import { ApiRequestOption } from '@services/api/api.type';
import { FormUtils } from './form.utils';

export class SmartForm extends HTMLElement {
  private _shadow: ShadowRoot;
  private _apiService: ApiService;
  private _defaultConfig: FormDefaultConfig;
  private _formUtils: FormUtils;
  private _formElement?: HTMLFormElement;
  private _formButtonElement?: ButtonInput;
  private _formConfig?: FormConfig;
  private _styleElement?: HTMLStyleElement;
  private _onSubmit?: Function;
  // static defaultConfig: FormDefaultConfig;
  static defaultConfig: FormDefaultConfig = {
    styles: '',
    api: {
      baseUrl: '',
    },
  };

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._defaultConfig = SmartForm.defaultConfig;
    this._apiService = new ApiService(this._defaultConfig.api);
    this._formUtils = new FormUtils(this, this._apiService);
  }

  /**
   * List of observed attributes for the component.
   */
  static get observedAttributes() {
    return [FormAttributes.CONFIG, FormAttributes.STYLES];
  }

  /**
   * Sets the default configuration for the form.
   * @param config - The default form configuration.
   */
  static setDefaultConfig(config: FormDefaultConfig) {
    SmartForm.defaultConfig = {
      ...SmartForm.defaultConfig,
      ...config,
    };
  }

  /**
   * Callback for attribute changes.
   * @param name - Name of the attribute.
   * @param oldValue - Old value of the attribute.
   * @param newValue - New value of the attribute.
   */
  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (name === FormAttributes.CONFIG && oldValue !== newValue) {
      this._formConfig = this._formUtils.getConfig(newValue);
      if (this._formConfig) {
        this._render(this._formConfig);
      }
    }
    if (name === FormAttributes.STYLES && oldValue !== newValue) {
      const style = newValue || this._defaultConfig.styles || '';
      this._setStyle(style);
    }
  }

  /**
   * Callback for when the component is added to the DOM.
   */
  connectedCallback() {
    this._formConfig = this._formUtils.getConfig();
    if (this._formConfig) {
      // this._render(this._formConfig);
      // this._setStyle();
      this._initializeEventListeners();
    }
  }

  /**
   * Renders the form based on the provided configuration.
   * @param config - The form configuration.
   */
  private _render(config: FormConfig) {
    this._initializeFormElement();
    this._initializeStyleElement();
    this._renderInputs(config.elements);
    this._renderButtons(config.actionButtons);
    this._shadow.appendChild(this._formElement!);
  }

  /**
   * Initializes the form element.
   */
  private _initializeFormElement() {
    this._formElement = document.createElement('form');
    this._shadow.innerHTML = '';
  }

  /**
   * Initializes the style element.
   */
  private _initializeStyleElement() {
    this._styleElement = document.createElement('style');
  }

  /**
   * Renders input elements based on the provided configuration.
   * @param elements - Array of input configurations.
   */
  private _renderInputs(elements: FormElement[], parentElement?: HTMLElement) {
    elements.forEach(element => {
      if (this._formUtils.isInputOptions(element)) {
        this._renderInput(element, parentElement);
      } else if (this._formUtils.isFormGroup(element)) {
        this._renderFormGroup(element, parentElement);
      }
    });
  }

  /**
   * Renders a single input element and appends it to the specified parent element.
   *
   * @param element - The input element configuration.
   * @param parentElement - The parent element to append the rendered input to.
   */
  private _renderInput(element: InputOptions, parentElement?: HTMLElement) {
    const inputElement = this._formUtils.createInput(element);
    if (inputElement) {
      (parentElement || this._formElement)?.appendChild(inputElement.render());
    }
  }

  /**
   * Renders a form group and its nested elements, then appends the group to the specified parent element.
   *
   * @param element - The form group configuration.
   * @param parentElement - The parent element to append the rendered group to.
   */
  private _renderFormGroup(element: FormGroup, parentElement?: HTMLElement) {
    const groupContainer = document.createElement('div');
    groupContainer.className = 'form-group';

    if (element.label) {
      const groupLabel = document.createElement('label');
      groupLabel.textContent = element.label;
      groupContainer.appendChild(groupLabel);
    }

    (parentElement || this._formElement)?.appendChild(groupContainer);
    this._renderInputs(element.elements, groupContainer);
  }

  /**
   * Renders button elements based on the provided configuration.
   * @param buttons - Object of button configurations.
   */
  private _renderButtons(buttons: { [key: string]: ButtonInputOptions }) {
    Object.values(buttons).forEach(buttonConfig => {
      this._formButtonElement = this._formUtils.createButton(buttonConfig);
      if (this._formButtonElement) {
        this._formElement?.appendChild(this._formButtonElement.render());
      }
    });
  }

  /**
   * Sets styles to the shadow DOM.
   * @param style - CSS styles as a string.
   */
  _setStyle(style?: string) {
    if (this._styleElement) {
      const _style =
        this.getAttribute('style') || this._defaultConfig.styles || '';
      this._styleElement.textContent = style || _style;
      this._shadow.appendChild(this._styleElement);
    }
  }

  /**
   * Handles form submission and sends data via the API service.
   * @param event - The submit event.
   */
  private async _handleSubmit(event: Event) {
    event.preventDefault();
    try {
      const form = event.target as HTMLFormElement;
      const formData = this._formUtils.getFormData(form, this._formConfig!);
      console.log(formData);
      // Handle API Calls
      if (this._formConfig) {
        const apiOptions: ApiRequestOption = {
          ...this._formConfig.submitApi,
          body: formData,
        };
        this._formButtonElement?.showLoader(true);
        const response = await this._apiService.request(apiOptions);
        this._formButtonElement?.showLoader(false);
        // Dispatch custom event with API response
        this._formUtils.createEvent(FormEvents.ON_SUBMIT, response);
        this._formElement?.reset();
      }
    } catch (error) {
      this._formButtonElement?.showLoader(false);
      this._formUtils.createEvent(FormEvents.ON_SUBMIT, error);
    }
  }

  /**
   * Initializes event listeners for the component.
   */
  private _initializeEventListeners() {
    this._formElement?.addEventListener(FormEvents.SUBMIT, event =>
      this._handleSubmit(event)
    );

    this.addEventListener(FormEvents.ON_SUBMIT, event => {
      if (this._onSubmit) this._onSubmit(event);
    });
  }

  /**
   * Sets the onSubmit callback function.
   * @param onSubmit - Callback function for form submission.
   */
  set onSubmit(onSubmit: Function) {
    this._onSubmit = onSubmit;
  }
}

customElements.define('smart-form', SmartForm);

(window as any).SmartForm = SmartForm;
