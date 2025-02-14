# Renderer Directory

This directory contains rendering logic for the SmartFormIO library.

## Files

- `form.renderer.ts`: Contains the main rendering logic for forms.
- `helper.ts`: Contains helper functions used in rendering.
- `inputs/`: Contains specific input type components for forms.

## Usage

The rendering logic is designed to be flexible and customizable. Below are examples of how to use the rendering components.

### Basic Rendering Example

```typescript
import { renderForm } from "./form.renderer";

const schema = {
  fields: [
    {
      type: "text",
      name: "username",
      label: "Username",
      required: true,
    },
    {
      type: "email",
      name: "email",
      label: "Email",
      required: true,
    },
  ],
};

const formElement = document.getElementById("myForm");
renderForm(formElement, schema);
```

### Custom Input Components

You can create custom input components by extending the base input class. Here’s an example of a custom checkbox input:

```typescript
import { BaseInput } from "./base-input";

class CustomCheckboxInput extends BaseInput {
  render() {
    // Custom rendering logic for checkbox
  }
}
```

## Customization

You can customize the rendering logic by providing your own styles and templates. Refer to the documentation for more details on how to extend and customize the rendering components.

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for more information on how to get involved.
