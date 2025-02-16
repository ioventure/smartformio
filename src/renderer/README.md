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

You can create custom input components by extending the base input class. Here's an example of a custom checkbox input:

```typescript
import { BaseInput } from "./base-input";

class CustomCheckboxInput extends BaseInput {
  render() {
    // Custom rendering logic for checkbox
  }
}
```

## Styling Components

Each rendered component exposes CSS parts that can be styled using the `::part()` selector. Here's how to style different components:

### Form Container

```css
smart-form-io::part(container) {
  font-family: var(--smartform-font-family);
  background: var(--smartform-bg-color);
  padding: var(--smartform-spacing);
  border-radius: var(--smartform-border-radius);
  max-width: 400px;
  margin: 0 auto;
}
```

### Input Fields

```css
/* Base Input */
smart-form-io::part(input) {
  width: 100%;
  padding: var(--smartform-input-padding);
  border: var(--smartform-input-border);
  border-radius: var(--smartform-border-radius);
  transition: var(--smartform-input-transition);
}

/* Select Input */
smart-form-io::part(input-select) {
  padding-right: 2.5em;
  background-image: url("data:image/svg+xml,..."); /* Custom dropdown arrow */
}

/* File Input */
smart-form-io::part(input-file)::file-selector-button {
  padding: 0.4em 0.8em;
  margin-right: 0.8em;
  border: 1px solid var(--smartform-primary-color);
  background: #fff;
  color: var(--smartform-primary-color);
}
```

### Checkbox and Radio Groups

```css
/* Checkbox Group */
smart-form-io::part(checkbox-group) {
  display: flex;
  gap: 0.4rem;
}

/* Radio Group */
smart-form-io::part(radio-group) {
  display: flex;
  gap: 1rem;
}

/* Vertical Layout */
smart-form-io::part(checkbox-group-vertical),
smart-form-io::part(radio-group-vertical) {
  flex-direction: column;
}

/* Horizontal Layout */
smart-form-io::part(checkbox-group-horizontal),
smart-form-io::part(radio-group-horizontal) {
  flex-direction: row;
  flex-wrap: wrap;
}
```

### Labels and Help Text

```css
/* Label */
smart-form-io::part(label) {
  display: block;
  font-weight: 500;
  color: var(--smartform-text-color);
  margin-bottom: calc(var(--smartform-spacing) * 0.25);
}

/* Help Text */
smart-form-io::part(help-text) {
  color: var(--smartform-help-color);
  font-size: 0.875rem;
}
```

### Error States

```css
/* Invalid Input */
smart-form-io::part(input-invalid) {
  border-color: var(--smartform-error-color);
}

/* Error Message */
smart-form-io::part(error-text) {
  color: var(--smartform-error-color);
  font-size: 0.75rem;
}
```

### Icons

```css
/* Leading Icon */
smart-form-io::part(leading-icon) {
  position: absolute;
  left: 0.4em;
  top: 50%;
  transform: translateY(-50%);
}

/* Trailing Icon */
smart-form-io::part(trailing-icon) {
  position: absolute;
  right: 0.4em;
  top: 50%;
  transform: translateY(-50%);
}
```

## Accessibility

The renderer implements ARIA attributes and keyboard navigation for better accessibility:

- All form controls have associated labels
- Error messages are announced to screen readers
- Focus management for keyboard navigation
- ARIA states for validation feedback

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for more information on how to get involved.
