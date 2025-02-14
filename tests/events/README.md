# Events Tests Directory

This directory contains tests related to event handling in the SmartFormIO library.

## Files

- `form.event.test.ts`: Contains tests for the event handling logic of forms.

## Usage

The tests for event handling ensure that the event components behave as expected. Below are examples of how to run the tests.

### Running Tests

You can run the tests using the following command:

```bash
npm test
```

### Example Test Case

Here’s an example of a test case for the event handling logic:

```typescript
import { EventManager } from "../src/events/form.event";

describe("Event Handling Logic", () => {
  test("EventManager should trigger events correctly", () => {
    const eventManager = new EventManager();
    const mockCallback = jest.fn();

    eventManager.on("testEvent", mockCallback);
    eventManager.trigger("testEvent", { data: "testData" });

    expect(mockCallback).toHaveBeenCalledWith({ data: "testData" });
  });
});
```

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for more information on how to get involved.
