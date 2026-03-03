const BASE_URL = "https://api.escuelajs.co/api/v1";

export function getToken(): string | null {
  return localStorage.getItem("access_token");
}

type ApiFetchOptions<TBody> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  auth?: boolean;
};

export async function apiFetch<TResponse, TBody = unknown>(
  path: string,
  { method = "GET", body, auth = false }: ApiFetchOptions<TBody> = {},
): Promise<TResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const msg =
      (data as any)?.message ||
      (data as any)?.error ||
      `Request failed (${res.status})`;
    const message = Array.isArray(msg) ? msg.join(", ") : String(msg);
    throw new Error(message);
  }

  return data as TResponse;
}
