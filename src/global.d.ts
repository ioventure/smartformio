/**
 * Global type declarations for SmartFormIO
 */

import { FormSchema } from "./interfaces/form.interface";

declare global {
  /**
   * Custom Events
   */
  interface WindowEventMap {
    "smartformio:submit": CustomEvent<Record<string, any>>;
  }

  /**
   * SmartFormIO Web Component
   */
  interface HTMLElementTagNameMap {
    "smart-form-io": SmartFormIOElement;
  }

  /**
   * SmartFormIO Element Interface
   */
  interface SmartFormIOElement extends HTMLElement {
    /**
     * The form schema as a JSON string
     */
    schema: string;

    /**
     * Event handler for form submission
     */
    onSubmit?: (event: CustomEvent<Record<string, any>>) => void;
  }

  /**
   * SmartFormIO Attributes
   */
  interface SmartFormIOAttributes {
    /**
     * The form schema as a JSON string
     */
    schema?: string;

    /**
     * Whether to disable default styles
     */
    "disable-default-styles"?: "";
  }

  /**
   * SmartFormIO Events
   */
  interface SmartFormIOEventMap {
    /**
     * Fired when the form is submitted
     */
    "smartformio:submit": CustomEvent<Record<string, any>>;
  }

  /**
   * SmartFormIO Parts
   */
  interface SmartFormIOParts {
    container: string;
    title: string;
    field: string;
    label: string;
    "input-wrapper": string;
    input: string;
    "input-invalid": string;
    "help-text": string;
    "error-text": string;
    button: string;
    "leading-icon": string;
    "trailing-icon": string;
    "checkbox-group": string;
    "checkbox-container": string;
    "checkbox-label": string;
    "checkbox-description": string;
    "radio-group": string;
    "radio-label": string;
  }

  namespace JSX {
    interface IntrinsicElements {
      "smart-form-io": React.DetailedHTMLProps<
        React.HTMLAttributes<SmartFormIOElement> & SmartFormIOAttributes,
        SmartFormIOElement
      >;
    }
  }
}

/**
 * Augment the HTMLElementTagNameMap interface
 */
declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    schema?: string;
    "disable-default-styles"?: boolean;
  }
}

export {};
