// ============================================================================
// Servicio de Catálogos — Corregido para usar endpoints reales del backend
// Los endpoints /catalogos/* no existen, se redirigen a controllers reales
// ============================================================================

import { get } from './apiClient';

// --- Tipos ---

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

// --- Servicio ---

export const CatalogoService = {
  /**
   * GET /api/v1/core/sucursales/activas
   * Listado de sucursales activas (redirigido desde /catalogos/sucursales)
   */
  obtenerSucursales: () =>
    get<SucursalResponse[]>('/sucursales/activas'),

  /**
   * Subtipos de cuenta — No existe endpoint en el backend actual.
   * Retorna datos de referencia hardcodeados hasta que se cree el endpoint.
   */
  obtenerSubtiposCuenta: (): Promise<SubtipoCuentaResponse[]> =>
    Promise.resolve([
      { subtipoCuentaId: 1, nombre: 'Ahorro Básico', tipoBase: 'AHORRO', montoAperturaMinimo: 20 },
      { subtipoCuentaId: 2, nombre: 'Ahorro Preferente', tipoBase: 'AHORRO', montoAperturaMinimo: 500, tasaInteres: 0.02 },
      { subtipoCuentaId: 3, nombre: 'Corriente', tipoBase: 'CORRIENTE', montoAperturaMinimo: 100 },
    ]),
};
