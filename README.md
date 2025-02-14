# SmartFormIO

A framework-agnostic dynamic form library with built-in validation, real-time feedback, and framework-specific wrappers.

## Features

- 🎯 Framework Agnostic (Web Components)
- ⚡ Real-time Validation
- 🎨 Customizable Styling
- 🔌 React & Next.js Wrappers
- 📱 Responsive Design
- ♿ Accessibility Support
- 🌐 TypeScript Support

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

The form schema defines the structure and behavior of your form:

```typescript
interface FormSchema {
  title?: string;
  description?: string;
  fields: FormFieldSchema[];
  validateOnChange?: boolean;
  showSubmitButton?: boolean;
  submitButtonText?: string;
}
```

### Field Types

- `text`: Text input
- `email`: Email input with validation
- `password`: Password input
- `number`: Number input with min/max validation
- `textarea`: Multiline text input
- `select`: Dropdown selection
- `radio`: Radio button group
- `checkbox`: Single checkbox or checkbox group
- `date`: Date input with range validation
- `file`: File upload input

### Field Properties

```typescript
interface BaseField {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  validationMessage?: string;
  className?: string;
}
```

## Styling

SmartFormIO uses CSS parts for styling. You can customize the appearance using CSS:

```css
smart-form-io::part(input) {
  border: 1px solid #007bff;
  padding: 0.6em;
  border-radius: 4px;
}

smart-form-io::part(input-invalid) {
  border-color: #dc3545;
}

smart-form-io::part(error-text) {
  color: #dc3545;
  font-size: 0.875rem;
}
```

## Events

- `smartformio:submit`: Fired when the form is submitted with valid data

## API Reference

### Web Component

```typescript
interface SmartFormElement extends HTMLElement {
  schema: string;
  disableDefaultStyles: boolean;
}
```

### React/Next.js Props

```typescript
interface SmartFormIOProps {
  schema: FormSchema;
  disableDefaultStyles?: boolean;
  onSubmit?: (data: any) => void;
}
```

## License

MIT © [IOVenture](https://github.com/ioventure)
