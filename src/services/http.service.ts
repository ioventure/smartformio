import { ApiConfig, ApiResponse } from "@interfaces/api.interface";

/**
 * Generic HTTP Service for making API requests
 */
export class HttpService {
  /**
   * Makes an HTTP request using ApiConfig
   */
  static async request<T = any>(
    config: ApiConfig,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const { endpoint, method, timeout, headers, withCredentials } = config;

      // Prepare fetch options with only provided values
      const requestOptions: RequestInit = {};

      if (method) {
        requestOptions.method = method;
      }

      if (headers) {
        requestOptions.headers = headers;
      }

      if (data) {
        requestOptions.body = JSON.stringify(data);
      }

      if (withCredentials) {
        requestOptions.credentials = "include";
      }

      // Handle timeout if provided
      if (timeout) {
        const controller = new AbortController();
        requestOptions.signal = controller.signal;

        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            controller.abort();
            reject(new Error("Request timeout"));
          }, timeout);
        });

        try {
          const response = await Promise.race([
            fetch(endpoint, requestOptions),
            timeoutPromise,
          ]);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw {
              message: errorData.message || "API request failed",
              status: response.status,
              details: errorData,
            };
          }

          const responseData = await response.json();
          return {
            success: true,
            data: responseData,
          };
        } catch (error) {
          if (error instanceof Error && error.message === "Request timeout") {
            return {
              success: false,
              error: {
                message: "Request timeout",
                code: "TIMEOUT",
              },
            };
          }
          throw error;
        }
      } else {
        // Make request without timeout
        const response = await fetch(endpoint, requestOptions);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw {
            message: errorData.message || "API request failed",
            status: response.status,
            details: errorData,
          };
        }

        const responseData = await response.json();
        return {
          success: true,
          data: responseData,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || "An unexpected error occurred",
          code: error.code || "UNKNOWN_ERROR",
          details: error.details || error,
        },
      };
    }
  }
}
