import { ApiConfig, SubmissionResponse } from "@interfaces/api.interface";

/**
 * Handles form submission to API
 */
export class FormApi {
  private static readonly DEFAULT_TIMEOUT = 30000; // 30 seconds
  private static readonly DEFAULT_METHOD = "POST";

  /**
   * Submits form data to the configured API endpoint
   */
  static async submit(
    data: Record<string, any>,
    config: ApiConfig
  ): Promise<SubmissionResponse> {
    try {
      // Apply data transformation if configured
      const transformedData = config.transformData
        ? await config.transformData(data)
        : data;

      // Prepare fetch options
      const options: RequestInit = {
        method: config.method || FormApi.DEFAULT_METHOD,
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
        body: JSON.stringify(transformedData),
        // credentials: config.withCredentials ? "include" : "same-origin",
      };

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
      }, config.timeout || FormApi.DEFAULT_TIMEOUT);

      // Make the request
      const response = await fetch(config.endpoint, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeout);

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
    } catch (error: any) {
      // Handle timeout
      if (error.name === "AbortError") {
        return {
          success: false,
          error: {
            message: "Request timeout",
            code: "TIMEOUT",
          },
        };
      }

      // Handle custom error handling if configured
      if (config.handleError) {
        config.handleError(error);
      }

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
