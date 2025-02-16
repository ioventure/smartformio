# SmartFormIO Examples

This document provides comprehensive examples of all input types, their variants, and validation options available in SmartFormIO.

## Complete Form Example

```typescript
const schema = {
  title: "Registration Form",
  description: "Please fill out all required fields",
  validateOnChange: true,
  submitButtonText: "Register",
  fields: [
    // Text Input Examples
    {
      type: "text",
      name: "username",
      label: "Username",
      placeholder: "Enter your username",
      required: true,
      helpText: "Username must be between 3-20 characters",
      validationRules: {
        minLength: 3,
        maxLength: 20,
        pattern: "^[a-zA-Z0-9_]*$",
      },
      validationMessage:
        "Username must be 3-20 characters and can only contain letters, numbers, and underscore",
    },
    {
      type: "text",
      name: "fullName",
      label: "Full Name",
      placeholder: "John Doe",
      required: true,
      leadingIcon: "user",
      validationMessage: "Please enter your full name",
    },

    // Email Input Example
    {
      type: "email",
      name: "email",
      label: "Email Address",
      placeholder: "you@example.com",
      required: true,
      validationRules: {
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      },
      validationMessage: "Please enter a valid email address",
    },

    // Password Input Example
    {
      type: "password",
      name: "password",
      label: "Password",
      required: true,
      helpText:
        "Must contain at least 8 characters, one uppercase, one lowercase, one number",
      validationRules: {
        minLength: 8,
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$",
      },
      validationMessage: "Password must meet all requirements",
      trailingIcon: "eye",
    },

    // Number Input Example
    {
      type: "number",
      name: "age",
      label: "Age",
      required: true,
      validationRules: {
        min: 18,
        max: 100,
      },
      validationMessage: "Age must be between 18 and 100",
    },

    // Textarea Example
    {
      type: "textarea",
      name: "bio",
      label: "Biography",
      placeholder: "Tell us about yourself",
      helpText: "Maximum 500 characters",
      validationRules: {
        maxLength: 500,
      },
      rows: 4,
    },

    // Select Input Example
    {
      type: "select",
      name: "country",
      label: "Country",
      required: true,
      options: [
        { value: "", label: "Select a country" },
        { value: "us", label: "United States" },
        { value: "uk", label: "United Kingdom" },
        { value: "ca", label: "Canada" },
      ],
      validationMessage: "Please select your country",
    },

    // Multi-select Example
    {
      type: "select",
      name: "interests",
      label: "Interests",
      multiple: true,
      options: [
        { value: "sports", label: "Sports" },
        { value: "music", label: "Music" },
        { value: "reading", label: "Reading" },
        { value: "travel", label: "Travel" },
      ],
      validationRules: {
        minSelect: 1,
        maxSelect: 3,
      },
      helpText: "Select 1-3 interests",
    },

    // Radio Input Example
    {
      type: "radio",
      name: "gender",
      label: "Gender",
      required: true,
      layout: "horizontal", // or "vertical"
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ],
      validationMessage: "Please select your gender",
    },

    // Checkbox Group Example
    {
      type: "checkbox",
      name: "notifications",
      label: "Notification Preferences",
      layout: "vertical",
      options: [
        {
          value: "email",
          label: "Email Notifications",
          description: "Receive updates via email",
        },
        {
          value: "sms",
          label: "SMS Notifications",
          description: "Receive updates via SMS",
        },
      ],
      validationRules: {
        minSelect: 1,
      },
      validationMessage: "Please select at least one notification method",
    },

    // Single Checkbox Example
    {
      type: "checkbox",
      name: "terms",
      label: "Terms and Conditions",
      required: true,
      singleOption: {
        value: "accepted",
        label: "I accept the terms and conditions",
        description: "By checking this box, you agree to our Terms of Service",
      },
      validationMessage: "You must accept the terms and conditions",
    },

    // Date Input Example
    {
      type: "date",
      name: "birthdate",
      label: "Birth Date",
      required: true,
      validationRules: {
        minDate: "1900-01-01",
        maxDate: new Date().toISOString().split("T")[0], // Today
      },
      validationMessage: "Please enter a valid birth date",
    },

    // File Input Example
    {
      type: "file",
      name: "avatar",
      label: "Profile Picture",
      accept: "image/*",
      required: true,
      validationRules: {
        maxSize: 5242880, // 5MB in bytes
        allowedTypes: ["image/jpeg", "image/png"],
      },
      validationMessage: "Please upload an image file (JPG or PNG) under 5MB",
      multiple: false,
    },

    // Multiple File Input Example
    {
      type: "file",
      name: "documents",
      label: "Supporting Documents",
      accept: ".pdf,.doc,.docx",
      multiple: true,
      validationRules: {
        maxFiles: 3,
        maxSize: 10485760, // 10MB per file
        allowedTypes: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      },
      helpText: "Upload up to 3 documents (PDF or Word, max 10MB each)",
    },
  ],
};
```

