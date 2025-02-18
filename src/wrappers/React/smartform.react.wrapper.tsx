import React, { useEffect, useRef, useCallback } from "react";
import { SmartForm } from "@web-components/smartform";
import {
  SmartFormIOElement,
  SmartFormIOAttributes,
  SmartFormEvents,
  SmartFormReactProps,
} from "@interfaces/components.interface";

type SmartFormIOProps = SmartFormIOAttributes & {
  ref?: React.RefObject<SmartFormIOElement>;
  className?: string;
};

// Extend the JSX namespace
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "smart-form-io": SmartFormIOProps;
    }
  }
}

/**
 * React wrapper for SmartForm web component
 * Handles SSR and client-side rendering appropriately
 */
export const SmartFormReact: React.FC<SmartFormReactProps> = ({
  schema,
  onSubmit,
  onError,
  onChange,
  className,
}) => {
  const formRef = useRef<SmartFormIOElement>(null);
  const isSSR = SmartForm.isServerSide();

  const setupEventListeners = useCallback(() => {
    const formElement = formRef.current;
    if (!formElement) return;

    const eventHandlers: {
      [K in keyof SmartFormEvents]: (e: SmartFormEvents[K]) => void;
    } = {
      "smartformio:submit": (e) => onSubmit?.(e.detail),
      "smartformio:error": (e) => onError?.(e.detail),
      "smartformio:change": (e) => onChange?.(e.detail),
    };

    // Add event listeners
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      formElement.addEventListener(event, handler as EventListener);
    });

    // Cleanup function
    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        formElement.removeEventListener(event, handler as EventListener);
      });
    };
  }, [onSubmit, onError, onChange]);

  useEffect(() => {
    if (!isSSR) {
      return setupEventListeners();
    }
    return;
  }, [setupEventListeners, isSSR]);

  // If in SSR environment, render a placeholder
  if (isSSR) {
    return (
      <div
        data-smartform-ssr-placeholder
        className={className}
        data-schema={JSON.stringify(schema)}
      />
    );
  }

  // Cast ref to any to avoid type conflicts with custom elements
  const elementProps = {
    ref: formRef as any,
    schema: JSON.stringify(schema),
    className,
  };

  return <smart-form-io {...elementProps} />;
};

// Add display name for better debugging
SmartFormReact.displayName = "SmartFormReact";
