import { get, post } from './apiClient';

export interface UsuarioCoreResponse {
  id: number;
  sucursalId: number;
  usuario: string;
  nombreCompleto: string;
  rol: 'CAJERO' | 'SUPERVISOR_AGENCIA' | 'ADMIN_CORE' | 'AUDITOR';
  estado: string;
  ultimoLogin: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CredencialWebResponse {
  id: number;
  username: string;
  estado: string;
}

export interface UsuarioCoreRequest {
  usuario: string;
  contrasena: string;
  nombreCompleto: string;
  rol: string;
  sucursalId?: number | null;
}

export const UsuarioCoreService = {
  listar: () =>
    get<UsuarioCoreResponse[]>('/usuarios-core'),

  obtenerPorId: (id: number) =>
    get<UsuarioCoreResponse>(`/usuarios-core/${id}`),

  obtenerPorUsername: (username: string) =>
    get<UsuarioCoreResponse>(`/usuarios-core/username/${username}`),

  crear: (data: UsuarioCoreRequest) =>
    post<UsuarioCoreResponse>('/usuarios-core', data),

  validar: (username: string, rol: string, estado: string) =>
    get<boolean>(`/usuarios-core/username/${username}/validacion`, { rol, estado }),

  obtenerCredencialWeb: (username: string) =>
    get<CredencialWebResponse>(`/credenciales-web/${username}`),

  validarCredencialWeb: (username: string, estado: string) =>
    get<boolean>(`/credenciales-web/${username}/validacion`, { estado }),
};
