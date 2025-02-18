/**
 * API Configuration Interface
 */
export interface ApiConfig {
  /** API endpoint URL */
  endpoint: string;
  /** HTTP method to use */
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Additional headers to include */
  headers?: Record<string, string>;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Whether to include credentials */
  withCredentials?: boolean;
}

/**
 * Generic API Response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
    status?: number;
  };
}

/**
 * Form submission response
 */
export type SubmissionResponse = ApiResponse;
