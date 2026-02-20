import { API_BASE_URL, API_TIMEOUT } from "../constants/api.constant";

export interface HttpRequestConfig {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  signal?: AbortSignal;
  timeout?: number;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
    public data?: any,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

class HttpService {
  private baseURL: string;
  private defaultTimeout: number;
  private requestInterceptors: Array<
    (
      config: HttpRequestConfig,
    ) => HttpRequestConfig | Promise<HttpRequestConfig>
  > = [];
  private responseInterceptors: Array<
    (response: HttpResponse) => HttpResponse | Promise<HttpResponse>
  > = [];

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
  }

  addRequestInterceptor(
    interceptor: (
      config: HttpRequestConfig,
    ) => HttpRequestConfig | Promise<HttpRequestConfig>,
  ) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(
    interceptor: (
      response: HttpResponse,
    ) => HttpResponse | Promise<HttpResponse>,
  ) {
    this.responseInterceptors.push(interceptor);
  }

  async request<T = any>(
    url: string,
    config: HttpRequestConfig = {},
  ): Promise<HttpResponse<T>> {
    let requestConfig = { ...config };

    for (const interceptor of this.requestInterceptors) {
      requestConfig = await interceptor(requestConfig);
    }

    const {
      method = "GET",
      headers = {},
      body,
      signal,
      timeout = this.defaultTimeout,
    } = requestConfig;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: signal || controller.signal,
      });

      clearTimeout(timeoutId);

      let data: T;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = (await response.text()) as any;
      }

      if (!response.ok) {
        throw new HttpError(
          response.status,
          response.statusText,
          (data as any)?.message || "Request failed",
          data,
        );
      }

      let httpResponse: HttpResponse<T> = {
        data,
        status: response.status,
        headers: response.headers,
      };

      for (const interceptor of this.responseInterceptors) {
        httpResponse = await interceptor(httpResponse);
      }

      return httpResponse;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof HttpError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new HttpError(408, "Request Timeout", "Request timed out");
        }
        throw new HttpError(0, "Network Error", error.message);
      }

      throw new HttpError(0, "Unknown Error", "An unknown error occurred");
    }
  }

  async get<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, "method" | "body">,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  async post<T = any>(
    url: string,
    body?: any,
    config?: Omit<HttpRequestConfig, "method" | "body">,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...config, method: "POST", body });
  }

  async put<T = any>(
    url: string,
    body?: any,
    config?: Omit<HttpRequestConfig, "method" | "body">,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...config, method: "PUT", body });
  }

  async patch<T = any>(
    url: string,
    body?: any,
    config?: Omit<HttpRequestConfig, "method" | "body">,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...config, method: "PATCH", body });
  }

  async delete<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, "method">,
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }
}

export const httpService = new HttpService();

httpService.addRequestInterceptor((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});
