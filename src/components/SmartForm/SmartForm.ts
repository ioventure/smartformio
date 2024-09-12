export class SmartForm extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
        <style>
          :host {
            display: block;
            padding: 16px;
            background-color: #f0f0f0;
          }
        </style>
        <span>Hello, Vite and TypeScript Web Component!</span>
      `;
  }
}

customElements.define('smart-form', SmartForm);
