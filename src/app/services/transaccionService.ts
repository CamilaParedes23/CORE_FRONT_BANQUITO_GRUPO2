import { get, post } from './apiClient';
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

export interface TransferenciaResponse {
  estado: string;
  uuidDebitoCore: string;
  uuidCreditoCore: string;
  uuidGrupoOperacion: string;
  saldoDisponibleOrigen: number;
}

export interface MovimientoCuentaResponse {
  id: number;
  uuidTransaccion: string;
  tipoMovimiento: 'DEBITO' | 'CREDITO';
  monto: number;
  saldoResultante: number;
  descripcion: string;
  fechaTransaccion: string;
}

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

export function generarUuidTransaccion(): string {
  return `${crypto.randomUUID ? crypto.randomUUID() : `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`}`;
}

export function generarIdempotencyKey(): string {
  return `IDK-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const TransaccionService = {
  transferir: (data: TransferenciaRequest) =>
    post<TransferenciaResponse>('/transacciones/transferencias', data, {
      idempotencyKey: generarIdempotencyKey(),
    }),

  consultarPorUuid: (uuid: string) =>
    get<MovimientoCuentaResponse>(`/transacciones/${uuid}`),

  obtenerMovimientosPorCuenta: (numeroCuenta: string) =>
    get<MovimientoCuentaResponse[]>(`/transacciones/cuenta/${numeroCuenta}`),

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
