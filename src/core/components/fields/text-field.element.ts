/**
 * @file Text field element implementation
 */

import { Field } from '@domain/field';
import { BaseFieldElement } from '@components/base/field-element.base';
import { IEventHandler } from '@interfaces/events/event-handler.interface';
import { DOMUtils, ValidationUtils, ErrorUtils } from '@utils/index';
import {
  COMPONENT_PARTS,
  INPUT_TYPES,
  VALIDATION_MESSAGES,
} from '@core/constants/component.constants';

export class TextFieldElement extends BaseFieldElement {
  private container: HTMLElement | null = null;
  private inputWrapper: HTMLElement | null = null;

  public static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'type', 'pattern', 'minlength', 'maxlength'];
  }

  constructor(eventHandler: IEventHandler) {
    super(eventHandler);
  }

  /**
   * Implement required render method
   */
  protected override render(): void {
    if (!this.field) return;

    // Clear existing content
    this.shadow.innerHTML = '';

    // Create container
    this.container = DOMUtils.createElement('div', {
      part: COMPONENT_PARTS.field.root,
    });
    this.shadow.appendChild(this.container);

    // Render field content
    this.renderFieldContent(this.field, this.container);
  }

  /**
   * Create text input element
   */
  protected override createInputElement(field: Field): HTMLElement {
    const config = field.config as any;

    // Create wrapper
    this.inputWrapper = DOMUtils.createElement('div', {
      part: COMPONENT_PARTS.field.inputWrapper,
    });

    // Create properties object with only defined values
    const properties: Partial<HTMLInputElement | HTMLTextAreaElement> = {
      name: field.name,
    };

    // Add optional properties only if they are defined
    if (field.config.placeholder) properties.placeholder = field.config.placeholder;
    if (field.config.required) properties.required = true;
    if (field.config.disabled) properties.disabled = true;
    if (field.config.readonly) properties.readOnly = true;
    if (field.value.raw !== undefined) properties.value = field.value.raw;

    // Create input element
    const input = DOMUtils.createElement(
      config.type === INPUT_TYPES.textarea ? 'textarea' : 'input',
      {
        properties,
        part: COMPONENT_PARTS.field.input,
      }
    );

    // Set type attribute for input elements
    if (input instanceof HTMLInputElement) {
      input.setAttribute('type', config.type || INPUT_TYPES.text);
    }

    this.inputElement = input;

    // Set validation attributes
    if (config.validation && input instanceof HTMLInputElement) {
      if (config.validation.pattern) {
        input.pattern = config.validation.pattern;
      }
      if (config.validation.minLength) {
        input.minLength = config.validation.minLength;
      }
      if (config.validation.maxLength) {
        input.maxLength = config.validation.maxLength;
      }
      if (config.type === INPUT_TYPES.number) {
        if (config.validation.min !== undefined) {
          input.min = String(config.validation.min);
        }
        if (config.validation.max !== undefined) {
          input.max = String(config.validation.max);
        }
      }
    }

    // Add event listeners
    this.addInputEventListeners(input);

    // Add icons if specified
    if (config.leadingIcon) {
      const leadingIcon = DOMUtils.createIcon(config.leadingIcon, {
        part: 'leading-icon',
      });
      this.inputWrapper.appendChild(leadingIcon);
    }

    this.inputWrapper.appendChild(input);

    if (config.trailingIcon) {
      const trailingIcon = DOMUtils.createIcon(config.trailingIcon, {
        part: 'trailing-icon',
      });
      this.inputWrapper.appendChild(trailingIcon);
    }

    return this.inputWrapper;
  }

  /**
   * Add input-specific event listeners
   */
  private addInputEventListeners(input: HTMLInputElement | HTMLTextAreaElement): void {
    // Handle input events
    input.addEventListener('input', () => {
      this.handleFieldChange(input.value);
    });

    // Handle focus/blur
    input.addEventListener('focus', () => {
      DOMUtils.updatePart(input, { add: ['focused'] });
      if (this.inputWrapper) {
        DOMUtils.updatePart(this.inputWrapper, { add: ['focused'] });
      }
    });

    input.addEventListener('blur', () => {
      DOMUtils.updatePart(input, { remove: ['focused'] });
      if (this.inputWrapper) {
        DOMUtils.updatePart(this.inputWrapper, { remove: ['focused'] });
      }
      if (this.field) {
        this.field.markAsTouched();
        this.updateFieldState(this.field);
      }
    });

    // Handle keyboard events
    input.addEventListener('keydown', ((event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === 'Enter') {
        // Prevent form submission on enter for textarea
        if (input instanceof HTMLTextAreaElement) {
          event.stopPropagation();
        }
        // Prevent form submission on enter if there are other fields
        else if (this.form && this.form.fields.length > 1) {
          event.preventDefault();
        }
      }
    }) as EventListener);
  }

  /**
   * Update field content implementation
   */
  protected override updateFieldContent(field: Field, container: HTMLElement): void {
    super.updateFieldContent(field, container);

    if (
      this.inputElement instanceof HTMLInputElement ||
      this.inputElement instanceof HTMLTextAreaElement
    ) {
      this.inputElement.value = field.value.raw || '';
    }
  }

  /**
   * Handle attribute changes
   */
  protected override handleAttributeChange(name: string, value: string | null): void {
    // Call parent with empty string if value is null
    super.handleAttributeChange(name, value || '');

    if (!(this.inputElement instanceof HTMLInputElement)) return;

    switch (name) {
      case 'type': {
        const inputType = value || INPUT_TYPES.text;
        this.inputElement.setAttribute('type', inputType);
        break;
      }
      case 'pattern': {
        if (value) {
          this.inputElement.setAttribute('pattern', value);
        } else {
          this.inputElement.removeAttribute('pattern');
        }
        break;
      }
      case 'minlength': {
        if (value && !isNaN(parseInt(value, 10))) {
          this.inputElement.setAttribute('minlength', value);
        } else {
          this.inputElement.removeAttribute('minlength');
        }
        break;
      }
      case 'maxlength': {
        if (value && !isNaN(parseInt(value, 10))) {
          this.inputElement.setAttribute('maxlength', value);
        } else {
          this.inputElement.removeAttribute('maxlength');
        }
        break;
      }
    }
  }

  /**
   * Validate field value
   */
  protected validateField(value: string): string[] {
    const errors: string[] = [];

    try {
      // Required validation
      if (this.field?.config.required && !value) {
        errors.push(VALIDATION_MESSAGES.required);
      }

      // Pattern validation
      if (this.field?.config.validation?.pattern && value) {
        const pattern = this.field.config.validation.pattern;
        if (typeof pattern === 'string') {
          const result = ValidationUtils.validatePattern(value, pattern);
          if (!result.isValid && result.errors.length > 0) {
            errors.push(result.errors[0] || '');
          }
        }
      }

      // Length validation
      if (this.field?.config.validation) {
        const { minLength, maxLength } = this.field.config.validation;
        if (typeof minLength === 'number' && value) {
          const result = ValidationUtils.validateMinLength(value, minLength);
          if (!result.isValid && result.errors.length > 0) {
            errors.push(result.errors[0] || '');
          }
        }
        if (typeof maxLength === 'number' && value) {
          const result = ValidationUtils.validateMaxLength(value, maxLength);
          if (!result.isValid && result.errors.length > 0) {
            errors.push(result.errors[0] || '');
          }
        }
      }

      // Custom validation
      if (this.field?.config.validation?.custom) {
        const customError = this.field.config.validation.custom(value);
        if (customError) {
          errors.push(customError);
        }
      }
    } catch (error) {
      const err = ErrorUtils.handleError(error);
      errors.push(err.message);
    }

    return errors;
  }

  /**
   * Cleanup
   */
  protected override cleanup(): void {
    super.cleanup();
    this.inputWrapper = null;
    this.container = null;
  }
}

// Register custom element
customElements.define('smart-text-field', TextFieldElement);
