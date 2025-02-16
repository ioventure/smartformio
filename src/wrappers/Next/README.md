# Next.js Wrapper for SmartFormIO

This directory contains Next.js specific wrappers for the SmartFormIO library.

## Files

- `smartform.next.wrapper.tsx`: Contains the Next.js wrapper component for SmartFormIO.

## Installation

```bash
npm install @ioventure/smartformio
```

## Usage

The Next.js wrapper allows you to easily integrate SmartFormIO into your Next.js applications.

### Basic Usage Example

```tsx
"use client"; // Required for client-side components

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

  return <SmartFormNext schema={schema} onSubmit={handleSubmit} />;
};
```

## Styling in Next.js

### Global CSS Variables

Define your custom theme variables in your global CSS file (e.g., `app/globals.css`):

```css
:root {
  --smartform-primary-color: #4a90e2;
  --smartform-error-color: #e74c3c;
  --smartform-success-color: #2ecc71;
  --smartform-border-radius: 8px;
  --smartform-font-family: var(--font-inter);
}
```

### CSS Modules

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

// page.tsx
import styles from './styles.module.css';

const FormPage = () => {
  return (
    <div className={styles.formWrapper}>
      <SmartFormNext schema={schema} onSubmit={handleSubmit} />
    </div>
  );
};
```

### Styled Components

```tsx
"use client";

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

const FormPage = () => {
  return (
    <StyledFormWrapper>
      <SmartFormNext schema={schema} onSubmit={handleSubmit} />
    </StyledFormWrapper>
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

// app/form/page.tsx
const FormPage = () => {
  return (
    <div className="p-4">
      <SmartFormNext
        schema={schema}
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white shadow-lg rounded-lg"
      />
    </div>
  );
};
```

## Props

```typescript
interface SmartFormNextProps {
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

### Using Next.js Font System

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <style jsx global>{`
          :root {
            --smartform-font-family: ${inter.style.fontFamily};
          }
        `}</style>
        {children}
      </body>
    </html>
  );
}
```

### Dark Mode Support

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <style jsx global>{`
          :root {
            --smartform-bg-color: #ffffff;
            --smartform-text-color: #000000;
          }

          [data-theme="dark"] {
            --smartform-bg-color: #1a1a1a;
            --smartform-text-color: #ffffff;
          }
        `}</style>
        {children}
      </body>
    </html>
  );
}
```

## Server Components Compatibility

The SmartFormNext component must be used within client components. Here's how to properly integrate it with server components:

```tsx
// app/form/page.tsx (Server Component)
import FormClient from "./form-client";

export default function FormPage() {
  return (
    <div>
      <h1>Contact Form</h1>
      <FormClient />
    </div>
  );
}

// app/form/form-client.tsx (Client Component)
("use client");

import { SmartFormNext } from "@ioventure/smartformio";

export default function FormClient() {
  return <SmartFormNext schema={schema} onSubmit={handleSubmit} />;
}
```

## Accessibility

The Next.js wrapper maintains all accessibility features of the core SmartFormIO library:

- ARIA attributes for form controls
- Keyboard navigation support
- Screen reader announcements for validation
- Focus management

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for more information on how to get involved.
