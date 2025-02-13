import React, { useEffect, useMemo, useRef, forwardRef } from "react";
import "../../web-components/smartform"; // Import and register the core web component

// Create a React component that renders the custom element using React.createElement.
// Using forwardRef allows us to pass a ref to the underlying custom element.
const SmartFormElement = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>((props, ref) => {
  return React.createElement("smart-form-io", { ...props, ref });
});
SmartFormElement.displayName = "SmartFormElement";

export interface SmartFormIOProps {
  schema: Record<string, any>;
  disableDefaultStyles?: boolean;
  onSubmit?: (data: any) => void;
}

/**
 * SmartFormReact is a React wrapper for the SmartFormIO web component.
 * It handles:
 * - Serializing the schema and setting it as an attribute.
 * - Managing the "disable-default-styles" attribute.
 * - Attaching an event listener for the "smartformio:submit" event.
 */
const SmartFormReact: React.FC<SmartFormIOProps> = ({
  schema,
  disableDefaultStyles = false,
  onSubmit,
}) => {
  const formRef = useRef<HTMLElement>(null);

  // Memoize the schema JSON string to avoid unnecessary recalculations.
  const schemaString = useMemo(() => JSON.stringify(schema), [schema]);

  useEffect(() => {
    const currentElement = formRef.current;
    if (!currentElement) return;

    // Set the schema attribute.
    currentElement.setAttribute("schema", schemaString);

    // Set or remove the disable-default-styles attribute.
    if (disableDefaultStyles) {
      currentElement.setAttribute("disable-default-styles", "");
    } else {
      currentElement.removeAttribute("disable-default-styles");
    }

    // Event handler for form submission.
    const handleSubmit = (event: Event) => {
      if (typeof onSubmit === "function" && event instanceof CustomEvent) {
        onSubmit(event.detail);
      }
    };

    currentElement.addEventListener("smartformio:submit", handleSubmit);

    // Cleanup the event listener.
    return () => {
      currentElement.removeEventListener("smartformio:submit", handleSubmit);
    };
  }, [schemaString, disableDefaultStyles, onSubmit]);

  return <SmartFormElement ref={formRef} />;
};

export default SmartFormReact;
