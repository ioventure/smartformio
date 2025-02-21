/**
 * @file Base form element implementation
 */

import { Form } from '@domain/form';
import { IEventHandler } from '@interfaces/events/event-handler.interface';

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
    return ['disabled', 'readonly'];
  }

  /**
   * Set form data
   */
  setForm(form: Form): void {
    this.form = form;
    this.render();
  }

  /**
   * Get current form
   */
  getForm(): Form | null {
    return this.form ?? null;
  }

  /**
   * Handle attribute changes
   */
  protected handleAttributeChange(name: string, value: string): void {
    if (this.form) {
      switch (name) {
        case 'disabled':
          this.form.config.disabled = value !== null;
          break;
        case 'readonly':
          this.form.config.readonly = value !== null;
          break;
      }
    }
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
