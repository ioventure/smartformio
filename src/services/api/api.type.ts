export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiServiceOptions {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
}

export interface ApiRequestOption {
  endpoint: string;
  method: HttpMethod;
  body?: any;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}
