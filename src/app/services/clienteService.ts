// ============================================================================
// Servicio de Clientes — Alineado con ClienteController del backend
// Backend: /api/v1/core/clientes
// ============================================================================

import { get, post, patch } from './apiClient';

// --- Tipos alineados con los DTOs del backend ---

/**
 * Request para crear un cliente.
 * Coincide con: com.banquito.core.customers.dto.api.ClienteRequest
 */
export interface ClienteRequest {
  subtipoClienteId: number;
  tipoCliente: 'NATURAL' | 'JURIDICO';
  tipoIdentificacion: 'CEDULA' | 'PASAPORTE' | 'RUC';
  identificacion: string;
  nombres?: string;
  apellidos?: string;
  razonSocial?: string;
  fechaNacimiento?: string;
  fechaConstitucion?: string;
  representanteLegalId?: number;
  email: string;
  telefonoMovil: string;
  direccion: string;
  latitud?: number;
  longitud?: number;
  activoPagosMasivos?: boolean;
}

/**
 * Response de un cliente.
 * Coincide con: com.banquito.core.customers.dto.api.ClienteResponse
 */
export interface ClienteResponse {
  id: number;
  subtipoClienteId: number;
  tipoCliente: 'NATURAL' | 'JURIDICO';
  tipoIdentificacion: string;
  identificacion: string;
  nombreVisual: string;
  email: string;
  telefonoMovil: string;
  estado: string;
  activoPagosMasivos: boolean;
}

/**
 * Request para cambiar estado de un cliente.
 * Coincide con: com.banquito.core.customers.dto.api.ClienteEstadoRequest
 */
export interface ClienteEstadoRequest {
  estado: string;
}

// --- Tipos legacy (para compatibilidad con componentes existentes) ---

export type ClienteNatural = ClienteRequest;
export type ClienteJuridico = ClienteRequest;
export type ClienteUpdateData = Partial<ClienteRequest>;

// --- Servicio ---

export const ClienteService = {
  /**
   * GET /api/v1/core/clientes
   * Listar todos los clientes
   */
  listar: () =>
    get<ClienteResponse[]>('/clientes'),

  /**
   * GET /api/v1/core/clientes/{id}
   * Obtener cliente por ID numérico
   */
  obtenerPorId: (id: number) =>
    get<ClienteResponse>(`/clientes/${id}`),

  /**
   * GET /api/v1/core/clientes/identificacion/{identificacion}
   * Consulta de datos del cliente por número de identificación
   */
  obtenerPorIdentificacion: (identificacion: string) =>
    get<ClienteResponse>(`/clientes/identificacion/${identificacion}`),

  /**
   * POST /api/v1/core/clientes
   * Creación de cliente (Natural o Jurídico)
   */
  crear: (data: ClienteRequest) =>
    post<ClienteResponse>('/clientes', data),

  /**
   * PATCH /api/v1/core/clientes/{id}/estado
   * Cambio de estado del cliente
   */
  cambiarEstado: (id: number, estado: string) =>
    patch<ClienteResponse>(`/clientes/${id}/estado`, { estado }),

  /**
   * GET /api/v1/core/clientes/ruc/{ruc}/validacion-pagos-masivos
   * Validar empresa para pagos masivos
   */
  validarEmpresaPagosMasivos: (ruc: string) =>
    get<{ ruc: string; esValida: boolean; mensaje: string; motivo?: string }>(
      `/clientes/ruc/${ruc}/validacion-pagos-masivos`
    ),
};
