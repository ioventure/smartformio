import { FormInput } from "@components/input.base";
import { PasswordInputOptions } from "@components/password-input/password.type";

export class PasswordInput extends FormInput {
    protected options: PasswordInputOptions;

    constructor(options: PasswordInputOptions) {
        super(options);
        this.options = options;
    }

    /**
     * Sets up validation rules for the password input.
     */
    protected setupValidation(): void {
        this.inputElement.addEventListener('keyup', () => this.validate());
        this.inputElement.addEventListener('change', () => this.validate());
    }

    private validate(): void {
        const value = this.inputElement.value;
        const fieldName = this.options.name;

        this.clearErrorMessage(fieldName);

        // Required field validation
        if (this.options.required && value.trim() === '') {
            this.setErrorMessage(fieldName, 'Field is required.');
            return;
        }

        // Minimum length validation
        if (this.options.minLength !== undefined && value.length < this.options.minLength) {
            this.setErrorMessage(fieldName, `Minimum length should be ${this.options.minLength}.`);
            return;
        }

        // Maximum length validation
        if (this.options.maxLength !== undefined && value.length > this.options.maxLength) {
            this.setErrorMessage(fieldName, `Maximum length should be ${this.options.maxLength}.`);
            return;
        }

        // Pattern validation
        if (this.options.pattern && !this.options.pattern.test(value)) {
            this.setErrorMessage(fieldName, `Please enter a valid ${fieldName}.`);
            return;
        }

        // Custom validation
        if (this.options.customValidation && !this.options.customValidation(value)) {
            this.setErrorMessage(fieldName, 'Custom validation failed.');
            return;
        }

        // Strength validation (optional)
        if (this.options.minStrength) {
            const strengthMessage = this.checkStrength(value);
            if (strengthMessage) {
                this.setErrorMessage(fieldName, strengthMessage);
            }
        }
    }

    /**
     * Checks the strength of the password based on provided criteria.
     * @param password - The password value to be checked.
     * @returns An error message if the strength requirement is not met; otherwise, null.
     */
    private checkStrength(password: string): string | null {
        if (this.options.minStrength) {
            const minStrength = this.options.minStrength;
            let strength = 0;

            // Calculate strength
            if (password.length >= minStrength) strength += 1;
            if (/[a-z]/.test(password)) strength += 1;
            if (/[A-Z]/.test(password)) strength += 1;
            if (/[0-9]/.test(password)) strength += 1;
            if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

            // Check strength against minStrength
            if (strength < minStrength) {
                return `Password must include at least ${minStrength} different types of characters.`;
            }
        }
        return null;
    }
}
