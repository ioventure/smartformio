/**
 * @file Global type declarations for SmartFormIO
 */

// Declare custom elements
declare namespace JSX {
  interface IntrinsicElements {
    "smart-form": any;
    "smart-text-field": any;
    "smart-select-field": any;
    "smart-checkbox-field": any;
    "smart-radio-field": any;
    "smart-file-field": any;
    "smart-date-field": any;
  }
}

// Declare custom element classes
declare global {
  interface HTMLElementTagNameMap {
    "smart-form": import("./core").SmartFormElement;
    "smart-text-field": import("./core").TextFieldElement;
    "smart-select-field": import("./core").SelectFieldElement;
    "smart-checkbox-field": import("./core").CheckboxFieldElement;
    "smart-radio-field": import("./core").RadioFieldElement;
    "smart-file-field": import("./core").FileFieldElement;
    "smart-date-field": import("./core").DateFieldElement;
  }
}

// Declare module for CSS modules
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Declare module for SVG imports
declare module "*.svg" {
  const content: string;
  export default content;
}

// Declare custom event types
declare global {
  interface WindowEventMap {
    "smartformio:submit": CustomEvent<import("./core").IFormSubmitEvent>;
    "smartformio:change": CustomEvent<import("./core").IFieldEvent>;
    "smartformio:validation": CustomEvent<
      import("./core").IFormValidationEvent
    >;
    "smartformio:error": CustomEvent<Error>;
  }
}

// Declare SmartFormIO namespace
declare namespace SmartFormIO {
  // Export all types from core
  export * from "./core";

  // Export React wrapper types
  export interface ReactProps {
    schema: import("./core").FormConfig;
    onSubmit?: (data: any) => void;
    onChange?: (data: any) => void;
    onError?: (error: Error) => void;
    className?: string;
  }

  // Export Next.js wrapper types
  export interface NextProps extends ReactProps {
    // Additional Next.js specific props can be added here
  }
}

// Export SmartFormIO namespace
export as namespace SmartFormIO;

// Export default initialize function
export default function initialize(
  config?: SmartFormIO.SmartFormIOConfig
): void;
