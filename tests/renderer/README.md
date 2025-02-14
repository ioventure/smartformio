# Renderer Tests Directory

This directory contains tests related to rendering logic in the SmartFormIO library.

## Files

- `form.renderer.test.ts`: Contains tests for the rendering logic of forms.

## Usage

The tests for rendering logic ensure that the rendering components behave as expected. Below are examples of how to run the tests.

### Running Tests

You can run the tests using the following command:

```bash
npm test
```

### Example Test Case

Here’s an example of a test case for the rendering logic:

```typescript
import { renderForm } from "../src/renderer/form.renderer";

describe("Rendering Logic", () => {
  test("renderForm should render the form correctly", () => {
    const schema = {
      fields: [
        {
          type: "text",
          name: "username",
          label: "Username",
          required: true,
        },
      ],
    };

    const formElement = document.createElement("div");
    renderForm(formElement, schema);

    expect(formElement.querySelector('input[name="username"]')).toBeTruthy();
  });
});
```

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for more information on how to get involved.
