import "@testing-library/jest-dom";

// Set NODE_ENV to test
process.env.NODE_ENV = "test";

// Mock CustomEvent
class CustomEventPolyfill extends Event {
  detail: any;

  constructor(type: string, options?: CustomEventInit) {
    super(type, options);
    this.detail = options?.detail;
  }
}

global.CustomEvent = CustomEventPolyfill as any;

// Mock Web Components API
class MockElement extends HTMLElement {
  private _shadow: ShadowRoot;
  private _schema: string = "";

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  get shadowRoot() {
    return this._shadow;
  }

  get schema() {
    return this._schema;
  }

  set schema(value: string) {
    this._schema = value;
    this.render();
  }

  private render() {
    try {
      if (this._schema) {
        const schema = JSON.parse(this._schema);
        this._shadow.innerHTML = `
          <form id="smartform">
            ${
              schema.fields
                ?.map(
                  (field: any) => `
              <input 
                type="${field.type}" 
                name="${field.name}"
                ${field.required ? "required" : ""}
                ${field.validationMessage ? `validationMessage="${field.validationMessage}"` : ""}
              />
            `
                )
                .join("") || ""
            }
          </form>
        `;
      } else {
        this._shadow.innerHTML = '<form id="smartform"></form>';
      }
    } catch (error) {
      // Don't log error in test environment
      this._shadow.innerHTML = `
        <div class="error">
          <p>Error rendering form</p>
        </div>
      `;
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "schema" && newValue !== oldValue) {
      this.schema = newValue;
    }
  }

  static get observedAttributes() {
    return ["schema"];
  }
}

// Setup test environment
beforeAll(() => {
  // Mock customElements.define to avoid registration issues
  const originalDefine = window.customElements.define;
  window.customElements.define = jest.fn(
    (name: string, constructor: CustomElementConstructor) => {
      try {
        originalDefine.call(window.customElements, name, constructor);
      } catch (error) {
        // Ignore already registered error
        if (
          !(error instanceof Error) ||
          !error.message.includes("already been registered")
        ) {
          throw error;
        }
      }
    }
  );

  // Define the mock element
  window.customElements.define("smart-form-io", MockElement);
});

beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
  document.body.innerHTML = "";
});

afterEach(() => {
  // Clean up after each test
  document.body.innerHTML = "";
  jest.restoreAllMocks();
});

// Export types and mocks for test files
export type { CustomEventPolyfill };
export { MockElement };
