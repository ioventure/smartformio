import { ApiRequestOption } from "@services/api/api.type";

export interface SelectInputOptions extends InputOptions {
    valueKey: string;
    textKey: string;
    options?: SelectOption[];
    api?: ApiRequestOption
}

export interface SelectOption {
    [key: string]: any
}   