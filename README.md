# SmartFormIO

SmartFormIO is an open-source, framework-agnostic dynamic form library built with native Web Components, plain JavaScript, and TypeScript. Render dynamic, JSON-driven forms that work seamlessly across multiple tech stacks including React, Next.js, Angular, Vue, Android WebView, and plain HTML/JS.

## Features

- **Web Component-Based Architecture**  
  Built as a native Web Component for effortless integration into any front-end framework.

- **Dynamic Form Rendering**  
  Render forms via a JSON schema with support for multiple field types (text, email, password, number, select, etc.) and conditional fields.

- **Customizable Theming**

  - **Global Theming:** Set default CSS variables for your entire application.
  - **Form Level Theming:** Override global styles for individual forms.
  - **Field Level Theming:** Customize individual form fields.

- **Validation & Data Handling**  
  Built-in validation (with the ability to integrate third-party validators like Zod or Yup) and an event-driven architecture for handling form data.

- **Optimized & Secure**  
  Lightweight, modular, tree-shakeable bundles with built-in security measures against XSS, CSRF, and injection attacks.

## Installation

Install SmartFormIO via npm:

```bash
npm install @ioventure/smartformio
```

## HTML Integration:

```bash
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SmartFormIO Demo</title>
</head>
<body>
  <smart-form-io id="myForm" schema='{
    "title": "User Registration",
    "theme": {
      "--smartformio-form-background": "#f0f8ff"
    },
    "fields": [
      {
        "type": "text",
        "name": "username",
        "label": "Username",
        "required": true,
        "theme": { "--smartformio-primary-color": "#ff6347" }
      },
      { "type": "email", "name": "email", "label": "Email", "required": true },
      { "type": "password", "name": "password", "label": "Password", "required": true },
      {
        "type": "select",
        "name": "country",
        "label": "Country",
        "options": ["USA", "Canada", "Other"]
      }
    ]
  }'></smart-form-io>

  <script type="module" src="./dist/smartformio.js"></script>
  <script>
    document.getElementById('myForm').addEventListener('smartformio:submit', (e) => {
      console.log('Form submitted with data:', e.detail);
    });
  </script>
</body>
</html>
```

## React Integration:

```bash
import React, { useEffect, useRef } from 'react';
import '@ioventure/smartformio'; // Ensure the web component is imported

const formSchema = {
  title: "User Registration",
  theme: {
    "--smartformio-form-background": "#f0f8ff"
  },
  fields: [
    {
      type: "text",
      name: "username",
      label: "Username",
      required: true,
      theme: { "--smartformio-primary-color": "#ff6347" }
    },
    { type: "email", name: "email", label: "Email", required: true },
    { type: "password", name: "password", label: "Password", required: true },
    {
      type: "select",
      name: "country",
      label: "Country",
      options: ["USA", "Canada", "Other"]
    }
  ]
};

const App = () => {
  const formRef = useRef(null);

  useEffect(() => {
    const formElement = formRef.current;
    const handleSubmit = (e) => {
      console.log('Form submitted with data:', e.detail);
    };
    formElement.addEventListener('smartformio:submit', handleSubmit);
    return () => formElement.removeEventListener('smartformio:submit', handleSubmit);
  }, []);

  return (
    <div>
      <smart-form-io ref={formRef} schema={JSON.stringify(formSchema)}></smart-form-io>
    </div>
  );
};

export default App;
```

## Theming: Global Theming

```bash
import { SmartFormIO } from '@ioventure/smartformio';

SmartFormIO.globalTheme = {
  '--smartformio-primary-color': '#007bff',
  '--smartformio-font-family': 'Helvetica, sans-serif',
  // Other global CSS variables...
};
```

## Theming: Form Level Theming

```bash
{
  "title": "Custom Themed Form",
  "theme": {
    "--smartformio-form-background": "#f0f8ff"
  },
  "fields": [ ... ]
}
```

## Theming: Field Level Theming

```bash
{
  "type": "text",
  "name": "username",
  "label": "Username",
  "required": true,
  "theme": { "--smartformio-primary-color": "#ff6347" }
}
```

## Theming: Using a Theme Object

```bash
{
  "title": "User Registration",
  "theme": {
    "--smartformio-form-background": "#f0f8ff"
  },
  "fields": [
    {
      "type": "text",
      "name": "username",
      "label": "Username",
      "required": true,
      "theme": { "--smartformio-primary-color": "#ff6347" }
    },
    { "type": "email", "name": "email", "label": "Email", "required": true },
    { "type": "password", "name": "password", "label": "Password", "required": true },
    {
      "type": "select",
      "name": "country",
      "label": "Country",
      "options": ["USA", "Canada", "Other"]
    }
  ]
}
```

## Theming: Using a Full CSS String

```bash
{
  "title": "User Registration",
  "theme": "background: #f0f8ff; font-family: 'Helvetica, sans-serif';",
  "fields": [
    {
      "type": "text",
      "name": "username",
      "label": "Username",
      "required": true,
      "theme": "border: 1px solid #ff6347; padding: 0.5em;"
    },
    { "type": "email", "name": "email", "label": "Email", "required": true },
    { "type": "password", "name": "password", "label": "Password", "required": true },
    {
      "type": "select",
      "name": "country",
      "label": "Country",
      "options": ["USA", "Canada", "Other"]
    }
  ]
}
```

## Testing

SmartFormIO uses Jest for unit and integration testing. Run your tests with:

```bash
npm run test
```

## Build & Distribution

The library uses ESBuild for bundling. To build SmartFormIO, run:

```bash
npm run build
```

This generates bundles in multiple formats (ESM and UMD) in the dist/ directory.

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and open a pull request. Be sure to run the tests and follow the project's coding guidelines.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For questions or suggestions, please reach out via email.
