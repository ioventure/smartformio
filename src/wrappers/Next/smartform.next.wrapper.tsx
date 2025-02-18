import React from "react";
import type { ComponentType } from "react";
import { SmartFormReactProps } from "@interfaces/components.interface";

// Define loading component props type
interface LoadingProps {
  className?: string;
}

// Loading component with proper typing
const LoadingComponent: React.FC<LoadingProps> = ({ className }) => (
  <div
    data-smartform-loading
    className={className}
    style={{ minHeight: "100px" }}
  />
);

/**
 * Dynamic import type for Next.js
 */
declare function dynamic<P = {}>(
  dynamicOptions: () => Promise<ComponentType<P>>,
  options?: {
    loading?: ComponentType<LoadingProps>;
    ssr?: boolean;
  }
): ComponentType<P>;

/**
 * Dynamic import of the React wrapper with SSR disabled
 * This ensures the web component is only loaded client-side
 */
const SmartFormReactClient = dynamic<SmartFormReactProps>(
  () =>
    import("../React/smartform.react.wrapper").then(
      (mod) => mod.SmartFormReact
    ),
  {
    ssr: false,
    loading: LoadingComponent,
  }
);

/**
 * Next.js wrapper for SmartForm
 * Handles SSR and hydration appropriately
 */
export const SmartFormNext: React.FC<SmartFormReactProps> = (props) => {
  return <SmartFormReactClient {...props} />;
};

// Add display name for better debugging
SmartFormNext.displayName = "SmartFormNext";

// Export the props type for convenience
export type { SmartFormReactProps as SmartFormNextProps };
