import {
  ApiRequestOption as ApiRequestOptions,
  ApiServiceOptions,
} from '@services/api/api.type';

export class ApiService {
  private _baseUrl?: string;
  private _defaultHeaders?: Record<string, string>;

  constructor(options?: ApiServiceOptions) {
    this._baseUrl = options?.baseUrl;
    this._defaultHeaders = options?.defaultHeaders || {};
  }

  async request<T>(options: ApiRequestOptions): Promise<T> {
    const requestOptions = {
      method: options.method,
      headers: {
        ...this._defaultHeaders,
        ...options.headers,
        'Content-Type': 'application/json',
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    };
    const response = await fetch(
      this._createUrlWithParams(options),
      requestOptions
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  }

  private _createUrlWithParams(options: ApiRequestOptions) {
    let url = `${this._baseUrl}${options.endpoint}`;
    if (options.endpoint.startsWith('http')) {
      url = options.endpoint;
    }
    if (options.params) {
      url += this._buildQueryString(options.params);
    }
    return url;
  }

  private _buildQueryString(
    params: Record<string, string | number | boolean>
  ): string {
    const query = new URLSearchParams(params as any).toString();
    return query ? `?${query}` : '';
  }
}
