// ============================================================================
// Servicio de Sucursales — Alineado con SucursalController del backend
// Backend: /api/v1/core/sucursales
// ============================================================================

import { get, post, put } from './apiClient';

// --- Tipos alineados con los DTOs del backend ---

export interface SucursalResponse {
  id: number;
  codigoSucursal: string;
  nombre: string;
  ciudad: string;
  direccion?: string;
  estado: string;
}

export interface SucursalRequest {
  codigoSucursal: string;
  nombre: string;
  ciudad: string;
  direccion?: string;
  estado?: string;
}

// --- Servicio ---

export const SucursalService = {
  /**
   * GET /api/v1/core/sucursales
   * Listar todas las sucursales
   */
  listar: () =>
    get<SucursalResponse[]>('/sucursales'),

  /**
   * GET /api/v1/core/sucursales/activas
   * Listar solo sucursales activas
   */
  listarActivas: () =>
    get<SucursalResponse[]>('/sucursales/activas'),

  /**
   * GET /api/v1/core/sucursales/{id}
   * Obtener sucursal por ID
   */
  obtenerPorId: (id: number) =>
    get<SucursalResponse>(`/sucursales/${id}`),

  /**
   * GET /api/v1/core/sucursales/codigo/{codigoSucursal}
   * Obtener sucursal por código
   */
  obtenerPorCodigo: (codigo: string) =>
    get<SucursalResponse>(`/sucursales/codigo/${codigo}`),

  /**
   * POST /api/v1/core/sucursales
   * Crear nueva sucursal
   */
  crear: (data: SucursalRequest) =>
    post<SucursalResponse>('/sucursales', data),

  /**
   * PUT /api/v1/core/sucursales/{id}
   * Actualizar sucursal existente
   */
  actualizar: (id: number, data: SucursalRequest) =>
    put<SucursalResponse>(`/sucursales/${id}`, data),
};
