import { CheckboxInputOptions } from "@components/checkbox-input/checkbox.type";
import { ColorInputOptions } from "@components/color-input/color.type";
import { FileInputOptions } from "@components/file-input/file.type";
import { HiddenInputOptions } from "@components/hidden-input/hidden.type";
import { RadioInputOptions } from "@components/radio-input/radio.type";
import { SelectInputOptions } from "@components/select-input/select.type";
import { TextareaInputOptions } from "@components/textarea-input/textarea.type";

export interface InputBase {
    name: string;
    value?: any;
    label?: string;
    labelPosition?: 'top' | 'left' | 'right';
    placeholder?: string;
    required: boolean;
    customValidation?: (value: any) => boolean;
}

export interface TextInputBaseOptions extends InputBase {
    type: 'text' | 'password' | 'email' | 'tel' | 'url';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
   
}
export interface NumberInputBaseOptions extends InputBase {
    type: 'number' | 'range';
    min?: number;
    max?: number;
    step?: number;
    pattern?: RegExp;
}

export interface DateInputBaseOptions extends InputBase {
    type: 'date' | 'datetime' | 'month' | 'time' | 'week';
    min?: string;
    max?: string;
}

export type InputOptions = 
    | TextInputBaseOptions 
    | NumberInputBaseOptions 
    | SelectInputOptions 
    | RadioInputOptions 
    | ColorInputOptions 
    | DateInputBaseOptions 
    | FileInputOptions 
    | HiddenInputOptions 
    | TextareaInputOptions 
    | CheckboxInputOptions;
