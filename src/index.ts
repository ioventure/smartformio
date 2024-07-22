import './form/form.component';
import '@styles/index.css';
import { FormConfig } from '@form/form.type';
import { SmartForm } from './form/form.component';
import { DEFAULT_STYLE } from '@styles/default.style';

const formConfig: FormConfig = {
  elements: [
    {
      type: 'text',
      name: 'title',
      label: 'Title',
      required: true,
    },
    {
      type: 'number',
      name: 'userId',
      label: 'User Id',
      required: true,
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
  api: { baseUrl: 'https://dummyjson.com' },
  style: DEFAULT_STYLE,
});

function handleFormSubmitResponse(event: any) {
  console.log('Form Submitted Successfully!!:', event.detail);
}

document.querySelector('#root')!.innerHTML = `
  <div class="form-container">
    <smart-form id="form1" config='${JSON.stringify(formConfig)}'  onSubmit="handleFormSubmitResponse"></smart-form>
  </div>
`;

const smartForm = document.getElementById('form1') as SmartForm;
if (smartForm) {
  smartForm.onSubmit = handleFormSubmitResponse;
}
