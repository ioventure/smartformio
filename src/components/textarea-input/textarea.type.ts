import { InputBase } from "@components/input.type";

export interface TextareaInputOptions extends InputBase {
    type: 'textarea';
    rows?: number;
    cols?: number;
    minLength?: number;
    maxLength?: number;
    maxWords?: number;
    minWords?: number;
    value?: string;
    pattern?: string;
}