# @ioventure/smartformio

A collection of customizable web components, including the `SmartForm` component, optimized for modern web development using TypeScript, Vite, and native Web Components.

## Installation

Install the package via npm:

```bash
npm install @ioventure/smartformio
```

## Usage Guide

The SmartForm component can be used in various environments including Vanilla JavaScript, React, Next.js, and Angular. Below are the detailed usage instructions for each environment.

### 1\. Vanilla JavaScript

To use the SmartForm component in a Vanilla JavaScript application:

**Include the Component in Your HTML**

Import the component module in your HTML file:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vanilla JS Example</title>
  </head>
  <body>
    <!-- Use the custom SmartForm element -->
    <smart-form>
      <input type="text" placeholder="Enter your name" />
      <button type="submit">Submit</button>
    </smart-form>

    <script type="module">
      // Import the SmartForm component
      import { SmartForm } from '/node_modules/@ioventure/smartformio/dist/smartformio.es.js';

      // Optionally set default configurations from the parent application
      SmartForm.setDefaultConfig({ theme: 'dark', validation: true });
    </script>
  </body>
</html>
```

### 2\. React

To use the SmartForm component in a React application:

**Install the Component Library**

Ensure the package is installed:

```bash
npm install @ioventure/smartformio
```

**Use the Component in a React Component**

Import and use the SmartForm component in your React application:

```ts
import React, { useEffect } from 'react';
import { SmartForm } from '@ioventure/smartformio'; // Import the SmartForm component

const App = () => {
  useEffect(() => {
    // Set default configurations for SmartForm
    SmartForm.setDefaultConfig({ theme: 'dark', validation: true });
  }, []);

  return (
    <div className="App">
      <h1>React Example with SmartForm</h1>
      <smart-form>
        <input type="text" placeholder="Enter your name" />
        <button type="submit">Submit</button>
      </smart-form>
    </div>
  );
};

export default App;
```

**Handling TypeScript Errors (Optional)**

If using TypeScript, ensure TypeScript recognizes custom elements by extending JSX.IntrinsicElements:

```ts
declare namespace JSX {
  interface IntrinsicElements {
    'smart-form': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }
}
```

### 3\. Next.js

To use the SmartForm component in a Next.js application:

**Install the Component Library**

Install the library via npm:

```bash
npm install @ioventure/smartformio
```

**Use Dynamic Import to Avoid SSR Issues**

Ensure the component is only rendered on the client side by using Next.js dynamic import:

```ts
import { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    // Dynamically import the component for client-side rendering
    import('@ioventure/smartformio').then(({ SmartForm }) => {
      SmartForm.setDefaultConfig({ theme: 'dark', validation: true });
    });
  }, []);

  return (
    <div>
      <h1>Next.js Example with SmartForm</h1>
      <smart-form>
        <input type="text" placeholder="Enter your name" />
        <button type="submit">Submit</button>
      </smart-form>
    </div>
  );
};

export default HomePage;
```

### 4\. Angular

To use the SmartForm component in an Angular application:

**Install the Component Library**

Install the package:

```bash
npm install @ioventure/smartformio
```

**Add the Component in Angular**

Import and register the component in your Angular component:

```ts
import { Component, OnInit } from '@angular/core';
import { SmartForm } from '@ioventure/smartformio';

@Component({
  selector: 'app-root',
  template: `
    <h1>Angular Example with SmartForm</h1>
    <smart-form>
      <input type="text" placeholder="Enter your name" />
      <button type="submit">Submit</button>
    </smart-form>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  ngOnInit() {
    SmartForm.setDefaultConfig({ theme: 'dark', validation: true });
  }
}
```

### Default Configuration

You can set default configurations for your components from the parent application using the static setDefaultConfig method provided by each component. This method allows you to pass a configuration object that will be used by the component for initialization.

### Contributing

We welcome contributions! Please read our contributing guidelines to get started.

### License

This project is licensed under the MIT License - see the LICENSE file for details.
