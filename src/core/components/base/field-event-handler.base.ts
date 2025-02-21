/**
 * @file Base field event handler implementation
 */

import { Field } from '@domain/field';
import { FormEventType } from '@interfaces/events/event-handler.interface';
import { InputElementType } from '@components/base/field-element.base';
import { CollectionUtils } from '@core/utils/collection.utils';

export abstract class BaseFieldEventHandler {
  /**
   * Handle input change event
   */
  protected handleInputChange(
    input: InputElementType,
    field: Field,
    formId: string,
    emit: (event: any) => void
  ): void {
    const value = this.getInputValue(input);
    const previousValue = field.value.raw;

    // Update field value
    field.setValue(value);

    // Emit change event with immutable data
    emit(
      CollectionUtils.deepClone({
        type: FormEventType.FIELD_CHANGE,
        timestamp: Date.now(),
        field,
        formId,
        previousValue,
        currentValue: value,
      })
    );
  }

  /**
   * Handle input focus event
   */
  protected handleInputFocus(input: InputElementType, wrapper: HTMLElement | null): void {
    const currentParts = (input.getAttribute('part') || 'input').split(' ');
    input.setAttribute('part', CollectionUtils.unique([...currentParts, 'focused']).join(' '));

    if (wrapper) {
      const wrapperPart = wrapper.getAttribute('part')?.split(' ')[0] || 'input-wrapper';
      wrapper.setAttribute('part', `${wrapperPart} focused`);
    }
  }

  /**
   * Handle input blur event
   */
  protected handleInputBlur(
    input: InputElementType,
    wrapper: HTMLElement | null,
    field: Field
  ): void {
    const currentParts = (input.getAttribute('part') || 'input').split(' ');
    input.setAttribute(
      'part',
      CollectionUtils.unique(currentParts.filter((part) => part !== 'focused')).join(' ')
    );

    if (wrapper) {
      const wrapperPart = wrapper.getAttribute('part')?.split(' ')[0] || 'input-wrapper';
      wrapper.setAttribute('part', wrapperPart);
    }

    field.markAsTouched();
  }

  /**
   * Handle keyboard events
   */
  protected handleKeyboardEvent(
    event: KeyboardEvent,
    input: InputElementType,
    hasMultipleFields: boolean
  ): void {
    if (event.key === 'Enter') {
      // Prevent form submission for textarea
      if (input instanceof HTMLTextAreaElement) {
        event.stopPropagation();
      }
      // Prevent form submission if there are other fields
      else if (hasMultipleFields) {
        event.preventDefault();
      }
    }
  }

  /**
   * Get input value based on input type
   */
  protected getInputValue(input: InputElementType): any {
    if (input instanceof HTMLSelectElement && input.multiple) {
      return CollectionUtils.unique(Array.from(input.selectedOptions).map((opt) => opt.value));
    }

    if (input instanceof HTMLInputElement && input.type === 'checkbox') {
      return input.checked;
    }

    if (input instanceof HTMLInputElement && input.type === 'file') {
      return input.files ? CollectionUtils.unique(Array.from(input.files)) : null;
    }

    if (input instanceof HTMLInputElement && input.type === 'date') {
      return input.value ? new Date(input.value) : null;
    }

    return input.value;
  }

  /**
   * Update input state based on field state
   */
  protected updateInputState(input: InputElementType, field: Field): void {
    // Update common attributes
    if (field.config.disabled) {
      input.setAttribute('disabled', '');
    } else {
      input.removeAttribute('disabled');
    }

    if (field.config.readonly) {
      input.setAttribute('readonly', '');
    } else {
      input.removeAttribute('readonly');
    }

    // Update validation state
    if (field.isValid && field.isTouched) {
      input.setAttribute('part', 'input valid');
    } else if (!field.isValid && field.isTouched) {
      input.setAttribute('part', 'input invalid');
    } else {
      input.setAttribute('part', 'input');
    }

    // Update aria attributes
    if (!field.isValid) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  }
}
