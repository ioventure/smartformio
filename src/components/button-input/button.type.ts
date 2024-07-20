export interface ButtonInputOptions {
  type: 'button';
  buttonType: 'submit' | 'reset';
  label: string;
  disabled?: boolean;
  name?: string;
  id?: string;
}
