export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

type ApiClientOptions = {
  method?: string;
  body?: unknown;
  token?: string;
  useCredentials?: boolean;
};

export async function apiClient<T = unknown>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { method = 'GET', body, token, useCredentials = false } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: useCredentials || !token ? 'include' : 'same-origin',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      (data as { message?: string }).message || 'Request failed',
      data
    );
  }

  return data as T;
}
