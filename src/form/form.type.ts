import { ButtonInputOptions } from '@components/button-input/button.type';
import { InputOptions } from '@components/input.type';
import { ApiOptions, ApiRequestOption } from '@services/api/api.type';

export interface FormConfig {
  elements: InputOptions[];
  actionButtons: {
    submit: ButtonInputOptions;
    reset?: ButtonInputOptions;
  };
  submitApi: ApiRequestOption;
}

export interface FormDefaultConfig {
  api?: ApiOptions;
  styles?: string;
}
