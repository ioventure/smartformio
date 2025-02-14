import { setupFormEvents } from "../events/form.event";
import { FormSchema } from "../interfaces/form.interface";
import { renderForm } from "../renderer/form.renderer";

/**
 * SmartForm is a framework-agnostic web component for rendering dynamic forms.
 *
 * It accepts a JSON schema via the "schema" attribute and provides real-time validation,
 * customizable styling through CSS parts, and framework-specific wrappers.
 *
 * @example
 * ```html
 * <smart-form-io id="myForm"></smart-form-io>
 *
 * <script>
 *   const form = document.getElementById('myForm');
 *   form.setAttribute('schema', JSON.stringify({
 *     fields: [
 *       { type: "text", name: "username", required: true }
 *     ]
 *   }));
 *
 *   form.addEventListener('smartformio:submit', (e) => {
 *     console.log(e.detail);
 *   });
 * </script>
 * ```
 */
export class SmartForm extends HTMLElement {
  private shadow: ShadowRoot;
  private schema: FormSchema | null = null;

  /**
   * List of attributes to observe for changes.
   */
  static get observedAttributes() {
    return ["schema"];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  /**
   * Called when the element is connected to the DOM.
   * Initializes the form if schema is provided.
   */
  connectedCallback(): void {
    try {
      const schemaAttr = this.getAttribute("schema");
      if (schemaAttr) {
        this.parseAndRenderSchema(schemaAttr);
      }
    } catch (error) {
      console.error("Error in connectedCallback:", error);
      this.renderError("Failed to initialize form");
    }
  }

  /**
   * Called when observed attributes change.
   * Re-renders the form when schema changes.
   */
  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    try {
      if (name === "schema" && newValue !== oldValue) {
        this.parseAndRenderSchema(newValue);
      }
    } catch (error) {
      console.error("Error in attributeChangedCallback:", error);
      this.renderError("Failed to update form");
    }
  }

  /**
   * Parses the schema JSON string and triggers rendering.
   */
  private parseAndRenderSchema(schemaAttr: string): void {
    try {
      this.schema = JSON.parse(schemaAttr);
      this.renderComponent();
    } catch (error) {
      console.error("Invalid JSON schema provided:", error);
      this.renderError("Invalid form configuration");
    }
  }

  /**
   * Renders an error message in the shadow DOM.
   */
  private renderError(message: string): void {
    this.shadow.innerHTML = `
      <div part="container error">
        <p part="error-text">${message}</p>
      </div>
    `;
  }

  /**
   * Renders the form component in the shadow DOM.
   */
  private async renderComponent(): Promise<void> {
    if (!this.schema) return;

    try {
      const markup = await renderForm(this.schema);
      this.shadow.innerHTML = markup;

      setupFormEvents(this.shadow, this.schema, (data: Record<string, any>) => {
        this.dispatchEvent(
          new CustomEvent("smartformio:submit", {
            detail: data,
            bubbles: true,
            composed: true,
          })
        );
      });
    } catch (error) {
      console.error("Error rendering component:", error);
      this.renderError("Failed to render form");
    }
  }
}

// Register the web component
if (!customElements.get("smart-form-io")) {
  customElements.define("smart-form-io", SmartForm);
}
