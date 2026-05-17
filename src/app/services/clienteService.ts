import { get, post, put, patch } from './apiClient';
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

export interface ClienteResponse {
  id: number;
  subtipoClienteId: number;
  tipoCliente: 'NATURAL' | 'JURIDICO';
  tipoIdentificacion: string;
  identificacion: string;
  nombres?: string;
  apellidos?: string;
  razonSocial?: string;
  nombreVisual?: string;
  fechaNacimiento?: string;
  fechaConstitucion?: string;
  representanteLegalId?: number;
  email: string;
  telefonoMovil: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  estado: string;
  activoPagosMasivos: boolean;
}

export interface ClienteEstadoRequest {
  estado: string;
}

export type ClienteNatural = ClienteRequest;
export type ClienteJuridico = ClienteRequest;

export function getNombreCompleto(cliente: ClienteResponse): string {
  if (cliente.nombreVisual) {
    return cliente.nombreVisual;
  }
  if (cliente.tipoCliente === 'NATURAL') {
    return `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim();
  }
  return cliente.razonSocial || '';
}
export type ClienteUpdateData = Partial<ClienteRequest>;

export const ClienteService = {
  listar: () =>
    get<ClienteResponse[]>('/clientes'),

  obtenerPorId: (id: number) =>
    get<ClienteResponse>(`/clientes/${id}`),

  obtenerPorIdentificacion: (identificacion: string) =>
    get<ClienteResponse>(`/clientes/identificacion/${identificacion}`),

  crear: (data: ClienteRequest) =>
    post<ClienteResponse>('/clientes', data),

  cambiarEstado: (id: number, estado: string) =>
    patch<ClienteResponse>(`/clientes/${id}/estado`, { estado }),

  actualizar: (id: number, data: Partial<ClienteRequest>) =>
    put<ClienteResponse>(`/clientes/${id}`, data),

  validarEmpresaPagosMasivos: (ruc: string) =>
    get<{ ruc: string; esValida: boolean; mensaje: string; motivo?: string }>(
      `/clientes/ruc/${ruc}/validacion-pagos-masivos`
    ),
};
