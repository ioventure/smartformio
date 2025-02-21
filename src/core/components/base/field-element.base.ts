/**
 * @file Base field element implementation
 */

import { Field } from '@domain/field';
import { BaseFormElement } from '@components/base/form-element.base';
import {
  IEventHandler,
  FormEventType,
  IFieldChangeEvent,
} from '@interfaces/events/event-handler.interface';
import { CollectionUtils } from '@core/utils/collection.utils';

export type InputElementType = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export abstract class BaseFieldElement extends BaseFormElement {
  protected inputElement?: InputElementType | null;
  protected field?: Field | null;

  constructor(eventHandler: IEventHandler) {
    super(eventHandler);
  }

  /**
   * Field-specific attribute handling
   */
  public static override get observedAttributes(): string[] {
    return CollectionUtils.unique([
      ...super.observedAttributes,
      'name',
      'label',
      'placeholder',
      'required',
      'value',
      'help-text',
    ]);
  }

  /**
   * Set field data
   */
  setField(field: Field): void {
    this.field = field;
    this.render();
  }

  /**
   * Get current field
   */
  getField(): Field | null {
    return this.field ?? null;
  }

  /**
   * Render field content
   */
  protected renderFieldContent(field: Field, container: HTMLElement): void {
    this.field = field;
    container.setAttribute('part', 'field-container');

    // Create label if provided
    if (field.config.label) {
      const label = this.createLabel(field);
      container.appendChild(label);
    }

    // Create input wrapper
    const inputWrapper = document.createElement('div');
    inputWrapper.setAttribute('part', 'input-wrapper');

    // Create input element
    const element = this.createInputElement(field);
    inputWrapper.appendChild(element);

    // Add help text if provided
    if (field.config.helpText) {
      const helpText = this.createHelpText(field.config.helpText);
      inputWrapper.appendChild(helpText);
    }

    container.appendChild(inputWrapper);

    // Initialize field state
    this.updateFieldState(field);
  }

  /**
   * Update field content
   */
  protected updateFieldContent(field: Field, _container: HTMLElement): void {
    this.field = field;
    this.updateFieldState(field);
  }

  /**
   * Create label element
   */
  protected createLabel(field: Field): HTMLLabelElement {
    const label = document.createElement('label');
    label.setAttribute('part', 'label');
    label.textContent = field.config.label || '';

    if (field.config.required) {
      const requiredMark = document.createElement('span');
      requiredMark.setAttribute('part', 'required-mark');
      requiredMark.textContent = '*';
      requiredMark.setAttribute('aria-hidden', 'true');
      label.appendChild(requiredMark);
    }

    if (field.config.hiddenLabel) {
      label.setAttribute('part', 'label-hidden');
    }

    return label;
  }

  /**
   * Create help text element
   */
  protected createHelpText(text: string): HTMLElement {
    const helpText = document.createElement('div');
    helpText.setAttribute('part', 'help-text');
    helpText.textContent = text;
    return helpText;
  }

  /**
   * Update field state
   */
  protected updateFieldState(field: Field): void {
    if (!this.inputElement) return;

    // Update common attributes
    if (field.config.disabled) {
      this.inputElement.setAttribute('disabled', '');
    } else {
      this.inputElement.removeAttribute('disabled');
    }

    if (field.config.readonly) {
      this.inputElement.setAttribute('readonly', '');
    } else {
      this.inputElement.removeAttribute('readonly');
    }

    // Update validation state
    if (field.isValid && field.isTouched) {
      this.inputElement.setAttribute('part', 'input valid');
    } else if (!field.isValid && field.isTouched) {
      this.inputElement.setAttribute('part', 'input invalid');
    } else {
      this.inputElement.setAttribute('part', 'input');
    }

    // Update aria attributes
    if (!field.isValid) {
      this.inputElement.setAttribute('aria-invalid', 'true');
    } else {
      this.inputElement.removeAttribute('aria-invalid');
    }
  }

  /**
   * Handle field value changes
   */
  protected handleFieldChange(newValue: any): void {
    if (!this.field) return;

    const previousValue = CollectionUtils.deepClone(this.field.value.raw);

    // Update field value
    this.field.setValue(newValue);

    // Emit change event
    this.eventHandler.emit(
      CollectionUtils.deepClone({
        type: FormEventType.FIELD_CHANGE,
        timestamp: Date.now(),
        field: this.field,
        formId: this.form?.id || '',
        previousValue,
        currentValue: newValue,
      }) as IFieldChangeEvent
    );
  }

  /**
   * Abstract method to create input element
   */
  protected abstract createInputElement(field: Field): HTMLElement;

  /**
   * Handle attribute changes
   */
  protected override handleAttributeChange(name: string, value: string): void {
    super.handleAttributeChange(name, value);

    if (this.inputElement) {
      switch (name) {
        case 'value':
          if ('value' in this.inputElement) {
            this.inputElement.value = value;
          }
          break;
        case 'placeholder':
          this.inputElement.setAttribute('placeholder', value);
          break;
        case 'disabled':
        case 'readonly':
          this.inputElement.toggleAttribute(name, value !== null);
          break;
      }
    }
  }

  /**
   * Cleanup
   */
  protected override cleanup(): void {
    super.cleanup();
    this.field = null;
    this.inputElement = null;
  }
}
