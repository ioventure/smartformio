/**
 * @file Event system interface definitions
 */

import { Field } from '@domain/field';
import { Form } from '@domain/form';
import { ValidationResult, FormValidationResult } from '@domain/validation';

/**
 * Form event types
 */
export enum FormEventType {
  // Field Events
  FIELD_CHANGE = 'field:change',
  FIELD_BLUR = 'field:blur',
  FIELD_FOCUS = 'field:focus',
  FIELD_VALIDATION = 'field:validation',

  // Form Events
  FORM_SUBMIT = 'form:submit',
  FORM_RESET = 'form:reset',
  FORM_VALIDATION = 'form:validation',
  FORM_ERROR = 'form:error',

  // Lifecycle Events
  INIT = 'init',
  DESTROY = 'destroy',
}

/**
 * Base event interface
 */
export interface IFormEvent {
  type: FormEventType;
  timestamp: number;
}

/**
 * Field-related event data
 */
export interface IFieldEvent extends IFormEvent {
  field: Field;
  formId: string;
}

export interface IFieldChangeEvent extends IFieldEvent {
  type: FormEventType.FIELD_CHANGE;
  previousValue: any;
  currentValue: any;
}

export interface IFieldValidationEvent extends IFieldEvent {
  type: FormEventType.FIELD_VALIDATION;
  validationResult: ValidationResult;
}

/**
 * Form-related event data
 */
export interface IFormSubmitEvent extends IFormEvent {
  type: FormEventType.FORM_SUBMIT;
  form: Form;
  values: Record<string, any>;
}

export interface IFormValidationEvent extends IFormEvent {
  type: FormEventType.FORM_VALIDATION;
  form: Form;
  validationResult: FormValidationResult;
}

export interface IFormErrorEvent extends IFormEvent {
  type: FormEventType.FORM_ERROR;
  form: Form;
  error: Error;
}

export interface IFormResetEvent extends IFormEvent {
  type: FormEventType.FORM_RESET;
  form: Form;
}

export interface IFormDestroyEvent extends IFormEvent {
  type: FormEventType.DESTROY;
  form: Form;
}

/**
 * Union type of all possible events
 */
export type FormEvent =
  | IFieldChangeEvent
  | IFieldValidationEvent
  | IFormSubmitEvent
  | IFormValidationEvent
  | IFormErrorEvent
  | IFormResetEvent
  | IFormDestroyEvent;

/**
 * Event handler type with type guard
 */
export type EventHandler<T extends FormEvent = FormEvent> = (event: T) => void | Promise<void>;

/**
 * Event handler interface
 */
export interface IEventHandler {
  /**
   * Subscribe to an event with type checking
   */
  on<T extends FormEvent>(type: T['type'], handler: EventHandler<T>): void;

  /**
   * Subscribe to an event once with type checking
   */
  once<T extends FormEvent>(type: T['type'], handler: EventHandler<T>): void;

  /**
   * Unsubscribe from an event
   */
  off<T extends FormEvent>(type: T['type'], handler: EventHandler<T>): void;

  /**
   * Emit an event
   */
  emit(event: FormEvent): void | Promise<void>;

  /**
   * Remove all event handlers
   */
  destroy(): void;
}

/**
 * Base event handler implementation
 */
export abstract class BaseEventHandler implements IEventHandler {
  protected handlers: Map<FormEventType, Set<EventHandler>> = new Map();
  protected oneTimeHandlers: Map<FormEventType, Set<EventHandler>> = new Map();

  on<T extends FormEvent>(type: T['type'], handler: EventHandler<T>): void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler as EventHandler);
  }

  once<T extends FormEvent>(type: T['type'], handler: EventHandler<T>): void {
    if (!this.oneTimeHandlers.has(type)) {
      this.oneTimeHandlers.set(type, new Set());
    }
    this.oneTimeHandlers.get(type)!.add(handler as EventHandler);
  }

  off<T extends FormEvent>(type: T['type'], handler: EventHandler<T>): void {
    this.handlers.get(type)?.delete(handler as EventHandler);
    this.oneTimeHandlers.get(type)?.delete(handler as EventHandler);
  }

  async emit(event: FormEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || new Set();
    const oneTimeHandlers = this.oneTimeHandlers.get(event.type) || new Set();

    // Execute regular handlers
    for (const handler of handlers) {
      await handler(event);
    }

    // Execute one-time handlers and remove them
    for (const handler of oneTimeHandlers) {
      await handler(event);
      this.off(event.type, handler);
    }
  }

  destroy(): void {
    this.handlers.clear();
    this.oneTimeHandlers.clear();
  }

  protected createEvent<T extends FormEvent>(
    type: T['type'],
    data: Omit<T, 'type' | 'timestamp'>
  ): T {
    return {
      type,
      timestamp: Date.now(),
      ...data,
    } as T;
  }
}
