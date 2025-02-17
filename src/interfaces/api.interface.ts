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
  /** Transform data before submission */
  transformData?: (
    data: Record<string, any>
  ) => Record<string, any> | Promise<Record<string, any>>;
  /** Custom error handler */
  handleError?: (error: any) => void;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Whether to include credentials */
  withCredentials?: boolean;
}

/**
 * Form submission callbacks
 */
export interface FormCallbacks {
  /** Called when form submission starts */
  onSubmit?: (data: Record<string, any>) => void | Promise<void>;
  /** Called when form submission succeeds */
  onSuccess?: (response: any) => void | Promise<void>;
  /** Called when form submission fails */
  onError?: (error: any) => void | Promise<void>;
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
