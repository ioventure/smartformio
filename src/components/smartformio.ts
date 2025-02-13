import { setupFormEvents } from "../events/form.event";
import { FormSchema } from "../interfaces/form.interface";
import { renderForm } from "../renderer/form.renderer";

/**
 * SmartFormIO is a framework-agnostic web component for rendering dynamic forms.
 *
 * The component accepts a JSON schema via the `schema` attribute and optionally an
 * attribute `disable-default-styles` to prevent the injection of built-in default styles.
 *
 * Styling can be fully controlled externally by providing your own stylesheet.
 *
 * Future improvements will extend support for additional input types, advanced validation,
 * conditional rendering, and other dynamic behaviors.
 */
export class SmartFormIO extends HTMLElement {
  private shadow: ShadowRoot;
  private schema: FormSchema | null = null;

  constructor() {
    super();
    // Attach an open shadow DOM so that parent applications can style via CSS parts.
    this.shadow = this.attachShadow({ mode: "open" });
  }

  /**
   * Called when the component is added to the DOM.
   * Parses the JSON schema provided via the "schema" attribute and triggers rendering.
   */
  connectedCallback(): void {
    const schemaAttr = this.getAttribute("schema");
    if (schemaAttr) {
      try {
        this.schema = JSON.parse(schemaAttr);
        // Start asynchronous rendering of the form.
        this.renderComponent();
      } catch (error) {
        console.error("Invalid JSON schema provided:", error);
      }
    } else {
      console.warn("No schema attribute provided on <smart-form-io>.");
    }
  }

  /**
   * Asynchronously renders the form markup (with or without default styles)
   * and attaches event listeners for form submission.
   */
  private async renderComponent(): Promise<void> {
    if (!this.schema) return;

    // Check if default styling should be disabled.
    // When the attribute `disable-default-styles` is present, default styles are not loaded.
    const disableDefaultStyles = this.hasAttribute("disable-default-styles");

    // Await the asynchronous renderer function.
    const markup = await renderForm(this.schema, { disableDefaultStyles });

    // Inject the markup (including styles if enabled) into the Shadow DOM.
    this.shadow.innerHTML = markup;

    // Setup the form submission event listener.
    setupFormEvents(this.shadow, (data: Record<string, any>) => {
      this.dispatchEvent(
        new CustomEvent("smartformio:submit", {
          detail: data,
          bubbles: true,
          composed: true,
        })
      );
    });
  }
}

// Define the custom element so it can be used in HTML as <smart-form-io>
customElements.define("smart-form-io", SmartFormIO);
