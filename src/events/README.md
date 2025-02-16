# Events Folder

This folder contains all logic related to form event handling, validation, and submission. Here's a quick overview:

- **form.event.ts**  
  Sets up the event listeners for each field type and orchestrates form submission.

- **form.submission.ts**  
  Collects the form data on submit and runs an overall validation pass on the final dataset.

- **validation.utils.ts**  
  Provides shared helper functions for applying/clearing error states on inputs.

- **field-handlers/**  
  Houses individual handlers for each field type:
  - `checkbox-input.handler.ts`
  - `date-input.handler.ts`
  - `file-input.handler.ts`
  - `radio-input.handler.ts`
  - `select-input.handler.ts`
  - `text-input.handler.ts`
  - `index.ts` (Re-exports all handlers)

This modular approach ensures maintainability, clarity, and ease of extension for additional input types in the future.
