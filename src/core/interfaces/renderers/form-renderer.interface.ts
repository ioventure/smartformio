/**
 * @file Form renderer interface definitions
 */

import { Form } from '@domain/form';
import { Field } from '@domain/field';

/**
 * Render options interface
 */
export interface RenderOptions {
  container: HTMLElement;
  validateOnChange?: boolean;
}

/**
 * Field render result interface
 */
export interface FieldRenderResult {
  element: HTMLElement;
  field: Field;
}

/**
 * Form render result interface
 */
export interface FormRenderResult {
  element: HTMLElement;
  form: Form;
  fields: FieldRenderResult[];
}

/**
 * Form renderer interface
 */
export interface IFormRenderer {
  /**
   * Render form
   */
  renderForm(form: Form, options: RenderOptions): FormRenderResult;

  /**
   * Render field
   */
  renderField(field: Field, container: HTMLElement): FieldRenderResult;

  /**
   * Update form
   */
  updateForm(form: Form): void;

  /**
   * Update field
   */
  updateField(field: Field): void;

  /**
   * Cleanup
   */
  cleanup(): void;
}

/**
 * Base form renderer implementation
 */
export abstract class BaseFormRenderer implements IFormRenderer {
  protected form: Form | null = null;
  protected container: HTMLElement | null = null;
  protected fields: Map<string, FieldRenderResult> = new Map();

  /**
   * Render form implementation
   */
  renderForm(form: Form, options: RenderOptions): FormRenderResult {
    this.form = form;
    this.container = options.container;

    // Clear container
    this.container.innerHTML = '';

    // Create form element
    const formElement = document.createElement('form');
    formElement.setAttribute('novalidate', '');

    // Add title if provided
    if (form.config.title) {
      const title = document.createElement('h2');
      title.textContent = form.config.title;
      formElement.appendChild(title);
    }

    // Add description if provided
    if (form.config.description) {
      const description = document.createElement('p');
      description.textContent = form.config.description;
      formElement.appendChild(description);
    }

    // Create fields container
    const fieldsContainer = document.createElement('div');
    formElement.appendChild(fieldsContainer);

    // Render fields
    const fields = form.fields.map((field) => this.renderField(field, fieldsContainer));

    // Store field results
    fields.forEach((result) => {
      this.fields.set(result.field.name, result);
    });

    // Add submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = form.config.submitButtonText || 'Submit';
    formElement.appendChild(submitButton);

    // Add form to container
    this.container.appendChild(formElement);

    return {
      element: formElement,
      form,
      fields,
    };
  }

  /**
   * Abstract method to render field
   */
  abstract renderField(field: Field, container: HTMLElement): FieldRenderResult;

  /**
   * Update form implementation
   */
  updateForm(form: Form): void {
    this.form = form;
    form.fields.forEach((field) => this.updateField(field));
  }

  /**
   * Update field implementation
   */
  updateField(field: Field): void {
    const result = this.fields.get(field.name);
    if (result) {
      // Update field state
      this.updateFieldState(result.element, field);
    }
  }

  /**
   * Abstract method to update field state
   */
  protected abstract updateFieldState(element: HTMLElement, field: Field): void;

  /**
   * Cleanup implementation
   */
  cleanup(): void {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.form = null;
    this.container = null;
    this.fields.clear();
  }
}
