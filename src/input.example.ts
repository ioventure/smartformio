import { FormConfigs } from "@form/form.type";

const formConfig: FormConfigs = [
    {
      type: "text",
      name: "username",
      placeholder: "Username",
      label: "Username",
      labelPosition: 'top',
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: "^[a-zA-Z0-9_]+$",
      customValidation: function (value) { return value !== 'admin'; }
    },
    // {
    //   type: "color",
    //   name: "color",
    //   placeholder: "Color",
    //   label: "Color",
    //   labelPosition: 'top',
    //   required: true,
    // },
    {
      type: "password",
      name: "password",
      placeholder: "Password",
      label: "Password",
      labelPosition: 'top',
      required: true,
      minLength: 8,
      maxLength: 30,
      pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
      customValidation: function (value) { return !value.includes('1234'); }
    },
    {
      type: "email",
      name: "email",
      placeholder: "Email",
      label: "Email",
      labelPosition: 'top',
      required: true,
      customValidation: function (value) { return value.endsWith('@example.com'); }
    },
    {
      type: "number",
      name: "age",
      placeholder: "Age",
      label: "Age",
      labelPosition: 'top',
      required: true,
      min: 18,
      max: 99,
      pattern: "^\\d+$",
      customValidation: function (value) { return value > 0; }
    },
    {
      type: "range",
      name: "volume",
      placeholder: "Volume",
      label: "Volume",
      labelPosition: 'top',
      required: false,
      min: 0,
      max: 100
    },
    {
      type: "tel",
      name: "mobile",
      placeholder: "Mobile",
      label: "Mobile",
      labelPosition: 'top',
      required: false
    },
    {
      type: "select",
      name: "country",
      label: "Country",
      labelPosition: 'top',
      required: true,
      options: [
        { code: "us", name: "United States" },
        { code: "ca", name: "Canada" },
        { code: "uk", name: "United Kingdom" }
      ],
      placeholder: "Select a country",
      valueKey: "code",
      textKey: "name"
    },
    {
      type: "textarea",
      name: "comments",
      placeholder: "Comments",
      label: "Comments",
      labelPosition: 'top',
      required: false,
      minLength: 10,
      maxLength: 500,
      pattern: "^[a-zA-Z0-9\\s,.!?]*$",
      customValidation: function (value) { return !value.includes('spam'); }
    },
    {
      type: "radio",
      name: "gender",
      label: "Gender",
      required: true,
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" }
      ],
      labelPosition: "right"
    },
    {
      type: "checkbox",
      name: "terms",
      label: "I agree to the terms and conditions",
      required: true,
      labelPosition: "right"
    },
    {
      type: "file",
      name: "profilePicture",
      placeholder: "Profile Picture",
      label: "Profile Picture",
      labelPosition: "top",
      required: false,
      accept: "image/png",
      multiple: false
    },
    {
      type: "date",
      name: "birthDate",
      placeholder: "Birth Date",
      label: "Birth Date",
      labelPosition: "top",
      required: true,
      min: "1900-01-01",
      max: "2024-12-31"
    },
    {
      type: "datetime",
      name: "appointment",
      placeholder: "Appointment Date and Time",
      labelPosition: "top",
      label: "Appointment Date and Time",
      required: true,
      min: "2024-01-01T00:00",
      max: "2024-12-31T23:59"
    },
    {
      type: "time",
      name: "meetingTime",
      placeholder: "Meeting Time",
      label: "Meeting Time",
      labelPosition: "top",
      required: true,
      min: "08:00",
      max: "18:00"
    },
    {
      type: "url",
      name: "website",
      placeholder: "Website",
      label: "Website",
      labelPosition: "top",
      required: false,
      pattern: "^(https?|ftp)://[^\s/$.?#].[^\s]*$"
    },
    {
      type: "month",
      name: "subscriptionMonth",
      placeholder: "Subscription Month",
      label: "Subscription Month",
      required: true,
      labelPosition: "top",
      min: "2024-01",
      max: "2024-12"
    },
    {
      type: "week",
      name: "projectWeek",
      placeholder: "Project Week",
      label: "Project Week",
      labelPosition: "top",
      required: true,
      min: "2024-W01",
      max: "2024-W52"
    },
    {
      type: "hidden",
      placeholder: 'Hidden Field',
      label: 'Hidden field',
      labelPosition: "top",
      name: "hiddenField",
      value: "hiddenValue",
      required: false
    },
    {
      type: 'button',
      buttonType: 'submit',
      label: 'Submit',
      disabled: false,
      name: 'submitButton',
      id: 'submitBtn'
    },
    {
      type: 'button',
      buttonType: 'reset',
      label: 'Reset',
      disabled: false,
      name: 'resetButton',
      id: 'resetButton'
    }
  ]