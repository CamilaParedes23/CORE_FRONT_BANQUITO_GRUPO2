// ============================================================================
// Servicio de Cuentas — Alineado con CuentaController del backend
// Backend: /api/v1/core/cuentas
// ============================================================================

import { get, post, patch } from './apiClient';

// --- Tipos alineados con los DTOs del backend ---

/**
 * Request para crear una cuenta.
 * Coincide con: com.banquito.core.accounts.dto.api.CrearCuentaRequest
 */
export interface CuentaAperturaData {
  clienteId: number;
  sucursalId: number;
  subtipoCuentaId: number;
  permiteSobregiro?: boolean;
  esFavoritaPagos?: boolean;
}

/**
 * Response de una cuenta.
 * Coincide con: com.banquito.core.accounts.dto.api.CuentaResponse
 */
export interface CuentaResponse {
  id: number;
  numeroCuenta: string;
  clienteId: number;
  sucursalId: number;
  subtipoCuentaId: number;
  estado: string;
  saldoContable: number;
  saldoDisponible: number;
  permiteSobregiro: boolean;
  limiteSobregiro: number;
  esFavoritaPagos: boolean;
}

/**
 * Response de saldo de una cuenta.
 * Coincide con: com.banquito.core.accounts.dto.api.SaldoCuentaResponse
 */
export interface SaldoResponse {
  numeroCuenta: string;
  estado: string;
  saldoContable: number;
  saldoDisponible: number;
  permiteDebito: boolean;
}

/**
 * Request para cambiar estado de una cuenta.
 * Coincide con: com.banquito.core.accounts.dto.api.CambiarEstadoCuentaRequest
 */
export interface CambioEstadoData {
  estadoNuevo: 'ACTIVA' | 'INACTIVA' | 'BLOQUEADA' | 'SUSPENDIDA';
  motivo: string;
  usuarioId: number;
}

/**
 * Request para bloquear una cuenta.
 * Coincide con: com.banquito.core.accounts.dto.api.BloquearCuentaRequest
 */
export interface BloqueoData {
  monto: number;
  motivo: 'JUDICIAL' | 'PREVIO_PAGO' | 'GARANTIA';
  referenciaExterna?: string;
}

/**
 * Response de movimiento de cuenta.
 * Coincide con: com.banquito.core.transactions.dto.api.MovimientoCuentaResponse
 */
export interface MovimientoResponse {
  id: number;
  uuidTransaccion: string;
  tipoMovimiento: 'DEBITO' | 'CREDITO';
  monto: number;
  saldoResultante: number;
  descripcion: string;
  fechaTransaccion: string;
}

// --- Servicio ---

export const CuentaService = {
  /**
   * GET /api/v1/core/cuentas
   * Listar todas las cuentas
   */
  listar: () =>
    get<CuentaResponse[]>('/cuentas'),

  /**
   * POST /api/v1/core/cuentas
   * Apertura de cuenta vinculada a sucursal
   */
  abrir: (data: CuentaAperturaData) =>
    post<CuentaResponse>('/cuentas', data),

  /**
   * GET /api/v1/core/cuentas/{id}
   * Detalle de cuenta por ID numérico
   */
  obtenerPorId: (id: number) =>
    get<CuentaResponse>(`/cuentas/${id}`),

  /**
   * GET /api/v1/core/cuentas/numero/{numeroCuenta}
   * Detalle de cuenta por número de cuenta
   */
  obtenerPorNumero: (numeroCuenta: string) =>
    get<CuentaResponse>(`/cuentas/numero/${numeroCuenta}`),

  /**
   * GET /api/v1/core/cuentas/numero/{numeroCuenta}/saldo
   * Consulta de saldo contable y disponible
   */
  obtenerSaldo: (numeroCuenta: string) =>
    get<SaldoResponse>(`/cuentas/numero/${numeroCuenta}/saldo`),

  /**
   * PATCH /api/v1/core/cuentas/{id}/estado
   * Cambio de estado operativo (usa ID numérico)
   */
  cambiarEstado: (id: number, data: CambioEstadoData) =>
    patch<CuentaResponse>(`/cuentas/${id}/estado`, data),

  /**
   * POST /api/v1/core/cuentas/{id}/bloqueos
   * Creación de bloqueo sobre el saldo (usa ID numérico)
   */
  crearBloqueo: (id: number, data: BloqueoData) =>
    post<void>(`/cuentas/${id}/bloqueos`, data),

  /**
   * PATCH /api/v1/core/cuentas/bloqueos/{id}/liberar
   * Liberación de un bloqueo existente
   */
  liberarBloqueo: (bloqueoId: number) =>
    patch<void>(`/cuentas/bloqueos/${bloqueoId}/liberar`, {}),

  /**
   * GET /api/v1/core/transacciones/cuenta/{numeroCuenta}
   * Historial de movimientos de una cuenta (está en TransaccionController)
   */
  obtenerMovimientos: (numeroCuenta: string) =>
    get<MovimientoResponse[]>(`/transacciones/cuenta/${numeroCuenta}`),
};
