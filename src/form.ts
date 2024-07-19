import { CheckboxInput } from '@components/checkbox-input/checkbox.input';
import { ColorInput } from '@components/color-input/color.input';
import { DateInput } from '@components/date-input/date.input';
import { DateTimeInput } from '@components/datetime-input/datetime.input';
import { EmailInput } from '@components/email-input/email.input';
import { FileInput } from '@components/file-input/file.input';
import { HiddenInput } from '@components/hidden-input/hidden.input';
import { MonthInput } from '@components/month-input/month.input';
import { NumberInput } from '@components/number-input/number.input';
import { PasswordInput } from '@components/password-input/password.input';
import { RadioInput } from '@components/radio-input/radio.input';
import { RangeInput } from '@components/range-input/range.input';
import { SelectInput } from '@components/select-input/select.input';
import { TelInput } from '@components/tel-input/tel.input';
import { TextInput } from '@components/text-input/text.input';
import { TextareaInput } from '@components/textarea-input/textarea.input';
import { TimeInput } from '@components/time-input/time.input';
import { UrlInput } from '@components/url-input/url.input';
import { WeekInput } from '@components/week-input/week.input';

export class PPForm extends HTMLElement {
    textInput: TextInput;
    emailInput: EmailInput;
    selectInput: SelectInput;
    passwordInput: PasswordInput;
    numberInput: NumberInput;
    checkboxInput: CheckboxInput;
    colorInput: ColorInput;
    dateInput: DateInput;
    dateTimeInput: DateTimeInput;
    fileInput: FileInput;
    hiddenInput: HiddenInput;
    monthInput: MonthInput;
    raioInput: RadioInput;
    rangeInput: RangeInput;
    telInput: TelInput;
    textareaInput: TextareaInput;
    timeInput: TimeInput;
    urlInput: UrlInput;
    weekInput: WeekInput;
    private shadow: ShadowRoot;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.textInput = new TextInput({
            name: 'username',
            type: 'text',
            placeholder: 'Enter your username',
            label: 'Enter your username',
            labelPosition: 'top',
            minLength: 3,
            maxLength: 20,
            pattern: /^[a-zA-Z0-9_]+$/,
            required: true,
        });
        this.emailInput = new EmailInput({
            name: 'text',
            type: 'email',
            placeholder: 'Enter your email',
            label: 'Enter your email',
            labelPosition: 'top',
            customValidation: (value: string) => value.endsWith('@example.com'),
            required: true,
        });
        this.selectInput = new SelectInput({
            name: 'country',
            type: 'select',
            required: true,
            placeholder: 'Select a Country',
            label: 'Select a Country',
            labelPosition: 'top',
            api: {
                endpoint: '/v3.1/all',
                method: 'GET',
                params: {
                    fields: 'name,flags'
                }
            },
            valueKey: 'name.official',
            textKey: 'name.common',
        });
        this.passwordInput = new PasswordInput({
            name: 'password',
            type: 'password',
            placeholder: 'Enter your password',
            label: 'Enter your password',
            labelPosition: 'top',
            required: true,
            minLength: 8,
            pattern: /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        });
        this.numberInput = new NumberInput({
            name: 'age',
            type: 'number',
            placeholder: 'Enter your age',
            label: 'Enter your age',
            labelPosition: 'top',
            required: true,
            min: 18,
            max: 50,
        })
        this.checkboxInput = new CheckboxInput({
            name: 'terms',
            type: 'checkbox',
            placeholder: 'Terms',
            required: true,
            label: 'I agree to terms & Conditions',
            labelPosition: 'right'
        });
        this.colorInput = new ColorInput({ name: 'color', required: true, type: 'color', label: 'Select Color', labelPosition: 'top' });
        this.dateInput = new DateInput({
            name: 'eventDate',
            type: 'date',
            label: 'Select an event date',
            labelPosition: 'top',
            required: true,
            min: '2024-01-01',
            max: '2024-12-31'
        });
        this.dateTimeInput = new DateTimeInput({
            name: 'appointment',
            type: 'datetime-local',
            label: 'Select appointment date and time',
            labelPosition: 'top',
            required: true,
            min: '2024-01-01T00:00',
            max: '2024-12-31T23:59'
        });
        this.fileInput = new FileInput({
            name: 'profilePicture',
            type: 'file',
            label: 'Upload your profile picture',
            labelPosition: 'top',
            required: true,
        })
        this.hiddenInput = new HiddenInput({
            name: 'userId',
            type: 'hidden',
            required: true,
            placeholder: 'User Id',
            label: 'User Id',
            labelPosition: 'top'
        })
        this.monthInput = new MonthInput({
            name: 'birthMonth',
            type: 'month',
            label: 'Select your birth month',
            labelPosition: 'top',
            required: true,
            min: '2023-01',
            max: '2024-12'
        });
        this.raioInput = new RadioInput({
            name: 'gender',
            type: 'radio',
            options: [
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' }
            ],
            label: 'Select your gender',
            labelPosition: 'right',
            required: true
        });
        this.rangeInput = new RangeInput({
            name: 'volume',
            type: 'range',
            min: 0,
            max: 100,
            step: 5,
            placeholder: 'Adjust volume',
            label: 'Adjust volume',
            labelPosition: 'top',
            required: true
        });
        this.telInput = new TelInput({
            name: 'phoneNumber',
            type: 'tel',
            label: 'Enter your phone number',
            labelPosition: 'top',
            required: true,
            pattern: /^[+]?[6-9\s-]{7,15}$/ 
        });
        this.textareaInput = new TextareaInput({
            name: 'description',
            type: 'textarea',
            placeholder: 'Enter a description',
            label: 'Description',
            labelPosition: 'top',
            required: true,
            minLength: 10,
            maxLength: 300,
            rows: 4,
            cols: 50
        });
        this.timeInput = new TimeInput({
            name: 'appointmentTime',
            type: 'time',
            placeholder: 'Select time',
            label: 'Appointment Time',
            labelPosition: 'top',
            required: true,
            min: '09:00',  
            max: '17:00',  
            step: 600  
        })
        this.urlInput = new UrlInput({
            name: 'website',
            type: 'url',
            placeholder: 'Enter your website URL',
            label: 'Website URL',
            labelPosition: 'top',
            required: true,
            pattern: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i
        });
        this.weekInput = new WeekInput({
            name: 'week',
            type: 'week',
            placeholder: 'Select a week',
            label: 'Week',
            labelPosition: 'top',
            required: true,
            min: '2024-W01', 
            max: '2024-W52' 
        })
        let form = document.createElement('form');
        if (form) {
            form.appendChild(this.textInput.render());
            form.appendChild(this.emailInput.render());
            form.appendChild(this.selectInput.render());
            form.appendChild(this.passwordInput.render());
            form.appendChild(this.numberInput.render());
            form.appendChild(this.checkboxInput.render());
            form.appendChild(this.colorInput.render());
            form.appendChild(this.dateInput.render());
            form.appendChild(this.dateTimeInput.render());
            form.appendChild(this.fileInput.render());
            form.appendChild(this.hiddenInput.render());
            form.appendChild(this.monthInput.render());
            form.appendChild(this.raioInput.render());
            form.appendChild(this.rangeInput.render());
            form.appendChild(this.telInput.render());
            form.appendChild(this.textareaInput.render());
            form.appendChild(this.timeInput.render());
            form.appendChild(this.urlInput.render());
            form.appendChild(this.weekInput.render());
            this.shadow.appendChild(form);
            this.updateStyles(`.error-message{color: red}`)
        }
    }

    private updateStyles(styles: string) {
        const style = document.createElement('style');
        style.textContent = styles;
        this.shadow.appendChild(style);
    }
}

customElements.define('pp-form', PPForm);
