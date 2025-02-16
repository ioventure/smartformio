# SmartFormIO

A framework-agnostic dynamic form library with built-in validation, real-time feedback, and framework-specific wrappers.

## Features

- 🎯 Framework Agnostic (Web Components)
- ⚡ Real-time Validation
- 🎨 Customizable Styling with CSS Parts
- 🔌 React & Next.js Wrappers
- 📱 Responsive Design
- ♿ Accessibility Support
- 🌐 TypeScript Support
- 🎨 Theme Customization with CSS Variables

## Installation

```bash
npm install @ioventure/smartformio
```

## Usage

### Vanilla JavaScript/TypeScript

```html
<smart-form-io id="myForm"></smart-form-io>

<script type="module">
  import "@ioventure/smartformio";

  const form = document.getElementById("myForm");
  form.setAttribute(
    "schema",
    JSON.stringify({
      fields: [
        {
          type: "text",
          name: "username",
          label: "Username",
          required: true,
          validationMessage: "Username is required",
        },
        {
          type: "email",
          name: "email",
          label: "Email",
          required: true,
          validationMessage: "Please enter a valid email",
        },
      ],
    })
  );

  form.addEventListener("smartformio:submit", (e) => {
    console.log("Form data:", e.detail);
  });
</script>
```

### React

```tsx
import { SmartFormReact } from "@ioventure/smartformio";

const MyForm = () => {
  const schema = {
    fields: [
      {
        type: "text",
        name: "username",
        label: "Username",
        required: true,
        validationMessage: "Username is required",
      },
    ],
  };

  const handleSubmit = (data) => {
    console.log("Form data:", data);
  };

  return <SmartFormReact schema={schema} onSubmit={handleSubmit} />;
};
```

### Next.js

```tsx
"use client";

import { SmartFormNext } from "@ioventure/smartformio";

const MyForm = () => {
  const schema = {
    fields: [
      {
        type: "text",
        name: "username",
        label: "Username",
        required: true,
        validationMessage: "Username is required",
      },
    ],
  };

  const handleSubmit = (data) => {
    console.log("Form data:", data);
  };

  return <SmartFormNext schema={schema} onSubmit={handleSubmit} />;
};
```

## Form Schema

The form schema defines the structure and behavior of your form. For a comprehensive guide to all input types, their variants, and validation options, see our [Examples Documentation](examples/README.md).

Here's a basic overview of the schema structure:

```typescript
interface FormSchema {
  title?: string;
  description?: string;
  fields: FormFieldSchema[];
  validateOnChange?: boolean;
  submitButtonText?: string;
}
```

### Available Field Types

- `text`: Text input with pattern matching and length validation
- `email`: Email input with format validation
- `password`: Password input with strength validation
- `number`: Number input with range validation
- `textarea`: Multiline text input with character limits
- `select`: Single/multiple selection dropdown
- `radio`: Radio button group with horizontal/vertical layouts
- `checkbox`: Single checkbox or group with min/max selection
- `date`: Date input with range validation
- `file`: Single/multiple file upload with type and size validation

Each field type supports extensive customization and validation options. See our [Examples Documentation](examples/README.md) for detailed configuration examples and validation rules.

## Styling

SmartFormIO provides comprehensive styling capabilities through CSS parts and CSS variables. You can customize every aspect of the form's appearance.

### Theme Variables

```css
:root {
  /* Colors */
  --smartform-primary-color: #007bff;
  --smartform-error-color: #dc3545;
  --smartform-success-color: #28a745;
  --smartform-help-color: #6c757d;
  --smartform-border-color: #ced4da;
  --smartform-text-color: #212529;
  --smartform-bg-color: #f8f9fa;

  /* Typography */
  --smartform-font-family:
    system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial,
    sans-serif;

  /* Spacing and Layout */
  --smartform-border-radius: 4px;
  --smartform-spacing: 1rem;

  /* Transitions */
  --smartform-transition-duration: 0.2s;
  --smartform-transition-timing: ease-in-out;
}
```

### Customizing Components

You can style specific parts of the form using CSS parts:

```css
/* Container */
smart-form-io::part(container) {
  background: var(--smartform-bg-color);
  padding: var(--smartform-spacing);
  border-radius: var(--smartform-border-radius);
  max-width: 400px;
  margin: 0 auto;
}

/* Input Fields */
smart-form-io::part(input) {
  width: 100%;
  padding: 0.6em;
  border: 1px solid var(--smartform-border-color);
  border-radius: var(--smartform-border-radius);
  transition: var(--smartform-transition-duration) all;
}

/* Invalid State */
smart-form-io::part(input-invalid) {
  border-color: var(--smartform-error-color);
}

/* Error Messages */
smart-form-io::part(error-text) {
  color: var(--smartform-error-color);
  font-size: 0.875rem;
}

/* Submit Button */
smart-form-io::part(button) {
  background: var(--smartform-primary-color);
  color: white;
  padding: 0.8em 1.2em;
  border: none;
  border-radius: var(--smartform-border-radius);
  cursor: pointer;
}
```

### Styling Specific Input Types

```css
/* Checkbox Input */
smart-form-io::part(checkbox-input) {
  width: 1.2em;
  height: 1.2em;
  border: 2px solid var(--smartform-border-color);
}

/* Radio Input */
smart-form-io::part(radio-input) {
  width: 1.5em;
  height: 1.5em;
  border: 2px solid var(--smartform-border-color);
}

/* Select Input */
smart-form-io::part(input-select) {
  padding-right: 2.5em;
  background-image: url("data:image/svg+xml,..."); /* Custom dropdown arrow */
}
```

## Events

- `smartformio:submit`: Fired when the form is submitted with valid data
- `smartformio:change`: Fired when any field value changes
- `smartformio:error`: Fired when validation errors occur

## API Reference

### Web Component

```typescript
interface SmartFormElement extends HTMLElement {
  schema: string;
}
```

### React/Next.js Props

```typescript
interface SmartFormIOProps {
  schema: FormSchema;
  onSubmit?: (data: any) => void;
  onChange?: (data: any) => void;
  onError?: (errors: any) => void;
}
```

## Project Structure

```
smartformio/
├── src/
│   ├── events/           # Event handling and validation
│   ├── renderer/         # Form rendering components
│   ├── utils/           # Utility functions
│   ├── wrappers/        # Framework wrappers
│   │   ├── React/       # React integration
│   │   └── Next/        # Next.js integration
│   └── web-components/  # Core web components
└── themes/             # Theme styles and customization
```

## License

MIT © [IOVenture](https://github.com/ioventure)

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for more information on how to get involved.
