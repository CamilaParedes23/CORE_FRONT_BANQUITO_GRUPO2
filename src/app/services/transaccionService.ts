import { get, post } from './apiClient';
export interface TransferenciaRequest {
  cuentaOrigen: string;
  cuentaDestino: string;
  codigoSubtipo: string;
  monto: number;
  uuidOperacion: string;
  uuidGrupoOperacion?: string;
  referenciaExterna?: string;
  descripcion?: string;
  canalOrigen?: string;
  fechaNegocio?: string;
  usuarioCoreId?: number;
  credencialWebId?: number;
}

export interface TransferenciaResponse {
  estado: string;
  uuidDebitoCore: string;
  uuidCreditoCore: string;
  uuidGrupoOperacion: string;
  saldoDisponibleOrigen: number;
  numeroComprobante: string;
}

export interface MovimientoCuentaResponse {
  id: number;
  uuidTransaccion: string;
  tipoMovimiento: 'DEBITO' | 'CREDITO';
  monto: number;
  saldoResultante: number;
  descripcion: string;
  fechaTransaccion: string;
  numeroComprobante?: string;
  numeroCuenta?: string;
}

export interface TransaccionData {
  uuidTransaccion?: string;
  monto: number;
  tipoMovimiento: 'DEBITO' | 'CREDITO';
  cuentaId: string;
  subtipoTransaccion?: string;
  descripcion?: string;
}

export interface SubtipoTransaccionResponse {
  id: number;
  codigo: string;
  nombre: string;
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
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: generar un UUID v4 compatible
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
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
    get<MovimientoCuentaResponse[]>(`/transacciones/${uuid}`),

  obtenerMovimientosPorCuenta: (numeroCuenta: string) =>
    get<MovimientoCuentaResponse[]>(`/transacciones/cuenta/${numeroCuenta}`),

  obtenerSubtiposPorTipo: (tipo: 'CREDITO' | 'DEBITO') =>
    get<SubtipoTransaccionResponse[]>(`/subtipos-transaccion?tipo=${tipo}`),

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
