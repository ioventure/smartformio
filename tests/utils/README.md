# Utils Tests Directory

This directory contains tests for utility functions in the SmartFormIO library.

## Files

- `validation.test.ts`: Contains tests for validation functions used across the library.

## Usage

The tests for utility functions ensure that the functions behave as expected. Below are examples of how to run the tests.

### Running Tests

You can run the tests using the following command:

```bash
npm test
```

### Example Test Case

Here’s an example of a test case for the validation functions:

```typescript
import { validateEmail, validateRequired } from "../src/utils/validation";

describe("Validation Functions", () => {
  test("validateEmail should return true for valid email", () => {
    expect(validateEmail("test@example.com")).toBe(true);
  });

  test("validateRequired should return false for empty value", () => {
    expect(validateRequired("")).toBe(false);
  });
});
```

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for more information on how to get involved.
