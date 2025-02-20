# Events Module

This module contains all logic related to form event handling, validation, and submission. Each component follows the singleton pattern to ensure consistent state management and efficient resource usage.

## Core Components

### Form Event Management

- **form.event.ts**  
  Singleton handler that orchestrates form events and field-specific handlers.

  ```typescript
  import { formEventHandler } from "@events/form.event";
  formEventHandler.setupEvents(shadowRoot, schema, formId);
  ```

- **form.api.events.ts**  
  Manages API-related form events and submissions.

  ```typescript
  import { formApiHandler } from "@events/form.api.events";
  await formApiHandler.handleSubmission(form, schema, formData, formId);
  ```

- **form.submission.ts**  
  Handles form data collection and validation during submission.
  ```typescript
  import { formSubmissionHandler } from "@events/form.submission";
  const data = formSubmissionHandler.collectFormData(form, schema);
  ```

### Field Handlers

Located in `field-handlers/`, each handler implements the singleton pattern and manages events for specific field types:

- **checkbox-input.handler.ts**  
  Handles single checkboxes and checkbox groups.

  ```typescript
  import { attachCheckboxHandler } from "@events/field-handlers";
  ```

- **date-input.handler.ts**  
  Manages date input fields with native picker integration.

  ```typescript
  import { attachDateInputHandler } from "@events/field-handlers";
  ```

- **file-input.handler.ts**  
  Handles file uploads with size and count validation.

  ```typescript
  import { attachFileInputHandler } from "@events/field-handlers";
  ```

- **radio-input.handler.ts**  
  Manages radio button groups.

  ```typescript
  import { attachRadioHandler } from "@events/field-handlers";
  ```

- **select-input.handler.ts**  
  Handles select dropdowns.

  ```typescript
  import { attachSelectHandler } from "@events/field-handlers";
  ```

- **text-input.handler.ts**  
  Manages text-based input fields.
  ```typescript
  import { attachTextInputHandler } from "@events/field-handlers";
  ```

### Utilities

- **validation.utils.ts**  
  Provides shared utilities for error state management.
  ```typescript
  import { applyErrorState, clearErrorState } from "@events/validation.utils";
  ```

## Design Patterns

### Singleton Pattern

All service classes implement the singleton pattern to ensure:

- Single source of truth for state management
- Efficient resource usage
- Consistent behavior across the application

Example implementation:

```typescript
export class ServiceName {
  private static instance: ServiceName;
  private static readonly LOG_CONTEXT = "ServiceName";

  private constructor() {
    // Private constructor
  }

  public static getInstance(): ServiceName {
    if (!ServiceName.instance) {
      ServiceName.instance = new ServiceName();
    }
    return ServiceName.instance;
  }
}

export const serviceName = ServiceName.getInstance();
```

### Module Organization

- **index.ts**  
  Centralizes exports for all event-related functionality.
  ```typescript
  import {
    formEventHandler,
    formApiHandler,
    formSubmissionHandler,
    // Field handlers
    attachTextInputHandler,
    // Utilities
    applyErrorState,
  } from "@events";
  ```

## Best Practices

1. **Error Handling**

   - All errors are logged through the logger service
   - Error states are managed consistently across all handlers
   - Validation feedback is immediate and user-friendly

2. **Type Safety**

   - Strict TypeScript types for all interfaces and implementations
   - Type guards for field-specific operations
   - Comprehensive JSDoc documentation

3. **Event Management**
   - Events are bubbled and composed for external listeners
   - Custom events follow a consistent naming pattern
   - Event handlers are properly cleaned up

## Extending

To add support for a new field type:

1. Create a new handler in `field-handlers/` following the singleton pattern
2. Implement the necessary validation and event handling logic
3. Add the handler to `field-handlers/index.ts`
4. Update `form.event.ts` to support the new field type
5. Add appropriate interfaces in `@interfaces/field.interface.ts`

This modular approach ensures maintainability, clarity, and ease of extension for additional input types in the future.
