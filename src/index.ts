import './index.css';
import './form/form';
import { FormConfigs } from '@form/form.type';

const formConfig: FormConfigs = [
  {
    "type": "text",
    "name": "username",
    "placeholder": "Enter your username",
    "label": "Enter your username",
    "labelPosition": "top",
    "minLength": 3,
    "maxLength": 20,
    "pattern": new RegExp("^[a-zA-Z0-9_]+$"),
    "required": true
  },
  {
    "type": "email",
    "name": "email",
    "placeholder": "Enter your email",
    "label": "Enter your email",
    "labelPosition": "top",
    "customValidation": function (value: string) { return value.endsWith('@example.com'); },
    "required": true
  }
]

document.querySelector('#root')!.innerHTML = `
  <div>
    <pp-form id="form" config='${JSON.stringify(formConfig)}'></pp-form>
  </div>
`;



