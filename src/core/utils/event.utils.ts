/**
 * @file Event utility functions and event management
 */

import { FormEvent, FormEventType, EventHandler } from '@interfaces/events/event-handler.interface';
import { ErrorUtils } from './error.utils';
import { CollectionUtils } from '@core/utils/collection.utils';

type EventMap = {
  [K in FormEventType]: Extract<FormEvent, { type: K }>;
};

type EventCallback<T> = (event: T) => void | Promise<void>;
type EventFilter<T> = (event: T) => boolean;

/**
 * Event emitter class with type safety
 */
export class EventEmitter<Events extends Record<string, any>> {
  private handlers = new Map<keyof Events, Set<EventCallback<any>>>();
  private onceHandlers = new Map<keyof Events, Set<EventCallback<any>>>();
  private filters = new Map<keyof Events, EventFilter<any>[]>();

  /**
   * Subscribe to an event
   */
  on<K extends keyof Events>(type: K, handler: EventCallback<Events[K]>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    // Return unsubscribe function
    return () => this.off(type, handler);
  }

  /**
   * Subscribe to an event once
   */
  once<K extends keyof Events>(type: K, handler: EventCallback<Events[K]>): () => void {
    if (!this.onceHandlers.has(type)) {
      this.onceHandlers.set(type, new Set());
    }
    this.onceHandlers.get(type)!.add(handler);

    // Return unsubscribe function
    return () => this.off(type, handler);
  }

  /**
   * Unsubscribe from an event
   */
  off<K extends keyof Events>(type: K, handler: EventCallback<Events[K]>): void {
    this.handlers.get(type)?.delete(handler);
    this.onceHandlers.get(type)?.delete(handler);
  }

  /**
   * Add event filter
   */
  addFilter<K extends keyof Events>(type: K, filter: EventFilter<Events[K]>): () => void {
    if (!this.filters.has(type)) {
      this.filters.set(type, []);
    }
    this.filters.get(type)!.push(filter);

    // Return remove filter function
    return () => this.removeFilter(type, filter);
  }

  /**
   * Remove event filter
   */
  removeFilter<K extends keyof Events>(type: K, filter: EventFilter<Events[K]>): void {
    const filters = this.filters.get(type);
    if (filters) {
      const index = filters.indexOf(filter);
      if (index !== -1) {
        filters.splice(index, 1);
      }
    }
  }

  /**
   * Emit an event
   */
  async emit<K extends keyof Events>(type: K, event: Events[K]): Promise<void> {
    try {
      // Create immutable event
      const immutableEvent = CollectionUtils.deepClone(event);

      // Apply filters
      const filters = this.filters.get(type) || [];
      if (!filters.every((filter) => filter(immutableEvent))) {
        return;
      }

      // Get handlers
      const handlers = this.handlers.get(type) || new Set();
      const onceHandlers = this.onceHandlers.get(type) || new Set();

      // Execute handlers
      const promises: Promise<void>[] = [];

      for (const handler of handlers) {
        promises.push(Promise.resolve(handler(immutableEvent)));
      }

      for (const handler of onceHandlers) {
        promises.push(Promise.resolve(handler(immutableEvent)));
        this.off(type, handler);
      }

      await Promise.all(promises);
    } catch (error) {
      throw ErrorUtils.handleError(error);
    }
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.handlers.clear();
    this.onceHandlers.clear();
    this.filters.clear();
  }
}

export class EventUtils {
  /**
   * Create form event emitter
   */
  static createFormEventEmitter(): EventEmitter<EventMap> {
    return new EventEmitter<EventMap>();
  }

  /**
   * Create event with timestamp
   */
  static createEvent<T extends FormEvent>(type: T['type'], data: Omit<T, 'type' | 'timestamp'>): T {
    return CollectionUtils.deepClone({
      type,
      timestamp: Date.now(),
      ...data,
    }) as T;
  }

  /**
   * Create event handler
   */
  static createEventHandler<T extends FormEvent>(handler: EventHandler<T>): EventHandler<T> {
    return async (event: T) => {
      try {
        await handler(event);
      } catch (error) {
        throw ErrorUtils.handleError(error);
      }
    };
  }

  /**
   * Create event filter
   */
  static createEventFilter<T extends FormEvent>(predicate: (event: T) => boolean): EventFilter<T> {
    return (event: T) => {
      try {
        return predicate(event);
      } catch {
        return false;
      }
    };
  }

  /**
   * Debounce event handler
   */
  static debounceEventHandler<T extends FormEvent>(
    handler: EventHandler<T>,
    delay: number
  ): EventHandler<T> {
    let timeoutId: NodeJS.Timeout;

    return (event: T) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handler(event), delay);
    };
  }

  /**
   * Throttle event handler
   */
  static throttleEventHandler<T extends FormEvent>(
    handler: EventHandler<T>,
    limit: number
  ): EventHandler<T> {
    let inThrottle = false;

    return (event: T) => {
      if (!inThrottle) {
        handler(event);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Create composite event handler
   */
  static composeEventHandlers<T extends FormEvent>(
    ...handlers: EventHandler<T>[]
  ): EventHandler<T> {
    const uniqueHandlers = CollectionUtils.unique(handlers);
    return async (event: T) => {
      const immutableEvent = CollectionUtils.deepClone(event);
      for (const handler of uniqueHandlers) {
        await handler(immutableEvent);
      }
    };
  }

  /**
   * Create conditional event handler
   */
  static createConditionalHandler<T extends FormEvent>(
    condition: (event: T) => boolean,
    handler: EventHandler<T>
  ): EventHandler<T> {
    return (event: T) => {
      if (condition(event)) {
        return handler(event);
      }
    };
  }

  /**
   * Create logging event handler
   */
  static createLoggingHandler<T extends FormEvent>(
    handler: EventHandler<T>,
    logger: Console = console
  ): EventHandler<T> {
    return async (event: T) => {
      const immutableEvent = CollectionUtils.deepClone(event);
      const start = Date.now();
      try {
        await handler(immutableEvent);
        logger.log(
          `Event ${immutableEvent.type} handled successfully in ${Date.now() - start}ms`,
          immutableEvent
        );
      } catch (error) {
        logger.error(
          `Error handling event ${immutableEvent.type} after ${Date.now() - start}ms:`,
          error
        );
        throw error;
      }
    };
  }
}
