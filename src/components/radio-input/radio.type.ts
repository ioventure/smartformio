import { InputBase } from "@components/input.type";

export interface RadioInputOptions extends InputBase {
    type: 'radio';
    options: RadioOption[];
    value?: string;
}

export interface RadioOption {
    value: string;
    label: string;
}