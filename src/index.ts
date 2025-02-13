// Import the SmartFormIO web component to register it.
import "./web-components/smartform";

// Optionally export the core web component and interfaces.
export { SmartForm } from "./web-components/smartform";
export * from "./interfaces";

// Export the React wrapper for convenience.
// Use the same relative path as in your source structure.
export { default as SmartFormReact } from "./wrappers/React/smartform.react.wrapper";
