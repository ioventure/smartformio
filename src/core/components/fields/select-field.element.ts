/**
 * @file Select field element implementation
 */

import { Field } from '@domain/field';
import { BaseFieldElement } from '@components/base/field-element.base';
import { IEventHandler } from '@interfaces/events/event-handler.interface';
import { DOMUtils, ErrorUtils } from '@utils/index';
import {
  COMPONENT_PARTS,
  VALIDATION_MESSAGES,
  EVENT_NAMES,
} from '@core/constants/component.constants';
import { SelectOption } from './index';

export class SelectFieldElement extends BaseFieldElement {
  private container: HTMLElement | null = null;
  private inputWrapper: HTMLElement | null = null;

  public static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'options', 'multiple'];
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
   * Create select element
   */
  protected override createInputElement(field: Field): HTMLElement {
    const config = field.config as any;

    // Create wrapper
    this.inputWrapper = DOMUtils.createElement('div', {
      part: COMPONENT_PARTS.select.wrapper,
    });

    // Create properties object with only defined values
    const properties: Partial<HTMLSelectElement> = {
      name: field.name,
    };

    // Add optional properties only if they are defined
    if (field.config.required) properties.required = true;
    if (field.config.disabled) properties.disabled = true;
    if (config.multiple) properties.multiple = true;

    // Create select element
    const select = DOMUtils.createElement('select', {
      properties,
      part: COMPONENT_PARTS.select.select,
    });

    this.inputElement = select;

    // Add options
    this.renderOptions(field, select);

    // Add event listeners
    this.addSelectEventListeners(select);

    // Create custom arrow indicator
    const arrow = DOMUtils.createElement('span', {
      part: COMPONENT_PARTS.select.arrow,
      text: '▼',
    });

    // Assemble components
    this.inputWrapper.appendChild(select);
    this.inputWrapper.appendChild(arrow);

    return this.inputWrapper;
  }

  /**
   * Render select options
   */
  private renderOptions(field: Field, select: HTMLSelectElement): void {
    const options = (field.config as any).options || [];
    const currentValue = field.value.raw;

    // Add placeholder option if specified
    if (field.config.placeholder && !select.multiple) {
      const placeholder = DOMUtils.createElement('option', {
        properties: {
          value: '',
          disabled: true,
          selected: !currentValue,
        },
        text: field.config.placeholder,
      });
      select.appendChild(placeholder);
    }

    // Add options
    options.forEach((option: string | SelectOption) => {
      const optionElement = DOMUtils.createElement('option', {
        properties: {
          value: typeof option === 'string' ? option : option.value,
          selected: select.multiple
            ? Array.isArray(currentValue) &&
              currentValue.includes(typeof option === 'string' ? option : option.value)
            : currentValue === (typeof option === 'string' ? option : option.value),
        },
        text: typeof option === 'string' ? option : option.label,
      });

      select.appendChild(optionElement);
    });
  }

  /**
   * Add select-specific event listeners
   */
  private addSelectEventListeners(select: HTMLSelectElement): void {
    // Handle change events
    select.addEventListener(EVENT_NAMES.change, () => {
      const value = select.multiple
        ? Array.from(select.selectedOptions).map((opt) => opt.value)
        : select.value;

      this.handleFieldChange(value);
    });

    // Handle focus/blur
    select.addEventListener(EVENT_NAMES.focus, () => {
      DOMUtils.updatePart(select, { add: [COMPONENT_PARTS.states.focused] });
      if (this.inputWrapper) {
        DOMUtils.updatePart(this.inputWrapper, { add: [COMPONENT_PARTS.states.focused] });
      }
    });

    select.addEventListener(EVENT_NAMES.blur, () => {
      DOMUtils.updatePart(select, { remove: [COMPONENT_PARTS.states.focused] });
      if (this.inputWrapper) {
        DOMUtils.updatePart(this.inputWrapper, { remove: [COMPONENT_PARTS.states.focused] });
      }
      if (this.field) {
        this.field.markAsTouched();
        this.updateFieldState(this.field);
      }
    });
  }

  /**
   * Update field content implementation
   */
  protected override updateFieldContent(field: Field, container: HTMLElement): void {
    super.updateFieldContent(field, container);

    if (this.inputElement instanceof HTMLSelectElement) {
      // Clear existing options
      this.inputElement.innerHTML = '';
      // Re-render options
      this.renderOptions(field, this.inputElement);
    }
  }

  /**
   * Handle attribute changes
   */
  protected override handleAttributeChange(name: string, value: string | null): void {
    super.handleAttributeChange(name, value || '');

    if (!(this.inputElement instanceof HTMLSelectElement)) return;

    switch (name) {
      case 'options': {
        try {
          const options = JSON.parse(value || '[]');
          if (this.field) {
            (this.field.config as any).options = options;
            this.renderOptions(this.field, this.inputElement);
          }
        } catch (error) {
          const err = ErrorUtils.handleError(error);
          console.error('Invalid options format:', err.message);
        }
        break;
      }
      case 'multiple': {
        this.inputElement.multiple = value !== null;
        break;
      }
    }
  }

  /**
   * Validate field value
   */
  protected validateField(value: any): string[] {
    const errors: string[] = [];

    try {
      // Required validation
      if (this.field?.config.required) {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            errors.push(VALIDATION_MESSAGES.required);
          }
        } else if (!value) {
          errors.push(VALIDATION_MESSAGES.required);
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
customElements.define('smart-select-field', SelectFieldElement);
