import { SmartFormIO } from "../src/components/form.component";

describe("SmartFormIO Component", () => {
  beforeAll(() => {
    if (!customElements.get("smart-form-io")) {
      customElements.define("smart-form-io", SmartFormIO);
    }
  });

  test("should render form title from schema", () => {
    document.body.innerHTML = `
      <smart-form-io id="testForm" schema='{"title": "Test Form", "fields": []}'></smart-form-io>
    `;
    const element = document.getElementById("testForm") as SmartFormIO;
    // Allow time for connectedCallback to fire
    setTimeout(() => {
      const shadow = element.shadowRoot;
      expect(shadow?.querySelector("h2")?.textContent).toBe("Test Form");
    }, 0);
  });
});
