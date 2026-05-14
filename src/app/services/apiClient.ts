// ============================================================================
// Cliente HTTP centralizado para el Core Bancario BanQuito
// Maneja: autenticación JWT, headers, errores y reintentos
// ============================================================================

import { config } from '../config/env';

/**
 * Errores personalizados de la API
 */
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

/**
 * Obtiene el token JWT almacenado en localStorage
 */
function getToken(): string | null {
  return localStorage.getItem('banquito_token');
}

/**
 * Construye los headers base para cada petición
 */
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

/**
 * Procesa la respuesta HTTP y lanza errores si corresponde.
 * El backend envuelve todo en ApiResponse { success, message, data, timestamp },
 * por lo que se extrae el campo "data" automáticamente.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let body;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    // Si es 401, limpiar sesión y redirigir al login
    if (response.status === 401) {
      localStorage.removeItem('banquito_token');
      localStorage.removeItem('banquito_user');
      window.location.reload();
    }

    // Extraer mensaje del wrapper ApiResponse si existe
    const errorMessage = body?.message || response.statusText;
    throw new ApiError(response.status, errorMessage, body?.data || body);
  }

  // Si la respuesta es 204 No Content, retornar vacío
  if (response.status === 204) {
    return {} as T;
  }

  const json = await response.json();

  // Si la respuesta tiene el formato ApiResponse del backend, extraer .data
  if (json !== null && typeof json === 'object' && 'success' in json && 'data' in json) {
    if (!json.success) {
      throw new ApiError(response.status, json.message || 'Error del servidor', json.data);
    }
    return json.data as T;
  }

  // Si no tiene wrapper (respuesta directa), retornar tal cual
  return json as T;
}

// ============================================================================
// Métodos HTTP públicos
// ============================================================================

/**
 * GET request
 */
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

/**
 * POST request
 */
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

/**
 * PUT request
 */
export async function put<T>(path: string, body: any): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

/**
 * PATCH request
 */
export async function patch<T>(path: string, body: any): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method: 'PATCH',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

/**
 * DELETE request
 */
export async function del<T>(path: string, body?: any): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(response);
}
