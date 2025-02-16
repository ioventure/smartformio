# React Wrapper for SmartFormIO

This directory contains React-specific wrappers for the SmartFormIO library.

## Files

- `smartform.react.wrapper.tsx`: Contains the React wrapper component for SmartFormIO.

## Installation

```bash
npm install @ioventure/smartformio
```

## Usage

The React wrapper allows you to easily integrate SmartFormIO into your React applications.

### Basic Usage Example

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
      {
        type: "email",
        name: "email",
        label: "Email",
        required: true,
        validationMessage: "Please enter a valid email",
      },
    ],
  };

  const handleSubmit = (data) => {
    console.log("Form data:", data);
  };

  return <SmartFormReact schema={schema} onSubmit={handleSubmit} />;
};
```

## Styling in React

### Using CSS Variables

You can customize the form's appearance by defining CSS variables in your React application:

```tsx
// App.css or your style file
:root {
  --smartform-primary-color: #4a90e2;
  --smartform-error-color: #e74c3c;
  --smartform-success-color: #2ecc71;
  --smartform-border-radius: 8px;
  --smartform-font-family: 'Inter', sans-serif;
}
```

### Styling Components

Use CSS modules or styled-components to style specific parts of the form:

```tsx
// styles.module.css
.formWrapper :global(smart-form-io::part(container)) {
  max-width: 500px;
  margin: 2rem auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.formWrapper :global(smart-form-io::part(input)) {
  border: 2px solid #e0e0e0;
  padding: 12px;
  font-size: 16px;
}

// YourComponent.tsx
import styles from './styles.module.css';

const YourComponent = () => {
  return (
    <div className={styles.formWrapper}>
      <SmartFormReact schema={schema} onSubmit={handleSubmit} />
    </div>
  );
};
```

### Using Styled Components

```tsx
import styled from "styled-components";

const StyledFormWrapper = styled.div`
  smart-form-io::part(container) {
    background: #ffffff;
    padding: 2rem;
    border-radius: 12px;
  }

  smart-form-io::part(button) {
    background: #4a90e2;
    color: white;
    padding: 12px 24px;
    font-weight: 600;

    &:hover {
      background: #357abd;
    }
  }
`;

const YourComponent = () => {
  return (
    <StyledFormWrapper>
      <SmartFormReact schema={schema} onSubmit={handleSubmit} />
    </StyledFormWrapper>
  );
};
```

## Props

```typescript
interface SmartFormReactProps {
  // Form schema configuration
  schema: FormSchema;

  // Event handlers
  onSubmit?: (data: any) => void;
  onChange?: (data: any) => void;
  onError?: (errors: any) => void;

  // Optional styling props
  className?: string;
  style?: React.CSSProperties;
}
```

## Theme Integration

### Material-UI Theme Example

```tsx
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  // Your MUI theme
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <style>
        {`
          :root {
            --smartform-primary-color: ${theme.palette.primary.main};
            --smartform-error-color: ${theme.palette.error.main};
            --smartform-border-radius: ${theme.shape.borderRadius}px;
            --smartform-font-family: ${theme.typography.fontFamily};
          }
        `}
      </style>
      <SmartFormReact schema={schema} onSubmit={handleSubmit} />
    </ThemeProvider>
  );
};
```

### Tailwind CSS Integration

```tsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        "smartform-primary": "var(--smartform-primary-color)",
        "smartform-error": "var(--smartform-error-color)",
      },
    },
  },
};

// YourComponent.tsx
const YourComponent = () => {
  return (
    <div className="p-4">
      <SmartFormReact
        schema={schema}
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white shadow-lg rounded-lg"
      />
    </div>
  );
};
```

## Accessibility

The React wrapper maintains all accessibility features of the core SmartFormIO library:

- ARIA attributes for form controls
- Keyboard navigation support
- Screen reader announcements for validation
- Focus management

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for more information on how to get involved.
