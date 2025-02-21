/**
 * @file Base form element implementation
 */

import { Form } from '@domain/form';
import { IEventHandler } from '@interfaces/events/event-handler.interface';
import { CollectionUtils } from '@core/utils/collection.utils';

export abstract class BaseFormElement extends HTMLElement {
  protected form?: Form | null;
  protected shadow: ShadowRoot;
  protected eventHandler: IEventHandler;

  constructor(eventHandler: IEventHandler) {
    super();
    this.eventHandler = eventHandler;
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  /**
   * Get observed attributes
   */
  public static get observedAttributes(): string[] {
    return CollectionUtils.unique(['disabled', 'readonly']);
  }

  /**
   * Set form data
   */
  setForm(form: Form): void {
    this.form = CollectionUtils.deepClone(form);
    this.render();
  }

  /**
   * Get current form
   */
  getForm(): Form | null {
    return this.form ? CollectionUtils.deepClone(this.form) : null;
  }

  /**
   * Handle attribute changes
   */
  protected handleAttributeChange(name: string, value: string): void {
    if (!this.form) return;

    // Create a new form with updated config
    const newConfig = {
      ...this.form.config,
      disabled: name === 'disabled' ? Boolean(value !== null) : Boolean(this.form.config.disabled),
      readonly: name === 'readonly' ? Boolean(value !== null) : Boolean(this.form.config.readonly),
    };

    // Create new form instance with updated config
    this.form = new Form(this.form.id, CollectionUtils.deepClone(newConfig));

    this.render();
  }

  /**
   * Lifecycle: attributeChangedCallback
   */
  attributeChangedCallback(name: string, _oldValue: string, newValue: string): void {
    this.handleAttributeChange(name, newValue);
  }

  /**
   * Lifecycle: connectedCallback
   */
  connectedCallback(): void {
    this.render();
  }

  /**
   * Lifecycle: disconnectedCallback
   */
  disconnectedCallback(): void {
    this.cleanup();
  }

  /**
   * Render method to be implemented by subclasses
   */
  protected abstract render(): void;

  /**
   * Cleanup method
   */
  protected cleanup(): void {
    this.form = null;
  }
}
