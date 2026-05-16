import { get } from './apiClient';

export interface CuentaInstitucionalResponse {
  id: number;
  numeroCuenta: string;
  codigo: string;
  nombre: string;
  tipoCuenta: string;
  saldoContable: number;
  estado: string;
}

export const CuentaInstitucionalService = {
  listar: () =>
    get<CuentaInstitucionalResponse[]>('/cuentas-institucionales'),

  obtenerPorNumero: (numeroCuenta: string) =>
    get<CuentaInstitucionalResponse>(`/cuentas-institucionales/${numeroCuenta}`),

  obtenerPorCodigo: (codigo: string) =>
    get<CuentaInstitucionalResponse>(`/cuentas-institucionales/codigo/${codigo}`),
};
