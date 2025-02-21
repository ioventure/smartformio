/**
 * @file Date field element implementation
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
} from '@core/constants/component.constants';
import { DateValidation } from './index';

type DateFieldConfig = Omit<Field['config'], 'validation'> & {
  validation?: DateValidation;
};

export class DateFieldElement extends BaseFieldElement {
  private container: HTMLElement | null = null;

  public static override get observedAttributes(): string[] {
    return CollectionUtils.unique([...super.observedAttributes, 'min', 'max']);
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
   * Create date input element
   */
  protected override createInputElement(field: Field): HTMLElement {
    const config = field.config as unknown as DateFieldConfig;

    // Create wrapper
    const wrapper = DOMUtils.createElement('div', {
      part: COMPONENT_PARTS.date.wrapper,
    });

    // Create properties object with only defined values
    const properties: Partial<HTMLInputElement> = {
      type: INPUT_TYPES.date,
      name: field.name,
    };

    // Add optional properties only if they are defined
    if (field.config.placeholder) properties.placeholder = field.config.placeholder;
    if (field.config.required) properties.required = true;
    if (field.config.disabled) properties.disabled = true;
    if (field.config.readonly) properties.readOnly = true;

    // Set validation attributes
    if (config.validation) {
      if (config.validation.min) {
        properties.min = StringUtils.formatDate(new Date(config.validation.min));
      }
      if (config.validation.max) {
        properties.max = StringUtils.formatDate(new Date(config.validation.max));
      }
    }

    // Set initial value
    if (field.value.raw) {
      properties.value = StringUtils.formatDate(new Date(field.value.raw));
    }

    // Create input element
    const input = DOMUtils.createElement('input', {
      properties,
      part: COMPONENT_PARTS.date.input,
    });
    this.inputElement = input;

    // Add event listeners
    this.addDateEventListeners(input);

    // Create calendar icon
    const calendarIcon = DOMUtils.createIcon(
      `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
        <rect x="3" y="4" width="14" height="14" rx="2" ry="2"/>
        <line x1="3" y1="8" x2="17" y2="8"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="12" y1="2" x2="12" y2="6"/>
      </svg>
    `,
      {
        part: COMPONENT_PARTS.date.calendarIcon,
      }
    );

    // Add click handler to calendar icon
    calendarIcon.addEventListener(EVENT_NAMES.click, () => {
      if (!input.disabled && !input.readOnly) {
        input.showPicker();
      }
    });

    // Assemble wrapper
    wrapper.appendChild(input);
    wrapper.appendChild(calendarIcon);

    return wrapper;
  }

  /**
   * Add date-specific event listeners
   */
  private addDateEventListeners(input: HTMLInputElement): void {
    input.addEventListener(EVENT_NAMES.change, () => {
      if (input.value) {
        const date = new Date(input.value);
        this.handleFieldChange(CollectionUtils.deepClone(date));
      } else {
        this.handleFieldChange(null);
      }
    });

    // Handle focus/blur
    input.addEventListener(EVENT_NAMES.focus, () => {
      DOMUtils.updatePart(input, { add: [COMPONENT_PARTS.states.focused] });
    });

    input.addEventListener(EVENT_NAMES.blur, () => {
      DOMUtils.updatePart(input, { remove: [COMPONENT_PARTS.states.focused] });
      if (this.field) {
        this.field.markAsTouched();
        this.updateFieldState(this.field);
      }
    });

    // Handle keyboard events
    input.addEventListener(EVENT_NAMES.keydown, ((event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === 'Enter') {
        // Prevent form submission on enter if there are other fields
        if (this.form && this.form.fields.length > 1) {
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

    if (this.inputElement instanceof HTMLInputElement) {
      const value = CollectionUtils.deepClone(field.value.raw);
      if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          this.inputElement.value = StringUtils.formatDate(date);
        }
      } else {
        this.inputElement.value = '';
      }
    }
  }

  /**
   * Handle attribute changes
   */
  protected override handleAttributeChange(name: string, value: string | null): void {
    super.handleAttributeChange(name, value || '');

    if (!(this.inputElement instanceof HTMLInputElement)) return;

    switch (name) {
      case 'min':
      case 'max': {
        if (value) {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              this.inputElement.setAttribute(name, StringUtils.formatDate(date));
            }
          } catch (error) {
            const err = ErrorUtils.handleError(error);
            console.error(`Invalid ${name} date:`, err.message);
          }
        } else {
          this.inputElement.removeAttribute(name);
        }
        break;
      }
    }
  }

  /**
   * Validate field value
   */
  protected validateField(value: Date | null): string[] {
    const errors: string[] = [];
    const safeValue = value ? CollectionUtils.deepClone(value) : null;

    try {
      // Required validation
      if (this.field?.config.required && !safeValue) {
        errors.push(VALIDATION_MESSAGES.required);
      }

      // Date range validation
      if (safeValue && this.field?.config.validation) {
        const config = this.field.config as unknown as DateFieldConfig;
        const safeConfig = CollectionUtils.deepClone(config);
        if (safeConfig.validation) {
          const result = ValidationUtils.validateDate(safeValue, safeConfig.validation);
          if (!result.isValid && result.errors.length > 0) {
            errors.push(result.errors[0] || VALIDATION_MESSAGES.dateRange);
          }
        }
      }

      // Custom validation
      if (this.field?.config.validation?.custom) {
        const customError = this.field.config.validation.custom(safeValue);
        if (customError) {
          errors.push(customError);
        }
      }
    } catch (error) {
      const err = ErrorUtils.handleError(error);
      errors.push(err.message);
    }

    return CollectionUtils.unique(errors);
  }

  /**
   * Cleanup
   */
  protected override cleanup(): void {
    super.cleanup();
    this.container = null;
  }
}

// Register custom element
customElements.define('smart-date-field', DateFieldElement);
