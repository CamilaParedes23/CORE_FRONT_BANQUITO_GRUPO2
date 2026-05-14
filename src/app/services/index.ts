// ============================================================================
// Barrel export — Servicios del Core BanQuito
// Importa todo desde: import { ClienteService, CuentaService, ... } from '../services'
// ============================================================================

// --- Services ---
export { ClienteService } from './clienteService';
export { CuentaService } from './cuentaService';
export { TransaccionService, generarUuidTransaccion, generarIdempotencyKey } from './transaccionService';
export { CatalogoService } from './catalogoService';
export { SucursalService } from './sucursalService';
export { UsuarioCoreService } from './usuarioCoreService';
export { FeriadoService } from './feriadoService';
export { ParametroService } from './parametroService';
export { AuditoriaService } from './auditoriaService';
export { CuentaInstitucionalService } from './cuentaInstitucionalService';
export { ApiError } from './apiClient';

// --- Tipos de Clientes ---
export type { ClienteRequest, ClienteResponse, ClienteEstadoRequest } from './clienteService';

// --- Tipos de Cuentas ---
export type { CuentaResponse, SaldoResponse, CambioEstadoData, BloqueoData, MovimientoResponse, CuentaAperturaData } from './cuentaService';

// --- Tipos de Transacciones ---
export type { TransferenciaRequest, TransferenciaResponse, MovimientoCuentaResponse, TransaccionData, TransaccionResponse } from './transaccionService';

// --- Tipos de Catálogos ---
export type { SucursalResponse, SubtipoCuentaResponse } from './catalogoService';

// --- Tipos de Sucursales ---
export type { SucursalRequest } from './sucursalService';
export type { SucursalResponse as SucursalDetailResponse } from './sucursalService';

// --- Tipos de Usuarios ---
export type { UsuarioCoreResponse, CredencialWebResponse } from './usuarioCoreService';

// --- Tipos de Feriados ---
export type { FeriadoResponse, DiaHabilResponse } from './feriadoService';

// --- Tipos de Parámetros ---
export type { ParametroCoreResponse } from './parametroService';

// --- Tipos de Auditoría ---
export type { AuditoriaEventoResponse } from './auditoriaService';

// --- Tipos de Cuentas Institucionales ---
export type { CuentaInstitucionalResponse } from './cuentaInstitucionalService';
