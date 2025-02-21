/**
 * @file Text field element implementation
 */

import { Field } from '@domain/field';
import { BaseFieldElement } from '@components/base/field-element.base';
import { IEventHandler } from '@interfaces/events/event-handler.interface';

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
    this.container = document.createElement('div');
    this.container.setAttribute('part', 'field-root');
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
    this.inputWrapper = document.createElement('div');
    this.inputWrapper.setAttribute('part', 'input-wrapper');

    // Create input element
    const input = document.createElement(config.type === 'textarea' ? 'textarea' : 'input');
    this.inputElement = input;

    // Set input type and common attributes
    if (input instanceof HTMLInputElement) {
      input.type = config.type || 'text';
    }
    input.name = field.name;
    input.setAttribute('part', 'input');

    // Set common attributes
    if (field.config.placeholder) {
      input.placeholder = field.config.placeholder;
    }
    if (field.config.required) {
      input.required = true;
    }
    if (field.config.disabled) {
      input.disabled = true;
    }
    if (field.config.readonly) {
      input.readOnly = true;
    }

    // Set validation attributes
    if (config.validation) {
      if (input instanceof HTMLInputElement) {
        if (config.validation.pattern) {
          input.pattern = config.validation.pattern;
        }
        if (config.validation.minLength) {
          input.minLength = config.validation.minLength;
        }
        if (config.validation.maxLength) {
          input.maxLength = config.validation.maxLength;
        }
        if (config.type === 'number') {
          if (config.validation.min !== undefined) {
            input.min = String(config.validation.min);
          }
          if (config.validation.max !== undefined) {
            input.max = String(config.validation.max);
          }
        }
      }
    }

    // Set initial value
    if (field.value.raw) {
      input.value = field.value.raw;
    }

    // Add event listeners
    this.addInputEventListeners(input);

    // Add icons if specified
    if (config.leadingIcon) {
      const leadingIcon = this.createIcon(config.leadingIcon, 'leading-icon');
      this.inputWrapper.appendChild(leadingIcon);
    }

    this.inputWrapper.appendChild(input);

    if (config.trailingIcon) {
      const trailingIcon = this.createIcon(config.trailingIcon, 'trailing-icon');
      this.inputWrapper.appendChild(trailingIcon);
    }

    return this.inputWrapper;
  }

  /**
   * Create icon element
   */
  private createIcon(icon: string, part: string): HTMLElement {
    const iconElement = document.createElement('span');
    iconElement.setAttribute('part', part);
    iconElement.innerHTML = icon;
    return iconElement;
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
      input.setAttribute('part', input.getAttribute('part') + ' focused');
      if (this.inputWrapper) {
        this.inputWrapper.setAttribute('part', 'input-wrapper focused');
      }
    });

    input.addEventListener('blur', () => {
      input.setAttribute('part', input.getAttribute('part')?.replace(' focused', '') || 'input');
      if (this.inputWrapper) {
        this.inputWrapper.setAttribute('part', 'input-wrapper');
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
  protected override handleAttributeChange(name: string, value: string): void {
    super.handleAttributeChange(name, value);

    if (this.inputElement instanceof HTMLInputElement) {
      switch (name) {
        case 'type':
          this.inputElement.type = value || 'text';
          break;
        case 'pattern':
          if (value) {
            this.inputElement.pattern = value;
          } else {
            this.inputElement.removeAttribute('pattern');
          }
          break;
        case 'minlength':
          if (value) {
            this.inputElement.minLength = parseInt(value, 10);
          } else {
            this.inputElement.removeAttribute('minlength');
          }
          break;
        case 'maxlength':
          if (value) {
            this.inputElement.maxLength = parseInt(value, 10);
          } else {
            this.inputElement.removeAttribute('maxlength');
          }
          break;
      }
    }
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
