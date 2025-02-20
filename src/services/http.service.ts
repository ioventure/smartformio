import { IApiConfig, IApiResponse } from "@interfaces/api.interface";
import { errorHandler } from "./error.service";
import { logger } from "./logger.service";
import { IApiErrorResponse } from "@interfaces/error.interface";

/**
 * Singleton HTTP Service for making API requests
 * Handles API communication in both static and SSR environments
 */
export class HttpService {
  private static instance: HttpService;
  private static readonly logContext = "HttpService";

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of HttpService
   */
  public static getInstance(): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService();
    }
    return HttpService.instance;
  }

  /**
   * Handle API error responses
   */
  private handleApiError(
    error: any,
    status?: number,
    endpoint?: string,
    timeout?: number
  ): IApiResponse<any> {
    const apiError: IApiErrorResponse = {
      message: error.message || "API request failed",
      code: error.code || (status ? `HTTP_${status}` : "UNKNOWN_ERROR"),
      status,
      details: {
        ...(error.details || {}),
        endpoint,
        timeout,
      },
    };

    logger.error(
      `API Error: ${apiError.message}`,
      error instanceof Error ? error : new Error(String(error)),
      HttpService.logContext
    );

    errorHandler.handleApiError(apiError);
    return {
      success: false,
      error: {
        message: apiError.message,
        code: apiError.code,
        details: apiError.details,
      },
    };
  }

  /**
   * Makes an HTTP request using ApiConfig
   */
  public async request<T = any>(
    config: IApiConfig,
    data?: any
  ): Promise<IApiResponse<T>> {
    const { endpoint, method, timeout, headers, withCredentials } = config;

    logger.info(
      `Starting ${method || "GET"} request to ${endpoint}`,
      HttpService.logContext
    );

    logger.debug(
      `Request config: ${JSON.stringify({
        method,
        withCredentials,
        timeout,
        hasData: !!data,
      })}`,
      HttpService.logContext
    );

    try {
      const requestOptions: RequestInit = {
        method: method || "GET",
        headers: headers || {},
        credentials: withCredentials ? "include" : "same-origin",
      };

      if (data) {
        requestOptions.body = JSON.stringify(data);
      }

      let response: Response;

      if (timeout) {
        const controller = new AbortController();
        requestOptions.signal = controller.signal;

        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
          response = await fetch(endpoint, requestOptions);
          clearTimeout(timeoutId);
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            return this.handleApiError(
              { message: "Request timeout", code: "TIMEOUT" },
              undefined,
              endpoint,
              timeout
            );
          }
          throw error;
        }
      } else {
        response = await fetch(endpoint, requestOptions);
      }

      if (!response.ok) {
        logger.warn(
          `Request failed with status ${response.status}`,
          HttpService.logContext
        );
        const errorData = await response.json().catch(() => ({}));
        return this.handleApiError(errorData, response.status, endpoint);
      }

      const responseData = await response.json();
      logger.debug(
        `Request completed successfully with status ${response.status}`,
        HttpService.logContext
      );
      return {
        success: true,
        data: responseData,
      };
    } catch (error: any) {
      return this.handleApiError(error, undefined, endpoint);
    }
  }
}

// Export singleton instance
export const httpService = HttpService.getInstance();
