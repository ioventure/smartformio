import { ButtonInputOptions } from '@components/button-input/button.type';
import { InputOptions } from '@components/input.type';
import { ApiOptions, ApiRequestOption } from '@services/api/api.type';

export interface FormConfig {
  elements: FormElement[];
  actionButtons: {
    submit: ButtonInputOptions;
    reset?: ButtonInputOptions;
  };
  submitApi: ApiRequestOption;
}

export interface FormGroup {
  name: string;
  label?: string;
  elements: FormElement[];
}

export type FormElement = InputOptions | FormGroup;

export interface FormDefaultConfig {
  api?: ApiOptions;
  styles?: string;
}

export enum FormAttributes {
  CONFIG = 'config',
  STYLES = 'styles',
}

export enum FormEvents {
  SUBMIT = 'submit',
  ON_SUBMIT = 'onSubmit',
}
