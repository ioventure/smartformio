/**
 * @file Radio field element implementation
 */

import { Field } from '@domain/field';
import { BaseFieldElement } from '@components/base/field-element.base';
import { IEventHandler } from '@interfaces/events/event-handler.interface';
import { DOMUtils, StringUtils, ValidationUtils, ErrorUtils, CollectionUtils } from '@utils/index';
import {
  COMPONENT_PARTS,
  INPUT_TYPES,
  VALIDATION_MESSAGES,
  EVENT_NAMES,
  ARIA_ATTRIBUTES,
  DISPLAY_ORIENTATIONS,
} from '@core/constants/component.constants';
import { RadioOption } from './index';

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
    this.container = DOMUtils.createElement('div', {
      part: COMPONENT_PARTS.field.root,
    });
    this.shadow.appendChild(this.container);

    // Render field content
    this.renderFieldContent(this.field, this.container);
  }

  /**
   * Create radio group element
   */
  protected override createInputElement(field: Field): HTMLElement {
    const config = field.config as any;

    // Create wrapper with display orientation
    const wrapper = DOMUtils.createElement('div', {
      part: `${COMPONENT_PARTS.radio.wrapper} ${config.display || DISPLAY_ORIENTATIONS.vertical}`,
    });

    // Get options and current value
    const options = config.options || [];
    const currentValue = field.value.raw;

    // Create radio group
    options.forEach((option: string | RadioOption, index: number) => {
      const container = DOMUtils.createElement('label', {
        part: COMPONENT_PARTS.radio.container,
      });

      // Create properties object with only defined values
      const properties: Partial<HTMLInputElement> = {
        type: INPUT_TYPES.radio,
        name: field.name,
        value: typeof option === 'string' ? option : option.value,
        checked: currentValue === (typeof option === 'string' ? option : option.value),
      };

      // Add optional properties only if they are defined
      if (field.config.required) properties.required = true;
      if (field.config.disabled) properties.disabled = true;

      // Create radio input
      const radio = DOMUtils.createElement('input', {
        properties,
        part: COMPONENT_PARTS.radio.radio,
      });

      // Store reference
      this.radioButtons.set(radio.value, radio);
      if (index === 0) {
        // Store first radio button as input element reference
        this.inputElement = radio;
      }

      // Add event listeners
      this.addRadioEventListeners(radio);

      // Create label text
      const labelText = DOMUtils.createElement('span', {
        part: COMPONENT_PARTS.radio.label,
        text: typeof option === 'string' ? option : option.label,
      });

      // Assemble container
      container.appendChild(radio);
      container.appendChild(labelText);

      // Add description if available
      if (typeof option !== 'string' && option.description) {
        const description = DOMUtils.createElement('div', {
          part: COMPONENT_PARTS.radio.description,
          text: option.description,
        });
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
    radio.addEventListener(EVENT_NAMES.change, () => {
      if (radio.checked) {
        this.handleFieldChange(radio.value);
      }
    });

    // Handle focus/blur
    radio.addEventListener(EVENT_NAMES.focus, () => {
      DOMUtils.updatePart(radio, { add: [COMPONENT_PARTS.states.focused] });
      const container = radio.closest(`[part="${COMPONENT_PARTS.radio.container}"]`);
      if (container instanceof HTMLElement) {
        DOMUtils.updatePart(container, { add: [COMPONENT_PARTS.states.focused] });
      }
    });

    radio.addEventListener(EVENT_NAMES.blur, () => {
      DOMUtils.updatePart(radio, { remove: [COMPONENT_PARTS.states.focused] });
      const container = radio.closest(`[part="${COMPONENT_PARTS.radio.container}"]`);
      if (container instanceof HTMLElement) {
        DOMUtils.updatePart(container, { remove: [COMPONENT_PARTS.states.focused] });
      }
      if (this.field) {
        this.field.markAsTouched();
        this.updateFieldState(this.field);
      }
    });

    // Handle keyboard navigation
    radio.addEventListener(EVENT_NAMES.keydown, ((event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      this.handleKeyboardNavigation(keyboardEvent, radio);
    }) as EventListener);
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

    const targetOption = options[targetIndex];
    if (targetOption) {
      targetOption.focus();
      targetOption.click();
    }
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
  protected override handleAttributeChange(name: string, value: string | null): void {
    super.handleAttributeChange(name, value || '');

    switch (name) {
      case 'options': {
        try {
          const options = JSON.parse(value || '[]');
          if (this.field && this.container) {
            (this.field.config as any).options = options;
            this.render(); // Re-render to update options
          }
        } catch (error) {
          const err = ErrorUtils.handleError(error);
          console.error('Invalid options format:', err.message);
        }
        break;
      }
      case 'display': {
        if (this.container) {
          const wrapper = this.container.querySelector(
            `[part^="${COMPONENT_PARTS.radio.wrapper}"]`
          );
          if (wrapper instanceof HTMLElement) {
            DOMUtils.updatePart(wrapper, {
              set: `${COMPONENT_PARTS.radio.wrapper} ${value || DISPLAY_ORIENTATIONS.vertical}`,
            });
          }
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
    this.radioButtons.clear();
    this.container = null;
  }
}

// Register custom element
customElements.define('smart-radio-field', RadioFieldElement);
