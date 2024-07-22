export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiOptions {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
}

export interface ApiRequestOption {
  type?: 'JSON' | 'FORM_DATA';
  endpoint: string;
  method: HttpMethod;
  body?: any;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}
