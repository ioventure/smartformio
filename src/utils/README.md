# Utils Directory

This directory contains utility functions for the SmartFormIO library.

## Files

- `validation.ts`: Contains validation functions used across the library.

## Usage

The utility functions provide essential functionalities that can be reused throughout the library. Below are examples of how to use the validation functions.

### Basic Validation Example

```typescript
import { validateEmail, validateRequired } from "./validation";

const email = "test@example.com";
const isValidEmail = validateEmail(email);
console.log("Is valid email:", isValidEmail);

const username = "";
const isRequiredValid = validateRequired(username);
console.log("Is required valid:", isRequiredValid);
```

### Custom Validation Functions

You can create custom validation functions by extending the base validation class. Here’s an example of a custom validation function:

```typescript
import { BaseValidation } from "./base-validation";

class CustomValidation extends BaseValidation {
  validate(value) {
    // Custom validation logic
    return value.length > 5; // Example: value must be longer than 5 characters
  }
}
```

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for more information on how to get involved.
