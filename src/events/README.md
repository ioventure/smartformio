# Events Directory

This directory contains event-related logic for the SmartFormIO library.

## Files

- `form.event.ts`: Contains the event definitions and handling logic for forms.

## Usage

The event handling logic allows you to manage form events effectively. Below are examples of how to use the event handling components.

### Basic Event Handling Example

```typescript
import { EventManager } from "./form.event";

const eventManager = new EventManager();

eventManager.on("formSubmitted", (data) => {
  console.log("Form submitted with data:", data);
});

// Trigger the event
eventManager.trigger("formSubmitted", {
  username: "testUser",
  email: "test@example.com",
});
```

### Custom Events

You can create custom events by extending the base event class. Here’s an example of a custom event:

```typescript
import { BaseEvent } from "./base-event";

class CustomFormEvent extends BaseEvent {
  constructor() {
    super("customFormEvent");
  }
}
```

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for more information on how to get involved.
