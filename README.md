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

## Styling

SmartFormIO uses CSS parts for styling, allowing complete customization from the parent application. No default styles are included.

### Available CSS Parts

#### Form Parts

- `form` - The main form container
- `title` - Form title
- `description` - Form description
- `fields` - Fields container
- `submit-button` - Submit button

#### Field Parts

- `field-root` - Field root container
- `field-container` - Individual field container
- `label` - Field label
- `input` - Base input element
- `help-text` - Help text container
- `error-message` - Error message container

#### Input-specific Parts

- `select-wrapper`, `select`, `select-arrow` - Select field parts
- `checkbox-wrapper`, `checkbox`, `checkbox-label` - Checkbox field parts
- `radio-wrapper`, `radio`, `radio-label` - Radio field parts
- `file-wrapper`, `file-input`, `file-list` - File field parts
- `date-wrapper`, `date-input` - Date field parts

### Example Styling

```css
/* Style the form container */
smart-form::part(form) {
  /* Your styles here */
}

/* Style the submit button */
smart-form::part(submit-button) {
  /* Your styles here */
}

/* Style input fields */
smart-form::part(input) {
  /* Your styles here */
}
```

## Form Schema

The form schema defines the structure and behavior of your form:

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
- `radio`: Radio button group
- `checkbox`: Single checkbox or group
- `date`: Date input with range validation
- `file`: Single/multiple file upload

## Events

- `smartformio:submit`: Fired when the form is submitted with valid data
- `smartformio:change`: Fired when any field value changes
- `smartformio:error`: Fired when validation errors occur

## Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## License

MIT © [IOVenture](https://github.com/ioventure)
