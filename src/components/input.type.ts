interface InputOptions {
    name: string;
    type: 'text' | 'password' | 'email' | 'select' | 'number' | 'checkbox' 
    | 'color' | 'date' | 'datetime-local' | 'file' | 'hidden' 
    | 'month' | 'radio' | 'range' | 'tel' | 'textarea' | 'time' | 'url' | 'week';
    value?: any;
    placeholder?: string;
    label?: string;
    labelPosition?: 'top' | 'left' | 'right';
    minLength?: number;
    maxLength?: number;
    rows?: number;
    cols?: number;
    min?: number | string;
    max?: number | string;
    pattern?: RegExp;
    customValidation?: (value: string) => boolean;
    required: boolean;
}