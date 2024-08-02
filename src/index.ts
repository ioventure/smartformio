import './form/form.component';
import '@styles/index.css';
import { FormConfig } from '@form/form.type';
import { SmartForm } from './form/form.component';
import { DEFAULT_STYLE } from '@styles/default.style';

// const formConfig: FormConfig = {
//   elements: [
//     {
//       type: 'text',
//       name: 'title',
//       label: 'Title',
//       required: true,
//     },
//     {
//       type: 'number',
//       name: 'userId',
//       label: 'User Id',
//       required: true,
//     },
//     // {
//     //   type: 'file',
//     //   name: 'profileImage',
//     //   label: 'Profile Image',
//     //   required: true,
//     //   api: {
//     //     type: 'FORM_DATA',
//     //     endpoint: 'https://api.escuelajs.co/api/v1/files/upload',
//     //     method: 'POST',
//     //     payloadKey: 'file',
//     //     valueKey: 'location',
//     //   },
//     // },
//   ],
//   actionButtons: {
//     submit: {
//       type: 'button',
//       name: 'submit',
//       label: 'Create Post',
//       buttonType: 'submit',
//     },
//   },
//   submitApi: {
//     endpoint: '/posts/add',
//     method: 'POST',
//   },
// };

// Updated form configuration
const formConfig: FormConfig = {
  elements: [
    {
      type: 'number',
      name: 'userId',
      label: 'General Info',
      placeholder: 'User ID',
      value: 3,
      required: true,
    },
    {
      name: 'personalInformation',
      label: 'Personal Information',
      elements: [
        {
          name: 'firstName',
          placeholder: 'First Name',
          type: 'text',
          required: true,
          value: 'John',
        },
        {
          name: 'lastName',
          placeholder: 'Last Name',
          type: 'text',
          required: true,
          value: 'Doe',
        },
        {
          name: 'contactDetails',
          label: 'Contact Details',
          elements: [
            {
              name: 'email',
              type: 'email',
              placeholder: 'Email',
              required: true,
              value: 'john.doe@example.com',
            },
            {
              name: 'phone',
              type: 'tel',
              placeholder: 'Mobile',
              required: false,
              value: '8010582965',
            },
            {
              name: 'address',
              label: 'Address',
              elements: [
                {
                  name: 'street',
                  type: 'text',
                  placeholder: 'Street',
                  required: true,
                  value: '123 Main St',
                },
                {
                  name: 'city',
                  type: 'text',
                  required: true,
                  placeholder: 'City',
                  value: 'Anytown',
                },
                {
                  name: 'zip',
                  placeholder: 'Pin Code',
                  type: 'text',
                  required: true,
                  value: '12345',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'accountDetails',
      label: 'Account Details',
      elements: [
        {
          name: 'username',
          placeholder: 'Username',
          type: 'text',
          required: true,
          value: 'johndoe',
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password',
          required: true,
          value: 'password123',
        },
      ],
    },
  ],
  actionButtons: {
    submit: {
      type: 'button',
      name: 'submit',
      label: 'Create Post',
      buttonType: 'submit',
    },
  },
  submitApi: {
    endpoint: '/posts/add',
    method: 'POST',
  },
};

SmartForm.setDefaultConfig({
  // api: { baseUrl: 'https://api.escuelajs.co' },
  api: { baseUrl: 'https://dummyjson.com' },
  style: DEFAULT_STYLE,
});

function handleFormSubmitResponse(event: any) {
  console.log('Form Submitted Successfully!!:', event.detail);
}

document.querySelector('#root')!.innerHTML = `
  <div class="form-container">
    <smart-form id="form1" config='${JSON.stringify(formConfig)}'></smart-form>
  </div>
`;

const smartForm = document.getElementById('form1') as SmartForm;
if (smartForm) {
  smartForm.onSubmit = handleFormSubmitResponse;
}
