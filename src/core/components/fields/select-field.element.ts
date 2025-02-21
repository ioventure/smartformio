/**
 * @file Select field element implementation
 */

import { Field } from '@domain/field';
import { BaseFieldElement } from '@components/base/field-element.base';
import { IEventHandler } from '@interfaces/events/event-handler.interface';
import { SelectOption } from '@components/fields';

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
    this.container = document.createElement('div');
    this.container.setAttribute('part', 'field-root');
    this.shadow.appendChild(this.container);

    // Render field content
    this.renderFieldContent(this.field, this.container);
  }

  /**
   * Create select element
   */
  protected override createInputElement(field: Field): HTMLElement {
    // Create select element
    const select = document.createElement('select');
    this.inputElement = select;
    select.setAttribute('part', 'select');
    select.name = field.name;

    // Set common attributes
    if (field.config.required) {
      select.required = true;
    }
    if (field.config.disabled) {
      select.disabled = true;
    }
    if ((field.config as any).multiple) {
      select.multiple = true;
    }

    // Create wrapper
    this.inputWrapper = document.createElement('div');
    this.inputWrapper.setAttribute('part', 'select-wrapper');

    // Add options
    this.renderOptions(field, select);

    // Add event listeners
    this.addSelectEventListeners(select);

    // Create custom arrow indicator
    const arrow = document.createElement('span');
    arrow.setAttribute('part', 'select-arrow');
    arrow.innerHTML = '▼';

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
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = field.config.placeholder;
      placeholder.disabled = true;
      placeholder.selected = !currentValue;
      select.appendChild(placeholder);
    }

    // Add options
    options.forEach((option: string | SelectOption) => {
      const optionElement = document.createElement('option');

      if (typeof option === 'string') {
        optionElement.value = option;
        optionElement.textContent = option;
      } else {
        optionElement.value = option.value;
        optionElement.textContent = option.label;
      }

      // Set selected state
      if (select.multiple && Array.isArray(currentValue)) {
        optionElement.selected = currentValue.includes(optionElement.value);
      } else {
        optionElement.selected = currentValue === optionElement.value;
      }

      select.appendChild(optionElement);
    });
  }

  /**
   * Add select-specific event listeners
   */
  private addSelectEventListeners(select: HTMLSelectElement): void {
    // Handle change events
    select.addEventListener('change', () => {
      const value = select.multiple
        ? Array.from(select.selectedOptions).map((opt) => opt.value)
        : select.value;

      this.handleFieldChange(value);
    });

    // Handle focus/blur
    select.addEventListener('focus', () => {
      select.setAttribute('part', select.getAttribute('part') + ' focused');
      if (this.inputWrapper) {
        this.inputWrapper.setAttribute('part', 'select-wrapper focused');
      }
    });

    select.addEventListener('blur', () => {
      select.setAttribute('part', select.getAttribute('part')?.replace(' focused', '') || 'select');
      if (this.inputWrapper) {
        this.inputWrapper.setAttribute('part', 'select-wrapper');
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

    // Update select options if input element exists and is a select
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
  protected override handleAttributeChange(name: string, value: string): void {
    super.handleAttributeChange(name, value);

    if (this.inputElement instanceof HTMLSelectElement) {
      switch (name) {
        case 'options':
          try {
            const options = JSON.parse(value);
            if (this.field) {
              (this.field.config as any).options = options;
              this.renderOptions(this.field, this.inputElement);
            }
          } catch (error) {
            console.error('Invalid options format:', error);
          }
          break;
        case 'multiple':
          this.inputElement.multiple = value !== null;
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
customElements.define('smart-select-field', SelectFieldElement);
