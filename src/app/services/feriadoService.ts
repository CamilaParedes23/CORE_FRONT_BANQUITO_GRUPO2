// ============================================================================
// Servicio de Feriados — Alineado con FeriadoController del backend
// Backend: /api/v1/core/feriados
// ============================================================================

import { get } from './apiClient';

// --- Tipos alineados con los DTOs del backend ---

export interface FeriadoResponse {
  fechaFeriado: string;
  nombre: string;
  esFinSemana: boolean;
  estado: string;
}

export interface DiaHabilResponse {
  fechaConsulta: string;
  siguienteDiaHabil: string;
  diasCalculados: number;
  mensaje: string;
}

// --- Servicio ---

export const FeriadoService = {
  /**
   * GET /api/v1/core/feriados
   * Listar todos los feriados
   */
  listar: () =>
    get<FeriadoResponse[]>('/feriados'),

  /**
   * GET /api/v1/core/feriados/{fecha}
   * Obtener feriado por fecha (formato: yyyy-MM-dd)
   */
  obtenerPorFecha: (fecha: string) =>
    get<FeriadoResponse>(`/feriados/${fecha}`),

  /**
   * GET /api/v1/core/feriados/siguiente-dia-habil?fecha=yyyy-MM-dd
   * Calcular el siguiente día hábil a partir de una fecha
   */
  calcularSiguienteDiaHabil: (fecha: string) =>
    get<DiaHabilResponse>('/feriados/siguiente-dia-habil', { fecha }),
};
