// Import the SmartFormIO web component to register it.
import "./web-components/smartform";

// Optionally export the core web component and interfaces.
export { SmartForm } from "./web-components/smartform";
export * from "./interfaces";

export { default as SmartFormReact } from "./wrappers/React/smartform.react.wrapper";
export { default as SmartFormNext } from "./wrappers/Next/smartform.next.wrapper";
