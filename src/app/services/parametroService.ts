import { get, post, put } from './apiClient';

export interface ParametroCoreResponse {
  codigo: string;
  nombre: string;
  valorTexto: string;
  tipoDato: 'NUMERICO' | 'HORA' | 'BOOLEANO' | 'CADENA' | 'FECHA';
  descripcion: string;
}

export interface ParametroCoreRequest {
  codigo: string;
  nombre: string;
  valor: string;
  tipoDato: 'NUMERICO' | 'HORA' | 'BOOLEANO' | 'CADENA' | 'FECHA';
  descripcion: string;
}

export const ParametroService = {
  listar: () =>
    get<ParametroCoreResponse[]>('/parametros'),

  listarActivos: () =>
    get<ParametroCoreResponse[]>('/parametros/activos'),

  obtenerPorCodigo: (codigo: string) =>
    get<ParametroCoreResponse>(`/parametros/${codigo}`),

  crear: (data: ParametroCoreRequest) =>
    post<ParametroCoreResponse>('/parametros', data),

  actualizar: (codigo: string, data: ParametroCoreRequest) =>
    put<ParametroCoreResponse>(`/parametros/${codigo}`, data),
};
