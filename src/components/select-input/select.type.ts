import { InputBase } from '@components/input.type';
import { ApiRequestOption } from '@services/api/api.type';

export interface SelectInputOptions extends InputBase {
  type: 'select';
  options: SelectOption[];
  valueKey: string;
  textKey: string;
  api?: ApiRequestOption;
}
export interface SelectOption {
  [key: string]: any;
}
