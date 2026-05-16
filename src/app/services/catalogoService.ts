import { get } from './apiClient';

export interface SucursalResponse {
  id: number;
  codigoSucursal: string;
  nombre: string;
  ciudad: string;
  direccion?: string;
  estado: string;
}

export interface SubtipoCuentaResponse {
  subtipoCuentaId: number;
  nombre: string;
  tipoBase: 'AHORRO' | 'CORRIENTE';
  montoAperturaMinimo: number;
  tasaInteres?: number;
  descripcion?: string;
}

export const CatalogoService = {
  obtenerSucursales: () =>
    get<SucursalResponse[]>('/sucursales/activas'),

  obtenerSubtiposCuenta: (): Promise<SubtipoCuentaResponse[]> =>
    Promise.resolve([
      { subtipoCuentaId: 1, nombre: 'Ahorro Básico', tipoBase: 'AHORRO', montoAperturaMinimo: 20 },
      { subtipoCuentaId: 2, nombre: 'Ahorro Preferente', tipoBase: 'AHORRO', montoAperturaMinimo: 500, tasaInteres: 0.02 },
      { subtipoCuentaId: 3, nombre: 'Corriente', tipoBase: 'CORRIENTE', montoAperturaMinimo: 100 },
    ]),
};