## Validation Rules Reference

### Common Validation Rules

```typescript
interface CommonValidationRules {
  required?: boolean;
  pattern?: string | RegExp;
  custom?: (value: any) => boolean | string;
}
```

### Text Input Validation

```typescript
interface TextValidationRules extends CommonValidationRules {
  minLength?: number;
  maxLength?: number;
}
```

### Number Input Validation

```typescript
interface NumberValidationRules extends CommonValidationRules {
  min?: number;
  max?: number;
  step?: number;
}
```

### Select Input Validation

```typescript
interface SelectValidationRules extends CommonValidationRules {
  minSelect?: number; // For multiple select
  maxSelect?: number; // For multiple select
}
```

### Checkbox Group Validation

```typescript
interface CheckboxValidationRules extends CommonValidationRules {
  minSelect?: number;
  maxSelect?: number;
}
```

### Date Input Validation

```typescript
interface DateValidationRules extends CommonValidationRules {
  minDate?: string | Date;
  maxDate?: string | Date;
}
```

### File Input Validation

```typescript
interface FileValidationRules extends CommonValidationRules {
  maxSize?: number; // In bytes
  minSize?: number; // In bytes
  maxFiles?: number; // For multiple file input
  allowedTypes?: string[]; // MIME types
}
```

## Custom Validation Example

```typescript
{
  type: "text",
  name: "customField",
  label: "Custom Validated Field",
  validationRules: {
    custom: (value) => {
      if (value.includes('test')) {
        return true; // Valid
      }
      return 'Value must include the word "test"'; // Invalid with message
    }
  }
}
```

## Conditional Fields Example

```typescript
{
  type: "radio",
  name: "hasCompany",
  label: "Do you have a company?",
  options: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" }
  ]
},
{
  type: "text",
  name: "companyName",
  label: "Company Name",
  required: true,
  showIf: {
    field: "hasCompany",
    equals: "yes"
  }
}
```

## Dynamic Options Example

```typescript
{
  type: "select",
  name: "state",
  label: "State",
  options: async (formData) => {
    if (!formData.country) return [];
    const response = await fetch(`/api/states/${formData.country}`);
    const states = await response.json();
    return states.map(state => ({
      value: state.code,
      label: state.name
    }));
  },
  dependsOn: ["country"]
}
```

## Form Events

```typescript
// Form submission
form.addEventListener("smartformio:submit", (e) => {
  const formData = e.detail;
  console.log("Form submitted:", formData);
});

// Field change
form.addEventListener("smartformio:change", (e) => {
  const { field, value } = e.detail;
  console.log(`Field ${field} changed to:`, value);
});

// Validation error
form.addEventListener("smartformio:error", (e) => {
  const { field, errors } = e.detail;
  console.log(`Validation errors for ${field}:`, errors);
});
```

## Styling Examples

See the main [README.md](../README.md#styling) for comprehensive styling documentation.

## Contributing

We welcome contributions! Please see our [contributing guidelines](../CONTRIBUTING.md) for more information on how to get involved.
