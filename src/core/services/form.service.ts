/**
 * @file Form service implementation
 */

import { Form, FormConfig } from '@domain/form';
import { Field, FieldConfig, FieldType } from '@domain/field';
import { IFormRenderer, RenderOptions } from '@interfaces/renderers/form-renderer.interface';
import { IFormValidator } from '@interfaces/validators/validator.interface';
import { IEventHandler, FormEventType } from '@interfaces/events/event-handler.interface';

export interface FormServiceConfig {
  renderer: IFormRenderer;
  validator?: IFormValidator;
  eventHandler: IEventHandler;
}

export class FormService {
  private forms: Map<string, Form> = new Map();

  constructor(private config: FormServiceConfig) {}

  /**
   * Create a new form
   */
  createForm(formConfig: FormConfig): Form {
    const form = new Form(crypto.randomUUID(), formConfig);
    this.forms.set(form.id, form);
    return form;
  }

  /**
   * Get form by ID
   */
  getForm(id: string): Form | undefined {
    return this.forms.get(id);
  }

  /**
   * Delete form by ID
   */
  deleteForm(id: string): void {
    const form = this.forms.get(id);
    if (form) {
      this.config.eventHandler.emit({
        type: FormEventType.DESTROY,
        timestamp: Date.now(),
        form,
      });
      this.forms.delete(id);
    }
  }

  /**
   * Add field to form
   */
  addField(formId: string, name: string, type: FieldType, config: FieldConfig): Field | undefined {
    const form = this.forms.get(formId);
    if (!form) return;

    const field = form.addField(name, type, config);
    this.config.renderer.renderField(field, document.createElement('div'));
    return field;
  }

  /**
   * Remove field from form
   */
  removeField(formId: string, fieldName: string): void {
    const form = this.forms.get(formId);
    if (!form) return;

    const field = form.getField(fieldName);
    if (field) {
      this.config.eventHandler.emit({
        type: FormEventType.DESTROY,
        timestamp: Date.now(),
        form,
      });
    }
  }

  /**
   * Render form
   */
  renderForm(formId: string, options: RenderOptions): void {
    const form = this.forms.get(formId);
    if (!form) return;

    this.config.renderer.renderForm(form, options);
  }

  /**
   * Update form
   */
  updateForm(formId: string): void {
    const form = this.forms.get(formId);
    if (!form) return;

    this.config.renderer.updateForm(form);
  }

  /**
   * Update field
   */
  updateField(formId: string, fieldName: string): void {
    const form = this.forms.get(formId);
    if (!form) return;

    const field = form.getField(fieldName);
    if (field) {
      this.config.renderer.updateField(field);
    }
  }

  /**
   * Validate form
   */
  validateForm(formId: string): boolean {
    const form = this.forms.get(formId);
    if (!form || !this.config.validator) return false;

    const validationResult = this.config.validator.validateForm(form);

    this.config.eventHandler.emit({
      type: FormEventType.FORM_VALIDATION,
      timestamp: Date.now(),
      form,
      validationResult,
    });

    return validationResult.isValid;
  }

  /**
   * Validate field
   */
  validateField(formId: string, fieldName: string): boolean {
    const form = this.forms.get(formId);
    if (!form || !this.config.validator) return false;

    const field = form.getField(fieldName);
    if (!field) return false;

    const validationResult = this.config.validator.validateField(form, fieldName);

    if (validationResult) {
      this.config.eventHandler.emit({
        type: FormEventType.FIELD_VALIDATION,
        timestamp: Date.now(),
        field,
        formId: form.id,
        validationResult,
      });
    }

    return validationResult?.isValid ?? false;
  }

  /**
   * Reset form
   */
  resetForm(formId: string): void {
    const form = this.forms.get(formId);
    if (!form) return;

    form.reset();
    this.config.renderer.updateForm(form);

    this.config.eventHandler.emit({
      type: FormEventType.FORM_RESET,
      timestamp: Date.now(),
      form,
    });
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.forms.clear();
    this.config.renderer.cleanup();
  }
}
