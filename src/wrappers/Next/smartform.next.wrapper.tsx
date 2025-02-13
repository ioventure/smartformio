"use client";

import React, { useEffect, useMemo, useRef, forwardRef } from "react";
import "../../web-components/smartform"; // Import and register the core web component

// Create a helper component that renders the custom element.
// This avoids using the literal <smart-form-io> tag in JSX.
const SmartFormElement = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>((props, ref) => {
  // We assert the tag name as any to bypass JSX type checking.
  return React.createElement("smart-form-io" as any, { ...props, ref });
});
SmartFormElement.displayName = "SmartFormElement";

export interface SmartFormNextProps {
  schema: Record<string, any>;
  disableDefaultStyles?: boolean;
  onSubmit?: (data: any) => void;
}

/**
 * SmartFormNext is a Next.js wrapper for the SmartFormIO web component.
 * It sets the "schema" attribute, handles the "disable-default-styles" flag,
 * and attaches an event listener for "smartformio:submit".
 */
const SmartFormNext: React.FC<SmartFormNextProps> = ({
  schema,
  disableDefaultStyles = false,
  onSubmit,
}) => {
  const formRef = useRef<HTMLElement>(null);
  const schemaString = useMemo(() => JSON.stringify(schema), [schema]);

  useEffect(() => {
    const currentElement = formRef.current;
    if (!currentElement) return;

    currentElement.setAttribute("schema", schemaString);

    if (disableDefaultStyles) {
      currentElement.setAttribute("disable-default-styles", "");
    } else {
      currentElement.removeAttribute("disable-default-styles");
    }

    const handleSubmit = (event: Event) => {
      if (typeof onSubmit === "function" && event instanceof CustomEvent) {
        onSubmit(event.detail);
      }
    };

    currentElement.addEventListener("smartformio:submit", handleSubmit);
    return () => {
      currentElement.removeEventListener("smartformio:submit", handleSubmit);
    };
  }, [schemaString, disableDefaultStyles, onSubmit]);

  return <SmartFormElement ref={formRef} />;
};

export default SmartFormNext;
