/**
 * @file Smart form element implementation
 */

import { Form, FormConfig } from '@domain/form';
import { BaseFormElement } from '@components/base/form-element.base';
import {
  IEventHandler,
  FormEventType,
  IFormSubmitEvent,
} from '@interfaces/events/event-handler.interface';

interface SmartFormConfig extends FormConfig {
  schema?: string;
  validateOnChange?: boolean;
}

export class SmartFormElement extends BaseFormElement {
  private container: HTMLElement | null = null;
  private fieldsContainer: HTMLElement | null = null;
  private submitButton: HTMLButtonElement | null = null;

  public static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'schema', 'validate-on-change'];
  }

  constructor(eventHandler: IEventHandler) {
    super(eventHandler);
  }

  /**
   * Implement required render method
   */
  protected override render(): void {
    if (!this.form) return;

    // Clear existing content
    this.shadow.innerHTML = '';

    // Create container
    this.container = document.createElement('div');
    this.container.setAttribute('part', 'form');
    this.shadow.appendChild(this.container);

    // Add title if provided
    if (this.form.config.title) {
      const title = document.createElement('h2');
      title.setAttribute('part', 'title');
      title.textContent = this.form.config.title;
      this.container.appendChild(title);
    }

    // Add description if provided
    if (this.form.config.description) {
      const description = document.createElement('p');
      description.setAttribute('part', 'description');
      description.textContent = this.form.config.description;
      this.container.appendChild(description);
    }

    // Create fields container
    this.fieldsContainer = document.createElement('div');
    this.fieldsContainer.setAttribute('part', 'fields');
    this.container.appendChild(this.fieldsContainer);

    // Create submit button
    this.submitButton = document.createElement('button');
    this.submitButton.type = 'submit';
    this.submitButton.setAttribute('part', 'submit-button');
    this.submitButton.textContent = this.form.config.submitButtonText || 'Submit';
    this.container.appendChild(this.submitButton);

    // Add event listeners
    this.addFormEventListeners();
  }

  /**
   * Add form-specific event listeners
   */
  private addFormEventListeners(): void {
    if (!this.container || !this.submitButton) return;

    // Handle submit
    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.form) {
        this.form.startSubmit();
        this.eventHandler.emit({
          type: FormEventType.FORM_SUBMIT,
          timestamp: Date.now(),
          form: this.form,
          values: this.form.values,
        } as IFormSubmitEvent);
        this.form.endSubmit();
      }
    });

    // Handle submit button click
    this.submitButton.addEventListener('click', () => {
      const submitEvent = new Event('submit', { bubbles: true });
      this.container?.dispatchEvent(submitEvent);
    });
  }

  /**
   * Handle attribute changes
   */
  protected override handleAttributeChange(name: string, value: string): void {
    super.handleAttributeChange(name, value);

    switch (name) {
      case 'schema':
        try {
          const schema = JSON.parse(value) as SmartFormConfig;
          const form = new Form(crypto.randomUUID(), schema);
          this.setForm(form);
        } catch (error) {
          console.error('Invalid schema format:', error);
        }
        break;
      case 'validate-on-change':
        if (this.form) {
          (this.form.config as SmartFormConfig).validateOnChange = value !== null;
        }
        break;
    }
  }

  /**
   * Cleanup
   */
  protected override cleanup(): void {
    super.cleanup();
    this.container = null;
    this.fieldsContainer = null;
    this.submitButton = null;
  }
}

// Register custom element
customElements.define('smart-form', SmartFormElement);
