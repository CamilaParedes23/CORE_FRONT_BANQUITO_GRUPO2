// ============================================================================
// Servicio de Transacciones — Alineado con TransaccionController del backend
// Backend: /api/v1/core/transacciones
// ============================================================================

import { get, post } from './apiClient';

// --- Tipos alineados con los DTOs del backend ---

/**
 * Request para ejecutar una transferencia.
 * Coincide con: com.banquito.core.transactions.dto.api.TransferenciaRequest
 */
export interface TransferenciaRequest {
  uuidOperacion: string;
  uuidGrupoOperacion?: string;
  cuentaOrigen: string;
  cuentaDestino: string;
  monto: number;
  codigoSubtipo: string;
  referenciaExterna?: string;
  descripcion?: string;
}

/**
 * Response de una transferencia.
 * Coincide con: com.banquito.core.transactions.dto.api.TransferenciaResponse
 */
export interface TransferenciaResponse {
  estado: string;
  uuidDebitoCore: string;
  uuidCreditoCore: string;
  uuidGrupoOperacion: string;
  saldoDisponibleOrigen: number;
}

/**
 * Response de un movimiento de cuenta.
 * Coincide con: com.banquito.core.transactions.dto.api.MovimientoCuentaResponse
 */
export interface MovimientoCuentaResponse {
  id: number;
  uuidTransaccion: string;
  tipoMovimiento: 'DEBITO' | 'CREDITO';
  monto: number;
  saldoResultante: number;
  descripcion: string;
  fechaTransaccion: string;
}

// --- Tipos legacy (para compatibilidad con componentes existentes) ---

export interface TransaccionData {
  uuidTransaccion?: string;
  monto: number;
  tipoMovimiento: 'DEBITO' | 'CREDITO';
  cuentaId: string;
  subtipoTransaccion?: string;
  descripcion?: string;
}

export interface TransaccionResponse {
  uuidTransaccion?: string;
  estado: string;
  monto: number;
  cuentaId?: string;
  fechaProceso?: string;
  saldoResultante?: number;
  descripcion?: string;
  canal?: string;
}

// --- Helpers ---

/**
 * Genera un UUID único para operaciones
 */
export function generarUuidTransaccion(): string {
  return `${crypto.randomUUID ? crypto.randomUUID() : `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`}`;
}

/**
 * Genera una Idempotency-Key para el header HTTP
 */
export function generarIdempotencyKey(): string {
  return `IDK-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// --- Servicio ---

export const TransaccionService = {
  /**
   * POST /api/v1/core/transacciones/transferencias
   * Ejecutar una transferencia entre dos cuentas
   */
  transferir: (data: TransferenciaRequest) =>
    post<TransferenciaResponse>('/transacciones/transferencias', data, {
      idempotencyKey: generarIdempotencyKey(),
    }),

  /**
   * GET /api/v1/core/transacciones/{uuid}
   * Consulta de un movimiento por su UUID
   */
  consultarPorUuid: (uuid: string) =>
    get<MovimientoCuentaResponse>(`/transacciones/${uuid}`),

  /**
   * GET /api/v1/core/transacciones/cuenta/{numeroCuenta}
   * Historial de movimientos de una cuenta
   */
  obtenerMovimientosPorCuenta: (numeroCuenta: string) =>
    get<MovimientoCuentaResponse[]>(`/transacciones/cuenta/${numeroCuenta}`),

  /**
   * Helper: Procesar un débito/crédito individual
   * Internamente usa transferencias, requiere cuenta destino institucional
   */
  procesar: (data: TransaccionData) => {
    const request: TransferenciaRequest = {
      uuidOperacion: data.uuidTransaccion || generarUuidTransaccion(),
      cuentaOrigen: data.tipoMovimiento === 'DEBITO' ? data.cuentaId : 'INST-OPERATIVA',
      cuentaDestino: data.tipoMovimiento === 'CREDITO' ? data.cuentaId : 'INST-OPERATIVA',
      monto: data.monto,
      codigoSubtipo: data.subtipoTransaccion || 'TRANSFERENCIA',
      descripcion: data.descripcion,
    };
    return post<TransferenciaResponse>('/transacciones/transferencias', request, {
      idempotencyKey: generarIdempotencyKey(),
    });
  },
};
