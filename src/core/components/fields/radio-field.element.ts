/**
 * @file Radio field element implementation
 */

import { Field } from '../../domain/field';
import { BaseFieldElement } from '../base/field-element.base';
import { IEventHandler } from '../../interfaces/events/event-handler.interface';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export class RadioFieldElement extends BaseFieldElement {
  private container: HTMLElement | null = null;
  private radioButtons: Map<string, HTMLInputElement> = new Map();

  public static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'options', 'display'];
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
   * Create radio group element
   */
  protected override createInputElement(field: Field): HTMLElement {
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.setAttribute('part', `radio-wrapper ${(field.config as any).display || 'vertical'}`);

    // Get options and current value
    const options = (field.config as any).options || [];
    const currentValue = field.value.raw;

    // Create radio group
    options.forEach((option: string | RadioOption, index: number) => {
      const container = document.createElement('label');
      container.setAttribute('part', 'radio-container');

      // Create radio input
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = field.name;

      if (typeof option === 'string') {
        radio.value = option;
        radio.checked = currentValue === option;
      } else {
        radio.value = option.value;
        radio.checked = currentValue === option.value;
      }

      radio.setAttribute('part', 'radio');

      if (field.config.disabled) {
        radio.disabled = true;
      }
      if (field.config.required) {
        radio.required = true;
      }

      // Store reference
      this.radioButtons.set(radio.value, radio);
      if (index === 0) {
        // Store first radio button as input element reference
        this.inputElement = radio;
      }

      // Add event listeners
      this.addRadioEventListeners(radio);

      // Create label text
      const labelText = document.createElement('span');
      labelText.setAttribute('part', 'radio-label');
      labelText.textContent = typeof option === 'string' ? option : option.label;

      // Assemble container
      container.appendChild(radio);
      container.appendChild(labelText);

      // Add description if available
      if (typeof option !== 'string' && option.description) {
        const description = document.createElement('div');
        description.setAttribute('part', 'radio-description');
        description.textContent = option.description;
        container.appendChild(description);
      }

      wrapper.appendChild(container);
    });

    return wrapper;
  }

  /**
   * Add radio-specific event listeners
   */
  private addRadioEventListeners(radio: HTMLInputElement): void {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        this.handleFieldChange(radio.value);
      }
    });

    // Handle focus/blur
    radio.addEventListener('focus', () => {
      const currentPart = radio.getAttribute('part') || 'radio';
      radio.setAttribute('part', `${currentPart} focused`);
      const container = radio.closest('[part="radio-container"]');
      if (container) {
        container.setAttribute('part', 'radio-container focused');
      }
    });

    radio.addEventListener('blur', () => {
      const currentPart = radio.getAttribute('part') || 'radio';
      radio.setAttribute('part', currentPart.replace(' focused', ''));
      const container = radio.closest('[part="radio-container"]');
      if (container) {
        container.setAttribute('part', 'radio-container');
      }
      if (this.field) {
        this.field.markAsTouched();
        this.updateFieldState(this.field);
      }
    });

    // Handle keyboard navigation
    radio.addEventListener('keydown', (event) => {
      this.handleKeyboardNavigation(event, radio);
    });
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeyboardNavigation(event: KeyboardEvent, radio: HTMLInputElement): void {
    const options = Array.from(this.radioButtons.values());
    if (options.length === 0) return;

    const currentIndex = options.indexOf(radio);
    if (currentIndex === -1) return;

    let targetIndex: number;

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft': {
        event.preventDefault();
        targetIndex = (currentIndex - 1 + options.length) % options.length;
        break;
      }
      case 'ArrowDown':
      case 'ArrowRight': {
        event.preventDefault();
        targetIndex = (currentIndex + 1) % options.length;
        break;
      }
      default:
        return;
    }

    // The modulo operation ensures targetIndex is within bounds
    const targetOption = options[targetIndex] as HTMLInputElement;
    targetOption.focus();
    targetOption.click();
  }

  /**
   * Update field content implementation
   */
  protected override updateFieldContent(field: Field, container: HTMLElement): void {
    super.updateFieldContent(field, container);

    const currentValue = field.value.raw;

    // Update radio button states
    this.radioButtons.forEach((radio, value) => {
      radio.checked = value === currentValue;
    });
  }

  /**
   * Handle attribute changes
   */
  protected override handleAttributeChange(name: string, value: string): void {
    super.handleAttributeChange(name, value);

    switch (name) {
      case 'options':
        try {
          const options = JSON.parse(value);
          if (this.field && this.container) {
            (this.field.config as any).options = options;
            this.render(); // Re-render to update options
          }
        } catch (error) {
          console.error('Invalid options format:', error);
        }
        break;
      case 'display':
        if (this.container) {
          const wrapper = this.container.querySelector('[part^="radio-wrapper"]');
          if (wrapper instanceof HTMLElement) {
            wrapper.setAttribute('part', `radio-wrapper ${value || 'vertical'}`);
          }
        }
        break;
    }
  }

  /**
   * Cleanup
   */
  protected override cleanup(): void {
    super.cleanup();
    this.radioButtons.clear();
    this.container = null;
  }
}

// Register custom element
customElements.define('smart-radio-field', RadioFieldElement);
