import { setupFormEvents } from "../events/form.event";
import { FormSchema } from "../interfaces/form.interface";
import { renderForm } from "../renderer/form.renderer";

/**
 * SmartFormIO is a framework-agnostic web component for rendering dynamic forms.
 *
 * It accepts a JSON schema via the "schema" attribute. The component observes this
 * attribute so that any changes are automatically parsed and re-rendered.
 */
export class SmartFormIO extends HTMLElement {
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
    const schemaAttr = this.getAttribute("schema");
    if (schemaAttr) {
      this.parseAndRenderSchema(schemaAttr);
    }
    // Removed warning to avoid issues in React where the attribute is set asynchronously.
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === "schema" && newValue !== oldValue) {
      this.parseAndRenderSchema(newValue);
    }
  }

  private parseAndRenderSchema(schemaAttr: string): void {
    try {
      this.schema = JSON.parse(schemaAttr);
      this.renderComponent();
    } catch (error) {
      console.error("Invalid JSON schema provided:", error);
    }
  }

  private async renderComponent(): Promise<void> {
    if (!this.schema) return;

    const disableDefaultStyles = this.hasAttribute("disable-default-styles");

    const markup = await renderForm(this.schema, { disableDefaultStyles });
    this.shadow.innerHTML = markup;

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

customElements.define("smart-form-io", SmartFormIO);
