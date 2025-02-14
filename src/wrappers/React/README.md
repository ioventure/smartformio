# React Wrappers Directory

This directory contains React-specific wrappers for the SmartFormIO library.

## Files

- `smartform.react.wrapper.tsx`: Contains the React wrapper component for SmartFormIO.

## Usage

The React wrapper allows you to easily integrate SmartFormIO into your React applications. Below is an example of how to use the React wrapper.

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

## Customization

You can customize the behavior and appearance of the React wrapper by passing additional props. Refer to the documentation for more details on available props and customization options.

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for more information on how to get involved.
