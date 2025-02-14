# Next.js Wrappers Tests Directory

This directory contains tests for Next.js specific wrappers in the SmartFormIO library.

## Files

- `smartform.next.wrapper.test.ts`: Contains tests for the Next.js wrapper component.

## Usage

The tests for Next.js wrappers ensure that the wrapper components behave as expected. Below are examples of how to run the tests.

### Running Tests

You can run the tests using the following command:

```bash
npm test
```

### Example Test Case

Here’s an example of a test case for the Next.js wrapper:

```typescript
import { render } from '@testing-library/react';
import { SmartFormNext } from '../src/wrappers/Next/smartform.next.wrapper';

describe('SmartFormNext Component', () => {
  test('renders correctly with given schema', () => {
    const schema = {
      fields: [
        {
          type: 'text',
          name: 'username',
          label: 'Username',
          required: true,
        },
      ],
    };

    const { getByLabelText } = render(<SmartFormNext schema={schema} />);
    expect(getByLabelText(/username/i)).toBeInTheDocument();
  });
});
```

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for more information on how to get involved.
