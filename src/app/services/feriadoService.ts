import { get, post } from './apiClient';

export interface FeriadoResponse {
  fechaFeriado: string;
  nombre: string;
  esFinSemana: boolean;
  estado: string;
}

export interface FeriadoRequest {
  fecha: string;
  nombre: string;
  estado?: string;
}

export interface DiaHabilResponse {
  fechaConsulta: string;
  siguienteDiaHabil: string;
  diasCalculados: number;
  mensaje: string;
}

export const FeriadoService = {
  listar: () =>
    get<FeriadoResponse[]>('/feriados'),

  obtenerPorFecha: (fecha: string) =>
    get<FeriadoResponse>(`/feriados/${fecha}`),

  obtenerSiguienteDiaHabil: (fecha: string) =>
    get<DiaHabilResponse>('/feriados/siguiente-dia-habil', { fecha }),

  crear: (request: FeriadoRequest) =>
    post<FeriadoResponse>('/feriados', request),
};
