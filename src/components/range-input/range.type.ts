import { InputBase, NumberInputBaseOptions } from '@components/input.type';
export interface RangeInputOptions extends InputBase, NumberInputBaseOptions {
  type: 'range';
  min?: number;
  max?: number;
  step?: number;
  value?: number;
}
