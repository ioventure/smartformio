import './form/form.component';
import '@styles/index.css';
import { FormConfig } from '@form/form.type';
import { SmartForm } from './form/form.component';

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

let styles = '';

(async () => {
  try {
    // Load Default Styles
    const cssFileUrl = '/static/css/index.css';
    styles = await loadCSS(cssFileUrl);
    // Set Default Config
    SmartForm.setDefaultConfig({
      api: { baseUrl: 'https://dummyjson.com' },
      styles,
    });
    // Create and Render Smart Form with Form Config
    const smartForm = document.createElement('smart-form');
    smartForm.setAttribute('config', JSON.stringify(formConfig));
    document.body.appendChild(smartForm);
  } catch (error) {
    console.error(error);
  }
})();

document.querySelector('#root')!.innerHTML = `
  <div class="form-container">
    <image src="https://spn-sta.spinny.com/blog/20221004191046/Hyundai-Venue-2022.jpg?compress=true&quality=80&w=1200&dpr=2" width="440px" height="200px" style="margin: 0 auto; display: flex">
  </div>
`;

async function loadCSS(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.text();
  } catch (error) {
    console.error('Failed to load CSS:', error);
    return '';
  }
}
