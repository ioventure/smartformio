import { InputBase } from '@components/input.type';

export interface FileInputOptions extends InputBase {
  type: 'file';
  value?: FileList;
  accept?: string;
  maxSize?: number;
  minSize?: number;
  maxFiles?: number;
  minFiles?: number;
  multiple?: boolean;
}
