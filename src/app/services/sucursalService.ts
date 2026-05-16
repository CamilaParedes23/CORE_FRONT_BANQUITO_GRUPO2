import { get, post, put } from './apiClient';

export interface SucursalResponse {
  id: number;
  codigoSucursal: string;
  nombre: string;
  ciudad: string;
  direccion?: string;
  estado: string;
}

export interface SucursalRequest {
  codigoSucursal: string;
  nombre: string;
  ciudad: string;
  direccion?: string;
  estado?: string;
}

export const SucursalService = {
  listar: () =>
    get<SucursalResponse[]>('/sucursales'),

  listarActivas: () =>
    get<SucursalResponse[]>('/sucursales/activas'),

  obtenerPorId: (id: number) =>
    get<SucursalResponse>(`/sucursales/${id}`),

  obtenerPorCodigo: (codigo: string) =>
    get<SucursalResponse>(`/sucursales/codigo/${codigo}`),

  crear: (data: SucursalRequest) =>
    post<SucursalResponse>('/sucursales', data),

  actualizar: (id: number, data: SucursalRequest) =>
    put<SucursalResponse>(`/sucursales/${id}`, data),
};
