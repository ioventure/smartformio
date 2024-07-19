import { InputBase } from "@components/input.type";

export interface CheckboxInputOptions extends InputBase {
    type: 'checkbox';
    value?: boolean;
}