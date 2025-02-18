/**
 * API Configuration Interface
 */
export interface ApiConfig {
  /** API endpoint URL */
  endpoint: string;
  /** HTTP method to use */
  method?: "POST" | "PUT" | "PATCH";
  /** Additional headers to include */
  headers?: Record<string, string>;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Whether to include credentials */
  withCredentials?: boolean;
}

/**
 * Form submission response
 */
export interface SubmissionResponse {
  success: boolean;
  data?: any;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}
