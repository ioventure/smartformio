import { FormInput } from '@components/input.base';
import { SelectOption, SelectInputOptions } from '@components/select-input/select.type';
import { ApiService } from '@services/api/api.service';
import { API_CONFIG } from '@src/config/api.config';
import { DataParser } from '@src/services/data.parser';

export class SelectInput extends FormInput {
    protected options: SelectInputOptions;
    private apiService: ApiService;

    constructor(options: SelectInputOptions) {
        super(options);
        this.options = options;
        this.apiService = new ApiService({ baseUrl: API_CONFIG.apiBaseUrl });

        if (this.options.api) {
            this.populateFromApis();
        } else {
            this.createOptions(this.options.options ? this.options.options : []);
        }
    }

    protected setupValidation(): void {
        this.inputElement.addEventListener('change', () => {
            this.validate();
        });
    }

    private validate(): void {
        const value = this.inputElement.value;
        const fieldName = this.options.name;

        this.clearErrorMessage(fieldName);

        // Check if a selection is required
        if (this.options.required && value.trim() === '') {
            this.setErrorMessage(fieldName, 'Selection is required.');
        }

        // Apply custom validation if provided
        if (this.options.customValidation) {
            const isValid = this.options.customValidation(value);
            if (!isValid) {
                this.setErrorMessage(fieldName, 'Custom validation failed.');
            }
        }
    }

    private async populateFromApis() {
        if (this.options.api) {
            try {
                const data = await this.apiService.request<SelectOption[]>(this.options.api);
                this.createOptions(data);
            } catch (error) {
                console.error('Failed to fetch options from API:', error);
                // Optionally set an error message or handle API errors
            }
        }
    }

    private createOptions(data: SelectOption[]): void {
        // Clear existing options
        while (this.inputElement.firstChild) {
            this.inputElement.removeChild(this.inputElement.firstChild!);
        }

        // Create default not selectable option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = this.options.placeholder || 'Select an option';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        this.inputElement.appendChild(defaultOption);

        // Create options from data
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = DataParser.getValueFromKey(item, this.options.valueKey);
            option.textContent = DataParser.getValueFromKey(item, this.options.textKey);
            this.inputElement.appendChild(option);
        });
    }
}