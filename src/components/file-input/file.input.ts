import { FormInput } from '@components/input.base';
import { FileInputOptions } from './file.type';
import { ApiService } from '@services/api/api.service';
import { DataParser } from '@services/data.parser';

export class FileInput extends FormInput {
  protected options: FileInputOptions;
  private previewElement?: HTMLImageElement;
  private _apiService: ApiService;

  constructor(options: FileInputOptions, apiService: ApiService) {
    super(options);
    this.options = options;
    this._apiService = apiService;
  }

  public render(): HTMLDivElement {
    const element = super.render();
    this._createPreviewElement();
    return element;
  }

  protected setupValidation(): void {
    this.inputElement.addEventListener('change', () => {
      this._validate();
      this._updatePreview();
      if (this.options.api) {
        this._uploadFiles();
      }
    });
  }

  private _validate(): void {
    let files = (this.inputElement as HTMLInputElement).files;
    const fieldName = this.options.name;
    this.clearErrorMessage(fieldName);
    if (!files) {
      files = new FileList();
    }
    // Required file validation
    if (this.options.required && (!files || files.length === 0)) {
      this.setErrorMessage(
        fieldName,
        `${this.options.label ? this.options.label : 'Field'} is required.`
      );
      return;
    }
    // File type validation
    if (this.options.accept) {
      const acceptedTypes = this.options.accept
        .split(',')
        .map(type => type.trim());
      for (let i = 0; i < files.length; i++) {
        if (!acceptedTypes.includes(files[i].type)) {
          this.setErrorMessage(
            fieldName,
            `Invalid file type. Only ${this.options.accept} are allowed.`
          );
          return;
        }
      }
    }
    // File size validation
    if (this.options.maxSize || this.options.minSize) {
      for (let i = 0; i < files.length; i++) {
        if (this.options.minSize && files[i].size < this.options.minSize) {
          this.setErrorMessage(
            fieldName,
            `File is too small. Minimum size is ${this.options.minSize} bytes.`
          );
          return;
        }
        if (this.options.maxSize && files[i].size > this.options.maxSize) {
          this.setErrorMessage(
            fieldName,
            `File is too large. Maximum size is ${this.options.maxSize} bytes.`
          );
          return;
        }
      }
    }
    // File count validation
    if (
      this.options.maxFiles !== undefined &&
      files.length > this.options.maxFiles
    ) {
      this.setErrorMessage(
        fieldName,
        `You can upload a maximum of ${this.options.maxFiles} files.`
      );
      return;
    }
    if (
      this.options.minFiles !== undefined &&
      files.length < this.options.minFiles
    ) {
      this.setErrorMessage(
        fieldName,
        `You must upload at least ${this.options.minFiles} files.`
      );
      return;
    }
  }

  private _createPreviewElement(): void {
    if (this.options.type === 'file') {
      this.previewElement = document.createElement('img');
      this.previewElement.classList.add('file-preview');
      const previewContainer = document.createElement('div');
      previewContainer.classList.add('preview-container');
      previewContainer.appendChild(this.previewElement);
      this.inputContainer.appendChild(previewContainer);
    }
  }

  private _updatePreview(imageUrl?: string): void {
    if (this.options.type === 'file') {
      const inputElement: any = this.inputElement;
      const file = inputElement.files[0];
      if (this.previewElement && file.type.startsWith('image/')) {
        if (this.options.api && imageUrl) {
          this.previewElement.src = imageUrl;
        } else {
          const reader = new FileReader();
          reader.onload = event => {
            if (event.target && this.previewElement) {
              this.previewElement.src = event.target.result as string;
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  private _uploadFiles(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.options.api) {
        const files = (this.inputElement as HTMLInputElement).files;
        if (!files || files.length === 0) {
          reject(new Error('No files selected.'));
          return;
        }
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append(this.options.api.payloadKey, files[i]);
        }
        const response = await this._apiService.request<any>({
          ...this.options.api,
          body: formData,
        });
        console.log(response);
        this._updatePreview(
          DataParser.getValueFromKey(response, this.options.api.valueKey)
        );
      }
    });
  }
}
