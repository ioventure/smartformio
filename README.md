# SmartFormIO

SmartFormIO is an open-source, framework-agnostic dynamic form library built with native Web Components, plain JavaScript, and TypeScript. Render dynamic, JSON-driven forms that work seamlessly across multiple tech stacks including React, Next.js, Angular, Vue, Android WebView, and plain HTML/JS.

## Features

- **Web Component-Based Architecture**  
  Built as a native Web Component for effortless integration into any front-end framework.

- **Dynamic Form Rendering**  
  Render forms via a JSON schema with support for multiple field types (text, email, password, number, select, etc.) and conditional fields.

- **Customizable Theming via External Stylesheets**  
  SmartFormIO no longer injects internal styles—styling is entirely controlled by the consuming application.  
  Use global stylesheets and CSS parts to style the component:

  - **Global Theming:** Define default styles that apply to all instances.
  - **Form Level & Field Level Theming:** Customize individual forms or specific fields by targeting the exposed CSS parts.

- **Validation & Data Handling**  
  Built-in validation (with the ability to integrate third-party validators like Zod or Yup) and an event-driven architecture for handling form data.

- **Optimized & Secure**  
  Lightweight, modular, tree-shakeable bundles with built-in security measures against XSS, CSRF, and injection attacks.

## Installation

Install SmartFormIO via npm:

```bash
npm install @ioventure/smartformio
```

## HTML Integration

Include the SmartFormIO web component directly in your HTML:

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
      "fields": [
        {
          "type": "text",
          "name": "username",
          "label": "Username",
          "required": true,
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

## React Integration

SmartFormIO ships with a React wrapper component so that you can easily use it in React applications. The wrapper handles setting the schema, managing attributes, and binding the smartformio:submit event.

### Usage Example

```bash
import React, { useEffect, useRef } from "react";
import { SmartFormReact } from "@ioventure/smartformio";

const formSchema = {
  title: "User Registration",
  fields: [
    {
      type: "text",
      name: "username",
      label: "Username",
      required: true,
    },
    { type: "email", name: "email", label: "Email", required: true },
    { type: "password", name: "password", label: "Password", required: true },
    {
      type: "select",
      name: "country",
      label: "Country",
      options: ["USA", "Canada", "Other"],
    },
  ],
};

const App = () => {
  const handleSubmit = (data) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <div>
      <h1>SmartFormIO React Demo</h1>
      <SmartFormReact schema={formSchema} onSubmit={handleSubmit} />
    </div>
  );
};

export default App;

```

## Next.js Integration

A dedicated Next.js wrapper (SmartFormNext) is also available for Next.js consumers. (See our documentation for further details.)

## Theming

SmartFormIO supports various theming approaches. Since the library no longer injects default styles, you can supply your own styles from your consuming app using global CSS. For example, to style the component using CSS parts:

### Global Theming

```bash
smart-form-io::part(container) {
  background: #f0f8ff;
  padding: 2em;
  border: 2px solid #ccc;
  border-radius: 8px;
}
smart-form-io::part(title) {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1em;
}
smart-form-io::part(field) {
  margin-bottom: 1em;
}
smart-form-io::part(label) {
  font-weight: bold;
  color: #555;
  margin-bottom: 0.5em;
}
smart-form-io::part(input),
smart-form-io::part(select) {
  width: 100%;
  padding: 0.6em;
  border: 1px solid #007bff;
  border-radius: 4px;
  box-sizing: border-box;
}
smart-form-io::part(button) {
  background: #007bff;
  color: #fff;
  padding: 0.8em 1.2em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
smart-form-io::part(button):hover {
  background: #0056b3;
}
```

Include this stylesheet in your app (via a <link> in your HTML or import it in your React/Next.js app).

## Testing

SmartFormIO uses Jest for unit and integration tests. To run tests, execute:

```bash
npm run test
```

## Build & Distribution

The library uses ESBuild for bundling. To build SmartFormIO, run:

```bash
npm run build
```

This generates bundles in multiple formats (ESM and UMD) in the dist/ directory, along with type declarations.

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and open a pull request. Make sure to run the tests and follow our coding guidelines.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For questions or suggestions, please reach out via email.
