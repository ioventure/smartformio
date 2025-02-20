# Renderer Module

This module contains rendering logic for the SmartFormIO library. Each renderer follows the singleton pattern to ensure consistent state management and efficient resource usage.

## Architecture

### Core Components

- `form.renderer.ts`: Main form renderer (singleton)
- `helper.ts`: Rendering utilities (singleton)
- `inputs/`: Field-specific renderers (all singletons)

### Design Patterns

#### Singleton Pattern

All renderers implement the singleton pattern to ensure:

- Single source of truth for rendering logic
- Consistent rendering behavior
- Efficient resource usage

Example implementation:

```typescript
export class FormRenderer {
  private static instance: FormRenderer;
  private static readonly LOG_CONTEXT = "FormRenderer";

  private constructor() {
    // Private constructor
  }

  public static getInstance(): FormRenderer {
    if (!FormRenderer.instance) {
      FormRenderer.instance = new FormRenderer();
    }
    return FormRenderer.instance;
  }
}

export const formRenderer = FormRenderer.getInstance();
```

## Usage

### Form Rendering

```typescript
import { formRenderer } from "@renderer/form.renderer";

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

// Using the singleton renderer
const html = await formRenderer.render(schema);
```

### Input Renderers

```typescript
import {
  textInputRenderer,
  dateInputRenderer,
  fileInputRenderer,
  selectInputRenderer,
  radioInputRenderer,
  checkboxInputRenderer,
} from "@renderer/inputs";

// Using specific input renderers
const textFieldHtml = textInputRenderer.render(textField);
const dateFieldHtml = dateInputRenderer.render(dateField);
```

### Rendering Utilities

```typescript
import { renderHelper } from "@renderer/helper";

// Using the helper singleton
const attributes = renderHelper.renderAttributes({
  name: "example",
  required: true,
});

const escapedText = renderHelper.escapeHtml("<script>alert('xss')</script>");
```

## Component Structure

### Form Container

```html
<form id="smartform" part="container" novalidate>
  <h2 part="title">Form Title</h2>
  <p part="description">Form Description</p>
  <!-- Fields -->
  <button type="submit" part="button">Submit</button>
</form>
```

### Field Structure

```html
<div part="field" role="group">
  <label part="label">Field Label</label>
  <div part="input-container">
    <input part="input" />
  </div>
  <div part="message-container">
    <div part="help-text">Help text</div>
    <div part="error-text" role="alert"></div>
  </div>
</div>
```

## Styling

Each renderer exposes CSS parts for styling:

### Form Parts

```css
smart-form-io::part(container) {
  /* Form container */
}
smart-form-io::part(title) {
  /* Form title */
}
smart-form-io::part(description) {
  /* Form description */
}
smart-form-io::part(button) {
  /* Submit button */
}
```

### Field Parts

```css
smart-form-io::part(field) {
  /* Field wrapper */
}
smart-form-io::part(field-required) {
  /* Required field */
}
smart-form-io::part(field-disabled) {
  /* Disabled field */
}
smart-form-io::part(label) {
  /* Field label */
}
smart-form-io::part(input-container) {
  /* Input wrapper */
}
```

### Input Parts

```css
smart-form-io::part(input) {
  /* Base input */
}
smart-form-io::part(input-text) {
  /* Text input */
}
smart-form-io::part(input-select) {
  /* Select input */
}
smart-form-io::part(input-file) {
  /* File input */
}
smart-form-io::part(input-invalid) {
  /* Invalid input state */
}
```

### Message Parts

```css
smart-form-io::part(message-container) {
  /* Message wrapper */
}
smart-form-io::part(help-text) {
  /* Help text */
}
smart-form-io::part(error-text) {
  /* Error message */
}
```

## Accessibility

The renderers implement comprehensive accessibility features:

### ARIA Attributes

- `aria-label`: Descriptive labels for inputs
- `aria-required`: Required field indication
- `aria-invalid`: Validation state
- `aria-describedby`: Links inputs to help/error text
- `aria-errormessage`: Links inputs to error messages
- `role`: Semantic roles for components

### Keyboard Navigation

- Tab navigation between fields
- Arrow key navigation in radio/checkbox groups
- Space/Enter for selection
- Escape to close dropdowns

### Screen Reader Support

- Descriptive labels and instructions
- Error message announcements
- Status updates
- Field group relationships

## Error Handling

All renderers implement consistent error handling:

```typescript
try {
  // Rendering logic
} catch (error) {
  logger.error(
    "Error message",
    error instanceof Error ? error : new Error(String(error)),
    "ContextName"
  );
  throw error;
}
```

## Contributing

1. Follow the singleton pattern for new renderers
2. Maintain consistent error handling
3. Include comprehensive JSDoc documentation
4. Add appropriate ARIA attributes
5. Update tests for new functionality

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for detailed guidelines.
