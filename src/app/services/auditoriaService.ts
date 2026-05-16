import { get } from './apiClient';

export interface AuditoriaEventoResponse {
  id: number;
  modulo: string;
  accion: string;
  entidad: string;
  entidadId: string;
  resultado: 'EXITOSO' | 'FALLIDO' | 'RECHAZADO';
  canalOrigen: string;
  fechaEvento: string;
}

export const AuditoriaService = {
  listar: () =>
    get<AuditoriaEventoResponse[]>('/auditoria'),

  consultarPorEntidad: (entidad: string, entidadId: string) =>
    get<AuditoriaEventoResponse[]>(`/auditoria/entidad/${entidad}/${entidadId}`),

  consultarPorModulo: (modulo: string) =>
    get<AuditoriaEventoResponse[]>(`/auditoria/modulo/${modulo}`),
};
