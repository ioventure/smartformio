/**
 * @file Base field renderer implementation
 */

import { Field } from '@domain/field';
import { InputElementType } from '@components/base/field-element.base';

export abstract class BaseFieldRenderer {
  /**
   * Create base field container
   */
  protected createFieldContainer(): HTMLElement {
    const container = document.createElement('div');
    container.setAttribute('part', 'field-root');
    return container;
  }

  /**
   * Create field label
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
   * Create error text element
   */
  protected createErrorText(errors: string[]): HTMLElement {
    const errorText = document.createElement('div');
    errorText.setAttribute('part', 'error-text');
    errorText.setAttribute('role', 'alert');
    errorText.textContent = errors.join(', ');
    return errorText;
  }

  /**
   * Create input wrapper
   */
  protected createInputWrapper(part: string = 'input-wrapper'): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('part', part);
    return wrapper;
  }

  /**
   * Set common input attributes
   */
  protected setCommonInputAttributes(
    input: InputElementType,
    field: Field,
    part: string = 'input'
  ): void {
    input.name = field.name;
    input.setAttribute('part', part);

    if (field.config.placeholder && !(input instanceof HTMLSelectElement)) {
      (input as HTMLInputElement | HTMLTextAreaElement).placeholder = field.config.placeholder;
    }

    if (field.config.required) {
      input.required = true;
    }

    if (field.config.disabled) {
      input.disabled = true;
    }

    if (field.config.readonly && !(input instanceof HTMLSelectElement)) {
      (input as HTMLInputElement | HTMLTextAreaElement).readOnly = true;
    }

    if (field.config.className) {
      input.className = field.config.className;
    }
  }

  /**
   * Create icon element
   */
  protected createIcon(icon: string, part: string): HTMLElement {
    const iconElement = document.createElement('span');
    iconElement.setAttribute('part', part);
    iconElement.innerHTML = icon;
    return iconElement;
  }

  /**
   * Create description element
   */
  protected createDescription(text: string, part: string = 'description'): HTMLElement {
    const description = document.createElement('div');
    description.setAttribute('part', part);
    description.textContent = text;
    return description;
  }

  /**
   * Update field validation state
   */
  protected updateValidationState(
    input: InputElementType,
    field: Field,
    container: HTMLElement
  ): void {
    // Update input state
    const currentInputPart = input.getAttribute('part') || 'input';
    const currentContainerPart = container.getAttribute('part') || 'field-root';

    if (field.isValid && field.isTouched) {
      input.setAttribute('part', `${currentInputPart} valid`);
      container.setAttribute('part', `${currentContainerPart} valid`);
    } else if (!field.isValid && field.isTouched) {
      input.setAttribute('part', `${currentInputPart} invalid`);
      container.setAttribute('part', `${currentContainerPart} invalid`);

      // Add error message
      const existingError = container.querySelector('[part="error-text"]');
      if (existingError) {
        existingError.textContent = field.errors.join(', ');
      } else {
        container.appendChild(this.createErrorText(field.errors));
      }
    }

    // Update aria attributes
    if (!field.isValid) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-errormessage', field.errors.join(', '));
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-errormessage');
    }
  }

  /**
   * Clear validation state
   */
  protected clearValidationState(input: InputElementType, container: HTMLElement): void {
    const currentInputPart = input.getAttribute('part') || 'input';
    const currentContainerPart = container.getAttribute('part') || 'field-root';

    input.setAttribute('part', currentInputPart.replace(/(valid|invalid)/g, '').trim());
    container.setAttribute('part', currentContainerPart.replace(/(valid|invalid)/g, '').trim());

    const errorText = container.querySelector('[part="error-text"]');
    if (errorText) {
      errorText.remove();
    }

    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-errormessage');
  }
}
