/**
 * @file Web component related interfaces and types
 */

import { IFormSchema } from "./core.interface";

/**
 * SmartForm web component element interface
 */
export interface ISmartFormIOElement extends HTMLElement {
  schema: string;
  formId: string;
}

/**
 * Custom events interface for SmartForm
 */
export interface ISmartFormEvents {
  "smartformio:submit": CustomEvent<Record<string, unknown>>;
  "smartformio:error": CustomEvent<any[]>;
  "smartformio:change": CustomEvent<any>;
}

/**
 * Props interface for React wrapper
 */
export interface ISmartFormReactProps {
  schema: IFormSchema;
  onSubmit?: (data: any) => void;
  onError?: (errors: any[]) => void;
  onChange?: (data: any) => void;
  className?: string;
}
