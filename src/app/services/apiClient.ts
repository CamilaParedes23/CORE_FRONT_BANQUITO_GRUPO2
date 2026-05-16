import { config } from '../config/env';

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body?: any
  ) {
    super(`Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  return localStorage.getItem('banquito_token');
}

function buildHeaders(options?: {
  idempotencyKey?: string;
  contentType?: string;
}): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': options?.contentType || 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options?.idempotencyKey) {
    headers['Idempotency-Key'] = options.idempotencyKey;
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let body;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (response.status === 401) {
      localStorage.removeItem('banquito_token');
      localStorage.removeItem('banquito_user');
      window.location.reload();
    }

    const errorMessage = body?.message || response.statusText;
    throw new ApiError(response.status, errorMessage, body?.data || body);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const json = await response.json();

  if (json !== null && typeof json === 'object' && 'success' in json && 'data' in json) {
    if (!json.success) {
      throw new ApiError(response.status, json.message || 'Error del servidor', json.data);
    }
    return json.data as T;
  }

  return json as T;
}

export async function get<T>(path: string, params?: Record<string, any>): Promise<T> {
  let url = `${config.apiBaseUrl}${path}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(),
  });

  return handleResponse<T>(response);
}

export async function post<T>(
  path: string,
  body: any,
  options?: { idempotencyKey?: string }
): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method: 'POST',
    headers: buildHeaders(options),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

export async function put<T>(path: string, body: any): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

export async function patch<T>(path: string, body: any): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method: 'PATCH',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

export async function del<T>(path: string, body?: any): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(response);
}
