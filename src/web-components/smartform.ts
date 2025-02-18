import { FormSchema } from "@interfaces/core.interface";
import { formEventHandler } from "@events/form.event";
import { formRenderer } from "@renderer/form.renderer";
import { errorHandler } from "@services/error.service";
import { logger } from "@services/logger.service";
import { ComponentErrorDetails } from "@interfaces/error.interface";
import { formService } from "@services/form.service";

/**
 * SmartForm is a framework-agnostic web component for rendering dynamic forms.
 * Implements singleton pattern and SSR compatibility.
 */
export class SmartForm extends HTMLElement {
  private shadow!: ShadowRoot;
  private schema: FormSchema | null = null;
  private formId!: string;
  private static readonly logContext = "SmartForm";
  private static instanceCount = 0;

  // Static method to check if we're in SSR environment
  public static isServerSide(): boolean {
    return typeof window === "undefined";
  }

  static get observedAttributes() {
    return ["schema"];
  }

  constructor() {
    super();

    // Skip initialization if in SSR environment
    if (SmartForm.isServerSide()) {
      return;
    }

    this.formId = `smartform-${SmartForm.instanceCount++}`;
    this.shadow = this.attachShadow({ mode: "open" });

    // Add error listener for component-specific errors
    errorHandler.addErrorListener((error) => {
      if (error.type === "component") {
        this.renderError(error.message);
      }
    });

    logger.info(
      `SmartForm instance ${this.formId} created`,
      SmartForm.logContext
    );
  }

  connectedCallback(): void {
    // Skip if in SSR environment
    if (SmartForm.isServerSide()) {
      return;
    }

    try {
      logger.info(`SmartForm ${this.formId} connected`, SmartForm.logContext);
      const schemaAttr = this.getAttribute("schema");
      if (schemaAttr) {
        this.parseAndRenderSchema(schemaAttr);
      }
    } catch (error) {
      const details: ComponentErrorDetails = {
        method: "connectedCallback",
        component: "SmartForm",
        instanceId: this.formId,
      };

      errorHandler.handleComponentError(
        error instanceof Error ? error : new Error(String(error)),
        "INIT_ERROR",
        details
      );
      this.renderError("Failed to initialize form");
    }
  }

  disconnectedCallback(): void {
    // Skip if in SSR environment
    if (SmartForm.isServerSide()) {
      return;
    }

    // Unregister form instance
    formService.unregisterForm(this.formId);

    // Clean up error listeners
    errorHandler.clearListeners();
    logger.info(`SmartForm ${this.formId} disconnected`, SmartForm.logContext);
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    // Skip if in SSR environment
    if (SmartForm.isServerSide()) {
      return;
    }

    try {
      if (name === "schema" && newValue !== oldValue) {
        logger.info(
          `Schema attribute changed for ${this.formId}, updating form`,
          SmartForm.logContext
        );
        this.parseAndRenderSchema(newValue);
      }
    } catch (error) {
      const details: ComponentErrorDetails = {
        method: "attributeChangedCallback",
        component: "SmartForm",
        attribute: name,
        instanceId: this.formId,
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
      logger.info(
        `Schema parsed successfully for ${this.formId}`,
        SmartForm.logContext
      );
      this.renderComponent();
    } catch (error) {
      const details: ComponentErrorDetails = {
        method: "parseAndRenderSchema",
        component: "SmartForm",
        schema: schemaAttr,
        instanceId: this.formId,
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
      `Rendering error state for ${this.formId}: ${message}`,
      new Error(message),
      SmartForm.logContext
    );
    if (this.shadow) {
      this.shadow.innerHTML = `
        <div part="container error">
          <p part="error-text">${message}</p>
        </div>
      `;
    }
  }

  private async renderComponent(): Promise<void> {
    if (!this.schema) {
      logger.warn(
        `Attempted to render ${this.formId} without schema`,
        SmartForm.logContext
      );
      return;
    }

    try {
      logger.info(
        `Rendering form component ${this.formId}`,
        SmartForm.logContext
      );

      // Use singleton formRenderer instance
      const markup = await formRenderer.render(this.schema);
      this.shadow.innerHTML = markup;

      // Get the form element
      const formElement = this.shadow.querySelector("form") as HTMLFormElement;
      if (!formElement) {
        throw new Error("Form element not found in rendered markup");
      }

      // Register form with the singleton service
      formService.registerForm(this.formId, formElement, this.schema);

      // Setup form validation and submission handling using singleton formEventHandler
      formEventHandler.setupEvents(this.shadow, this.schema, this.formId);

      logger.info(
        `Form ${this.formId} rendered successfully`,
        SmartForm.logContext
      );
    } catch (error) {
      const details: ComponentErrorDetails = {
        method: "renderComponent",
        component: "SmartForm",
        instanceId: this.formId,
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

// Self-executing function for component registration
(() => {
  // Only register in browser environment
  if (!SmartForm.isServerSide() && !customElements.get("smart-form-io")) {
    customElements.define("smart-form-io", SmartForm);
  }
})();
