import { ApiConfig, FormCallbacks } from "../interfaces/api.interface";

/**
 * Default API configuration
 */
export const defaultApiConfig: ApiConfig = {
  endpoint: "https://api.example.com/submit",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Custom-Header": "demo-form",
  },
  timeout: 5000,
  withCredentials: true,
  transformData: (data: Record<string, any>) => ({
    ...data,
    submittedAt: new Date().toISOString(),
  }),
  handleError: (error: any) => {
    console.error("API Error:", error);
    if (error.code === "TIMEOUT") {
      alert("Request timed out. Please try again.");
    } else {
      alert("An error occurred: " + (error.message || "Unknown error"));
    }
  },
};

/**
 * Default form callbacks
 */
export const defaultCallbacks: FormCallbacks = {
  onSubmit: (data: Record<string, any>) => {
    console.log("Form is being submitted:", data);
    document.body.style.cursor = "wait";
  },
  onSuccess: (response: any) => {
    console.log("Submission successful:", response);
    alert("Form submitted successfully!");
    document.body.style.cursor = "default";
  },
  onError: (error: any) => {
    console.error("Submission failed:", error);
    alert("Form submission failed: " + (error.message || "Unknown error"));
    document.body.style.cursor = "default";
  },
};

/**
 * Creates a configured API instance with custom overrides
 */
export function createApiConfig(customConfig?: Partial<ApiConfig>): ApiConfig {
  return {
    ...defaultApiConfig,
    ...customConfig,
    headers: {
      ...defaultApiConfig.headers,
      ...customConfig?.headers,
    },
  };
}

/**
 * Creates form callbacks with custom overrides
 */
export function createFormCallbacks(
  customCallbacks?: Partial<FormCallbacks>
): FormCallbacks {
  return {
    ...defaultCallbacks,
    ...customCallbacks,
  };
}
