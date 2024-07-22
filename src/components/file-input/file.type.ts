import { InputBase } from '@components/input.type';
import { ApiRequestOption } from '@services/api/api.type';

export interface FileInputOptions extends InputBase {
  type: 'file';
  value?: FileList;
  accept?: string;
  maxSize?: number;
  minSize?: number;
  maxFiles?: number;
  minFiles?: number;
  api?: FileInputApiOptions;
}

export interface FileInputApiOptions extends ApiRequestOption {
  payloadKey: string;
  valueKey: string;
}
