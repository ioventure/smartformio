/**
 * @file Date field element implementation
 */

import { Field } from '../../domain/field';
import { BaseFieldElement } from '../base/field-element.base';
import { IEventHandler } from '../../interfaces/events/event-handler.interface';

interface DateValidation {
  min?: string | Date;
  max?: string | Date;
}

export class DateFieldElement extends BaseFieldElement {
  private container: HTMLElement | null = null;

  public static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'min', 'max'];
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
   * Create date input element
   */
  protected override createInputElement(field: Field): HTMLElement {
    const config = field.config as any;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.setAttribute('part', 'date-wrapper');

    // Create input
    const input = document.createElement('input');
    this.inputElement = input;
    input.type = 'date';
    input.name = field.name;
    input.setAttribute('part', 'date-input');

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
      const validation = config.validation as DateValidation;

      if (validation.min) {
        input.min = this.formatDate(new Date(validation.min));
      }
      if (validation.max) {
        input.max = this.formatDate(new Date(validation.max));
      }
    }

    // Set initial value
    if (field.value.raw) {
      input.value = this.formatDate(new Date(field.value.raw));
    }

    // Add event listeners
    this.addDateEventListeners(input);

    // Create calendar icon
    const calendarIcon = document.createElement('span');
    calendarIcon.setAttribute('part', 'calendar-icon');
    calendarIcon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
        <rect x="3" y="4" width="14" height="14" rx="2" ry="2"/>
        <line x1="3" y1="8" x2="17" y2="8"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="12" y1="2" x2="12" y2="6"/>
      </svg>
    `;

    // Add click handler to calendar icon
    calendarIcon.addEventListener('click', () => {
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
    input.addEventListener('change', () => {
      if (input.value) {
        const date = new Date(input.value);
        this.handleFieldChange(date);
      } else {
        this.handleFieldChange(null);
      }
    });

    // Handle focus/blur
    input.addEventListener('focus', () => {
      input.setAttribute('part', input.getAttribute('part') + ' focused');
    });

    input.addEventListener('blur', () => {
      input.setAttribute(
        'part',
        input.getAttribute('part')?.replace(' focused', '') || 'date-input'
      );
      if (this.field) {
        this.field.markAsTouched();
        this.updateFieldState(this.field);
      }
    });

    // Handle keyboard events
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        // Prevent form submission on enter if there are other fields
        if (this.form && this.form.fields.length > 1) {
          event.preventDefault();
        }
      }
    });
  }

  /**
   * Format date according to HTML input[type="date"] format (YYYY-MM-DD)
   */
  private formatDate(date: Date): string {
    if (!date || isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Update field content implementation
   */
  protected override updateFieldContent(field: Field, container: HTMLElement): void {
    super.updateFieldContent(field, container);

    if (this.inputElement instanceof HTMLInputElement) {
      const value = field.value.raw;
      if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          this.inputElement.value = this.formatDate(date);
        }
      } else {
        this.inputElement.value = '';
      }
    }
  }

  /**
   * Handle attribute changes
   */
  protected override handleAttributeChange(name: string, value: string): void {
    super.handleAttributeChange(name, value);

    if (this.inputElement instanceof HTMLInputElement) {
      switch (name) {
        case 'min':
        case 'max':
          if (value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              this.inputElement.setAttribute(name, this.formatDate(date));
            }
          } else {
            this.inputElement.removeAttribute(name);
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
    this.container = null;
  }
}

// Register custom element
customElements.define('smart-date-field', DateFieldElement);
