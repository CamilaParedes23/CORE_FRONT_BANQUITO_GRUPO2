// ============================================================================
// Servicio de Usuarios Core — Alineado con SecurityController del backend
// Backend: /api/v1/core/usuarios-core y /api/v1/core/credenciales-web
// Nota: El backend NO tiene endpoint de listado general, solo consulta individual
// ============================================================================

import { get, post } from './apiClient';

// --- Tipos alineados con los DTOs del backend ---

export interface UsuarioCoreResponse {
  id: number;
  sucursalId: number;
  usuario: string;
  nombreCompleto: string;
  rol: 'CAJERO' | 'OPERADOR' | 'SUPERVISOR_AGENCIA' | 'ADMIN_CORE' | 'AUDITOR';
  estado: string;
  ultimoLogin: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CredencialWebResponse {
  id: number;
  username: string;
  estado: string;
}

export interface UsuarioCoreRequest {
  usuario: string;
  contrasena: string;
  nombreCompleto: string;
  rol: string;
  sucursalId?: number | null;
}

// --- Servicio ---

export const UsuarioCoreService = {
  /**
   * GET /api/v1/core/usuarios-core/{username}
   * Obtener un usuario core por su username
   * Nota: No existe endpoint de listado, solo consulta individual
   */
  obtenerPorUsername: (username: string) =>
    get<UsuarioCoreResponse>(`/usuarios-core/${username}`),

  /**
   * POST /api/v1/core/usuarios-core
   * Crear un nuevo usuario core
   */
  crear: (data: UsuarioCoreRequest) =>
    post<UsuarioCoreResponse>('/usuarios-core', data),

  /**
   * GET /api/v1/core/usuarios-core/{username}/validacion
   * Validar rol y estado de un usuario
   */
  validar: (username: string, rol: string, estado: string) =>
    get<boolean>(`/usuarios-core/${username}/validacion`, { rol, estado }),

  /**
   * GET /api/v1/core/credenciales-web/{username}
   * Obtener credencial web por username
   */
  obtenerCredencialWeb: (username: string) =>
    get<CredencialWebResponse>(`/credenciales-web/${username}`),

  /**
   * GET /api/v1/core/credenciales-web/{username}/validacion
   * Validar estado de una credencial web
   */
  validarCredencialWeb: (username: string, estado: string) =>
    get<boolean>(`/credenciales-web/${username}/validacion`, { estado }),
};
