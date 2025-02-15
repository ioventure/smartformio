import { FormSchema } from "@interfaces/core.interface";
import { setupFormEvents } from "@events/form.event";
import { renderForm } from "@renderer/form.renderer";

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

  static get observedAttributes() {
    return ["schema"];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

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

  private parseAndRenderSchema(schemaAttr: string): void {
    try {
      this.schema = JSON.parse(schemaAttr);
      this.renderComponent();
    } catch (error) {
      console.error("Invalid JSON schema provided:", error);
      this.renderError("Error rendering form");
    }
  }

  private renderError(message: string): void {
    this.shadow.innerHTML = `
      <div part="container error">
        <p part="error-text">${message}</p>
      </div>
    `;
  }

  private async renderComponent(): Promise<void> {
    if (!this.schema) return;
    try {
      const markup = await renderForm(this.schema);
      this.shadow.innerHTML = markup;

      // Setup form validation and submission handling
      setupFormEvents(
        this.shadow,
        this.schema,
        (formData: Record<string, any>) => {
          this.dispatchEvent(
            new CustomEvent("smartformio:submit", {
              detail: formData,
              bubbles: true,
              composed: true,
            })
          );
        }
      );
    } catch (error) {
      console.error("Error rendering component:", error);
      this.renderError("Failed to render form");
    }
  }
}

// Register the web component if not already defined.
if (!customElements.get("smart-form-io")) {
  customElements.define("smart-form-io", SmartForm);
}
