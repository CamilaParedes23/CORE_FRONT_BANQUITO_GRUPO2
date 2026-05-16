import { get, post, patch } from './apiClient';
export interface CuentaAperturaData {
  clienteId: number;
  sucursalId: number;
  subtipoCuentaId: number;
  permiteSobregiro?: boolean;
  esFavoritaPagos?: boolean;
}

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

export interface SaldoResponse {
  numeroCuenta: string;
  estado: string;
  saldoContable: number;
  saldoDisponible: number;
  permiteDebito: boolean;
}

export interface CambioEstadoData {
  nuevoEstado: 'ACTIVA' | 'INACTIVA' | 'BLOQUEADA' | 'SUSPENDIDA';
  motivoCambio: string;
  usuarioCoreId: number;
}

export interface BloqueoData {
  montoBloqueado: number;
  motivo: 'JUDICIAL' | 'PREVIO_PAGO' | 'GARANTIA';
  referenciaExterna?: string;
  usuarioCoreId: number;
}

export interface MovimientoResponse {
  id: number;
  uuidTransaccion: string;
  tipoMovimiento: 'DEBITO' | 'CREDITO';
  monto: number;
  saldoResultante: number;
  descripcion: string;
  fechaTransaccion: string;
}

export const CuentaService = {
  listar: () =>
    get<CuentaResponse[]>('/cuentas'),

  abrir: (data: CuentaAperturaData) =>
    post<CuentaResponse>('/cuentas', data),

  obtenerPorId: (id: number) =>
    get<CuentaResponse>(`/cuentas/${id}`),

  obtenerPorNumero: (numeroCuenta: string) =>
    get<CuentaResponse>(`/cuentas/numero/${numeroCuenta}`),

  obtenerSaldo: (numeroCuenta: string) =>
    get<SaldoResponse>(`/cuentas/numero/${numeroCuenta}/saldo`),

  cambiarEstado: (id: number, data: CambioEstadoData) =>
    patch<CuentaResponse>(`/cuentas/${id}/estado`, data),

  crearBloqueo: (id: number, data: BloqueoData) =>
    post<void>(`/cuentas/${id}/bloqueos`, data),

  liberarBloqueo: (bloqueoId: number) =>
    patch<void>(`/cuentas/bloqueos/${bloqueoId}/liberar`, {}),

  obtenerMovimientos: (numeroCuenta: string) =>
    get<MovimientoResponse[]>(`/transacciones/cuenta/${numeroCuenta}`),
};
