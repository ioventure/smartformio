# Next.js Wrappers Directory

This directory contains Next.js specific wrappers for the SmartFormIO library.

## Files

- `smartform.next.wrapper.tsx`: Contains the Next.js wrapper component for SmartFormIO.

## Usage

The Next.js wrapper allows you to easily integrate SmartFormIO into your Next.js applications. Below is an example of how to use the Next.js wrapper.

### Basic Usage Example

```tsx
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

## Customization

You can customize the behavior and appearance of the Next.js wrapper by passing additional props. Refer to the documentation for more details on available props and customization options.

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for more information on how to get involved.
