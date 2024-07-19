import { InputBase } from "@components/input.type";

export interface HiddenInputOptions extends InputBase {
    type: 'hidden';
    value?: string;
}