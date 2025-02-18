import { FormSchema } from "@interfaces/core.interface";
import { setupFormEvents } from "@events/form.event";
import { renderForm } from "@renderer/form.renderer";
import { errorHandler } from "@services/error.service";
import { logger } from "@services/logger.service";
import { ComponentErrorDetails } from "@interfaces/error.interface";

/**
 * SmartForm is a framework-agnostic web component for rendering dynamic forms.
 */
export class SmartForm extends HTMLElement {
  private shadow: ShadowRoot;
  private schema: FormSchema | null = null;
  private static readonly logContext = "SmartForm";

  static get observedAttributes() {
    return ["schema"];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    // Add error listener for component-specific errors
    errorHandler.addErrorListener((error) => {
      if (error.type === "component") {
        this.renderError(error.message);
      }
    });
  }

  connectedCallback(): void {
    try {
      logger.info("SmartForm component connected", SmartForm.logContext);
      const schemaAttr = this.getAttribute("schema");
      if (schemaAttr) {
        this.parseAndRenderSchema(schemaAttr);
      }
    } catch (error) {
      const details: ComponentErrorDetails = {
        method: "connectedCallback",
        component: "SmartForm",
      };

      errorHandler.handleComponentError(
        error instanceof Error ? error : new Error(String(error)),
        "INIT_ERROR",
        details
      );
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
        logger.info(
          "Schema attribute changed, updating form",
          SmartForm.logContext
        );
        this.parseAndRenderSchema(newValue);
      }
    } catch (error) {
      const details: ComponentErrorDetails = {
        method: "attributeChangedCallback",
        component: "SmartForm",
        attribute: name,
      };

      errorHandler.handleComponentError(
        error instanceof Error ? error : new Error(String(error)),
        "ATTR_ERROR",
        details
      );
      this.renderError("Failed to update form");
    }
  }

  private parseAndRenderSchema(schemaAttr: string): void {
    try {
      this.schema = JSON.parse(schemaAttr);
      logger.info("Schema parsed successfully", SmartForm.logContext);
      this.renderComponent();
    } catch (error) {
      const details: ComponentErrorDetails = {
        method: "parseAndRenderSchema",
        component: "SmartForm",
        schema: schemaAttr,
      };

      errorHandler.handleComponentError(
        error instanceof Error ? error : new Error(String(error)),
        "SCHEMA_ERROR",
        details
      );
      this.renderError("Invalid form configuration provided");
    }
  }

  private renderError(message: string): void {
    logger.error(
      `Rendering error state: ${message}`,
      new Error(message),
      SmartForm.logContext
    );
    this.shadow.innerHTML = `
      <div part="container error">
        <p part="error-text">${message}</p>
      </div>
    `;
  }

  disconnectedCallback(): void {
    // Clean up error listeners when component is removed
    errorHandler.clearListeners();
    logger.info("SmartForm component disconnected", SmartForm.logContext);
  }

  private async renderComponent(): Promise<void> {
    if (!this.schema) {
      logger.warn("Attempted to render without schema", SmartForm.logContext);
      return;
    }

    try {
      logger.info("Rendering form component", SmartForm.logContext);
      const markup = await renderForm(this.schema);
      this.shadow.innerHTML = markup;

      // Setup form validation and submission handling
      setupFormEvents(this.shadow, this.schema);
      logger.info("Form rendered successfully", SmartForm.logContext);
    } catch (error) {
      const details: ComponentErrorDetails = {
        method: "renderComponent",
        component: "SmartForm",
      };

      errorHandler.handleComponentError(
        error instanceof Error ? error : new Error(String(error)),
        "RENDER_ERROR",
        details
      );
      this.renderError("Failed to render form");
    }
  }
}

// Register the web component if not already defined.
if (!customElements.get("smart-form-io")) {
  customElements.define("smart-form-io", SmartForm);
}
