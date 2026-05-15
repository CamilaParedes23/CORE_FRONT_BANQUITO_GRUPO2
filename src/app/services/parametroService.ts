// ============================================================================
// Servicio de Parámetros Core — Alineado con ParametroCoreController del backend
// Backend: /api/v1/core/parametros
// ============================================================================

import { get, post, put } from './apiClient';

// --- Tipos alineados con los DTOs del backend ---

export interface ParametroCoreResponse {
  codigo: string;
  nombre: string;
  valorTexto: string;
  tipoDato: 'NUMERICO' | 'HORA' | 'BOOLEANO' | 'CADENA' | 'FECHA';
  descripcion: string;
}

export interface ParametroCoreRequest {
  codigo: string;
  nombre: string;
  valor: string;
  tipoDato: 'NUMERICO' | 'HORA' | 'BOOLEANO' | 'CADENA' | 'FECHA';
  descripcion: string;
}

// --- Servicio ---

export const ParametroService = {
  /**
   * GET /api/v1/core/parametros
   * Listar todos los parámetros
   */
  listar: () =>
    get<ParametroCoreResponse[]>('/parametros'),

  /**
   * GET /api/v1/core/parametros/activos
   * Listar solo parámetros activos
   */
  listarActivos: () =>
    get<ParametroCoreResponse[]>('/parametros/activos'),

  /**
   * GET /api/v1/core/parametros/{codigo}
   * Obtener un parámetro por su código
   */
  obtenerPorCodigo: (codigo: string) =>
    get<ParametroCoreResponse>(`/parametros/${codigo}`),

  /**
   * POST /api/v1/core/parametros
   * Crear un nuevo parámetro
   */
  crear: (data: ParametroCoreRequest) =>
    post<ParametroCoreResponse>('/parametros', data),

  /**
   * PUT /api/v1/core/parametros/{codigo}
   * Actualizar un parámetro existente
   */
  actualizar: (codigo: string, data: ParametroCoreRequest) =>
    put<ParametroCoreResponse>(`/parametros/${codigo}`, data),
};
