// ============================================================================
// Servicio de Parámetros Core — Alineado con ParametroCoreController del backend
// Backend: /api/v1/core/parametros
// Nota: El backend NO tiene endpoint PATCH para editar parámetros
// ============================================================================

import { get } from './apiClient';

// --- Tipos alineados con los DTOs del backend ---

export interface ParametroCoreResponse {
  codigo: string;
  nombre: string;
  valorTexto: string;
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
};
