import { ApiRequestOption as ApiRequestOptions, ApiServiceOptions } from "@services/api/api.type";

export class ApiService {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;

    constructor(options: ApiServiceOptions) {
        this.baseUrl = options.baseUrl;
        this.defaultHeaders = options.defaultHeaders || {};
    }

    async request<T>(
        options: ApiRequestOptions
    ): Promise<T> {
        const response = await fetch(this.createUrlWithParams(options), {
            method: options.method,
            headers: {
                ...this.defaultHeaders,
                ...options.headers,
                'Content-Type': 'application/json',
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'An error occurred');
        }

        return response.json();
    }

    private createUrlWithParams(options: ApiRequestOptions) {
        let url = `${this.baseUrl}${options.endpoint}`
        if (options.endpoint.startsWith('http')) {
            url = options.endpoint;
        }
        if (options.params) {
            url += this.buildQueryString(options.params);
        }
        return url;
    }

    private buildQueryString(params: Record<string, string | number | boolean>): string {
        const query = new URLSearchParams(params as any).toString();
        return query ? `?${query}` : '';
    }
}
