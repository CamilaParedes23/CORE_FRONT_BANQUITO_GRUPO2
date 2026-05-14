// ============================================================================
// Servicio de Cuentas Institucionales — Alineado con CuentaInstitucionalController
// Backend: /api/v1/core/cuentas-institucionales
// ============================================================================

import { get } from './apiClient';

// --- Tipos alineados con los DTOs del backend ---

export interface CuentaInstitucionalResponse {
  id: number;
  numeroCuenta: string;
  codigo: string;
  nombre: string;
  tipoCuenta: string;
  saldoContable: number;
  estado: string;
}

// --- Servicio ---

export const CuentaInstitucionalService = {
  /**
   * GET /api/v1/core/cuentas-institucionales
   * Listar todas las cuentas institucionales
   */
  listar: () =>
    get<CuentaInstitucionalResponse[]>('/cuentas-institucionales'),

  /**
   * GET /api/v1/core/cuentas-institucionales/{numeroCuenta}
   * Obtener cuenta institucional por número de cuenta
   */
  obtenerPorNumero: (numeroCuenta: string) =>
    get<CuentaInstitucionalResponse>(`/cuentas-institucionales/${numeroCuenta}`),

  /**
   * GET /api/v1/core/cuentas-institucionales/codigo/{codigo}
   * Obtener cuenta institucional por código
   */
  obtenerPorCodigo: (codigo: string) =>
    get<CuentaInstitucionalResponse>(`/cuentas-institucionales/codigo/${codigo}`),
};
