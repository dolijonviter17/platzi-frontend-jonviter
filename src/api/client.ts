import axios, { AxiosError, AxiosRequestConfig } from "axios";

const BASE_URL = "https://api.escuelajs.co/api/v1";

export function getToken(): string | null {
  return localStorage.getItem("access_token");
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function apiFetch<TResponse, TBody = unknown>(
  path: string,
  options: AxiosRequestConfig<TBody> = {},
): Promise<TResponse> {
  try {
    const response = await api.request<TResponse>({
      url: path,
      ...options,
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError<any>;

    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Request failed";

    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }
}
