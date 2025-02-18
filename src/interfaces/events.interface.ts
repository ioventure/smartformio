/**
 * Custom form event types
 */

export interface IFormSubmitEvent extends CustomEvent<Record<string, any>> {
  type: "smartformio:submit";
}

export interface IFormSuccessEvent
  extends CustomEvent<{
    data: Record<string, any>;
    response: any;
  }> {
  type: "smartformio:success";
}

export interface IFormErrorEvent
  extends CustomEvent<{
    data: Record<string, any>;
    error: any;
  }> {
  type: "smartformio:error";
}

/**
 * Event names as constants
 */
export const FORM_EVENTS = {
  SUBMIT: "smartformio:submit",
  SUCCESS: "smartformio:success",
  ERROR: "smartformio:error",
} as const;

/**
 * Event listener types
 */
export type FormSubmitListener = (event: IFormSubmitEvent) => void;
export type FormSuccessListener = (event: IFormSuccessEvent) => void;
export type FormErrorListener = (event: IFormErrorEvent) => void;

/**
 * Helper to create typed event listeners
 */
export const createEventListeners = (formElement: HTMLElement) => ({
  onSubmit: (listener: FormSubmitListener) => {
    formElement.addEventListener(FORM_EVENTS.SUBMIT, listener as EventListener);
  },
  onSuccess: (listener: FormSuccessListener) => {
    formElement.addEventListener(
      FORM_EVENTS.SUCCESS,
      listener as EventListener
    );
  },
  onError: (listener: FormErrorListener) => {
    formElement.addEventListener(FORM_EVENTS.ERROR, listener as EventListener);
  },
});
