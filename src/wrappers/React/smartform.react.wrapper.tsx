import React, { useEffect, useMemo, useRef, forwardRef } from "react";
import "../../web-components/smartform";

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
  /** The form schema that defines the structure and validation rules */
  schema: Record<string, any>;
  /** Callback function called when form is submitted */
  onSubmit?: (data: any) => void;
}

/**
 * SmartFormReact is a React wrapper for the SmartFormIO web component.
 *
 * @component
 * @example
 * ```tsx
 * import { SmartFormReact } from '@ioventure/smartformio';
 *
 * const MyForm = () => {
 *   const schema = {
 *     fields: [
 *       { type: "text", name: "username", required: true }
 *     ]
 *   };
 *
 *   return (
 *     <SmartFormReact
 *       schema={schema}
 *       onSubmit={(data) => console.log(data)}
 *     />
 *   );
 * };
 * ```
 */
export const SmartFormReact: React.FC<SmartFormIOProps> = ({
  schema,
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
  }, [schemaString, onSubmit]);

  return <SmartFormElement ref={formRef} />;
};
