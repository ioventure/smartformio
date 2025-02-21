/**
 * @file Checkbox field element implementation
 */

import { Field } from '@domain/field';
import { BaseFieldElement } from '@components/base/field-element.base';
import { IEventHandler } from '@interfaces/events/event-handler.interface';
import { CheckboxOption } from '@components/fields';
import { CollectionUtils } from '@core/utils/collection.utils';

export class CheckboxFieldElement extends BaseFieldElement {
  private container: HTMLElement | null = null;
  private checkboxes: Map<string, HTMLInputElement> = new Map();

  public static override get observedAttributes(): string[] {
    return CollectionUtils.unique([...super.observedAttributes, 'options', 'display']);
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
   * Create checkbox element(s)
   */
  protected override createInputElement(field: Field): HTMLElement {
    const config = field.config as any;
    const isGroup = Array.isArray(config.options);

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.setAttribute('part', `checkbox-wrapper ${config.display || 'vertical'}`);

    if (isGroup) {
      // Render checkbox group
      this.renderCheckboxGroup(field, wrapper);
    } else {
      // Render single checkbox
      this.renderSingleCheckbox(field, wrapper);
    }

    return wrapper;
  }

  /**
   * Render single checkbox
   */
  private renderSingleCheckbox(field: Field, wrapper: HTMLElement): void {
    const container = document.createElement('label');
    container.setAttribute('part', 'checkbox-container');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = field.name;
    checkbox.checked = !!field.value.raw;
    checkbox.setAttribute('part', 'checkbox');

    if (field.config.disabled) {
      checkbox.disabled = true;
    }
    if (field.config.required) {
      checkbox.required = true;
    }

    // Store reference
    this.inputElement = checkbox;
    this.checkboxes.set(field.name, checkbox);

    // Add event listeners
    this.addCheckboxEventListeners(checkbox);

    const labelText = document.createElement('span');
    labelText.setAttribute('part', 'checkbox-label');
    labelText.textContent = field.config.label || '';

    container.appendChild(checkbox);
    container.appendChild(labelText);

    if ((field.config as any).description) {
      const description = document.createElement('div');
      description.setAttribute('part', 'checkbox-description');
      description.textContent = (field.config as any).description;
      container.appendChild(description);
    }

    wrapper.appendChild(container);
  }

  /**
   * Render checkbox group
   */
  private renderCheckboxGroup(field: Field, wrapper: HTMLElement): void {
    const options = (field.config as any).options || [];
    const currentValues = CollectionUtils.unique(
      Array.isArray(field.value.raw) ? field.value.raw : []
    );

    options.forEach((option: string | CheckboxOption) => {
      const container = document.createElement('label');
      container.setAttribute('part', 'checkbox-container');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = field.name;

      if (typeof option === 'string') {
        checkbox.value = option;
        checkbox.checked = currentValues.includes(option);
      } else {
        checkbox.value = option.value;
        checkbox.checked = currentValues.includes(option.value);
      }

      checkbox.setAttribute('part', 'checkbox');

      if (field.config.disabled) {
        checkbox.disabled = true;
      }

      // Store reference
      this.checkboxes.set(checkbox.value, checkbox);

      // Add event listeners
      this.addCheckboxEventListeners(checkbox);

      const labelText = document.createElement('span');
      labelText.setAttribute('part', 'checkbox-label');
      labelText.textContent = typeof option === 'string' ? option : option.label;

      container.appendChild(checkbox);
      container.appendChild(labelText);

      if (typeof option !== 'string' && option.description) {
        const description = document.createElement('div');
        description.setAttribute('part', 'checkbox-description');
        description.textContent = option.description;
        container.appendChild(description);
      }

      wrapper.appendChild(container);
    });
  }

  /**
   * Add checkbox-specific event listeners
   */
  private addCheckboxEventListeners(checkbox: HTMLInputElement): void {
    checkbox.addEventListener('change', () => {
      const isGroup = this.checkboxes.size > 1;
      let value;

      if (isGroup) {
        // Collect all checked values for groups
        value = CollectionUtils.unique(
          Array.from(this.checkboxes.values())
            .filter((cb) => cb.checked)
            .map((cb) => cb.value)
        );
      } else {
        // Single checkbox value
        value = checkbox.checked;
      }

      this.handleFieldChange(value);
    });

    // Handle focus/blur
    checkbox.addEventListener('focus', () => {
      checkbox.setAttribute('part', checkbox.getAttribute('part') + ' focused');
      const container = checkbox.closest('[part="checkbox-container"]');
      if (container instanceof HTMLElement) {
        container.setAttribute('part', 'checkbox-container focused');
      }
    });

    checkbox.addEventListener('blur', () => {
      checkbox.setAttribute(
        'part',
        checkbox.getAttribute('part')?.replace(' focused', '') || 'checkbox'
      );
      const container = checkbox.closest('[part="checkbox-container"]');
      if (container instanceof HTMLElement) {
        container.setAttribute('part', 'checkbox-container');
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

    const isGroup = this.checkboxes.size > 1;
    const currentValues = isGroup
      ? CollectionUtils.unique(Array.isArray(field.value.raw) ? field.value.raw : [])
      : field.value.raw;

    if (isGroup) {
      // Update group checkboxes
      this.checkboxes.forEach((checkbox, value) => {
        checkbox.checked = currentValues.includes(value);
      });
    } else {
      // Update single checkbox
      const checkbox = this.checkboxes.get(field.name);
      if (checkbox) {
        checkbox.checked = !!currentValues;
      }
    }
  }

  /**
   * Handle attribute changes
   */
  protected override handleAttributeChange(name: string, value: string): void {
    super.handleAttributeChange(name, value);

    switch (name) {
      case 'options':
        try {
          const options = CollectionUtils.deepClone(JSON.parse(value));
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
          const wrapper = this.container.querySelector('[part^="checkbox-wrapper"]');
          if (wrapper instanceof HTMLElement) {
            wrapper.setAttribute('part', `checkbox-wrapper ${value || 'vertical'}`);
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
    this.checkboxes.clear();
    this.container = null;
  }
}

// Register custom element
customElements.define('smart-checkbox-field', CheckboxFieldElement);
