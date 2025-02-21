# Field Components

This directory contains all the field components used in the SmartFormIO library. Each field component is a custom element that extends the `BaseFieldElement` class and provides specific functionality for different types of form inputs.

## Available Field Components

### TextFieldElement

- **Tag**: `smart-text-field`
- **Type**: text, email, password, number, textarea
- **Features**:
  - Pattern validation
  - Min/max length validation
  - Number range validation
  - Leading/trailing icons
  - Placeholder support

### SelectFieldElement

- **Tag**: `smart-select-field`
- **Features**:
  - Single/multiple selection
  - Option groups
  - Custom option rendering
  - Placeholder support
  - Custom arrow indicator

### RadioFieldElement

- **Tag**: `smart-radio-field`
- **Features**:
  - Horizontal/vertical layout
  - Option descriptions
  - Keyboard navigation
  - Custom styling
  - Accessibility support

### CheckboxFieldElement

- **Tag**: `smart-checkbox-field`
- **Features**:
  - Single checkbox/checkbox group
  - Horizontal/vertical layout
  - Option descriptions
  - Indeterminate state support
  - Accessibility support

### DateFieldElement

- **Tag**: `smart-date-field`
- **Features**:
  - Date range validation
  - Custom date format
  - Calendar picker
  - Keyboard navigation
  - Min/max date constraints

### FileFieldElement

- **Tag**: `smart-file-field`
- **Features**:
  - Single/multiple file upload
  - Drag and drop support
  - File size validation
  - File type validation
  - Upload progress
  - File preview

## Usage

### Basic Usage

```typescript
import { TextFieldElement } from '@components/fields';

// Register the element (if not already registered)
customElements.define('smart-text-field', TextFieldElement);

// Use in HTML
<smart-text-field name="username" required></smart-text-field>
```

### With Configuration

```typescript
const field = new TextFieldElement({
  name: 'username',
  type: 'text',
  config: {
    label: 'Username',
    placeholder: 'Enter your username',
    required: true,
    validation: {
      pattern: '^[a-zA-Z0-9_]{3,16}$',
      minLength: 3,
      maxLength: 16,
    },
  },
});
```

## Styling

Each field component uses Shadow DOM and exposes parts for styling. Common parts include:

```css
/* Style the field root */
smart-text-field::part(field-root) {
  /* styles */
}

/* Style the label */
smart-text-field::part(label) {
  /* styles */
}

/* Style the input */
smart-text-field::part(input) {
  /* styles */
}

/* Style when focused */
smart-text-field::part(input focused) {
  /* styles */
}

/* Style when invalid */
smart-text-field::part(input invalid) {
  /* styles */
}
```

## Events

All field components emit standard form events and custom events:

```typescript
field.addEventListener('change', (event) => {
  console.log('Value changed:', event.detail.value);
});

field.addEventListener('focus', (event) => {
  console.log('Field focused');
});

field.addEventListener('blur', (event) => {
  console.log('Field blurred');
});

field.addEventListener('validate', (event) => {
  console.log('Validation result:', event.detail.isValid);
});
```

## Validation

Fields support both built-in HTML5 validation and custom validation:

```typescript
const field = new TextFieldElement({
  name: 'email',
  type: 'email',
  config: {
    validation: {
      // Built-in email validation
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',

      // Custom validation
      custom: (value) => {
        if (!value.includes('@company.com')) {
          return 'Must be a company email address';
        }
        return null;
      },
    },
  },
});
```

## Accessibility

All field components are built with accessibility in mind:

- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader friendly
- High contrast support

## Best Practices

1. Always provide labels for fields
2. Use appropriate validation messages
3. Handle errors gracefully
4. Provide feedback for user actions
5. Follow accessibility guidelines
6. Test with different input methods
7. Consider mobile usage
8. Use appropriate field types

## Contributing

When adding new field components:

1. Extend `BaseFieldElement`
2. Follow the established patterns
3. Add proper types and documentation
4. Include tests
5. Update this README
6. Consider accessibility
7. Add styling support
