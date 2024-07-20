import { ButtonInputOptions } from '@components/button-input/button.type';
import { InputOptions } from '@components/input.type';
import { ApiRequestOption } from '@services/api/api.type';

export interface FormConfig {
  elements: InputOptions[];
  actionButtons: {
    submit: ButtonInputOptions;
    reset?: ButtonInputOptions;
  };
  submitApi: ApiRequestOption;
}
