// ============================================================================
// Servicio de Auditoría — Alineado con AuditoriaController del backend
// Backend: /api/v1/core/auditoria
// ============================================================================

import { get } from './apiClient';

// --- Tipos alineados con los DTOs del backend ---

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

// --- Servicio ---

export const AuditoriaService = {
  /**
   * GET /api/v1/core/auditoria
   * Listar todos los eventos de auditoría
   */
  listar: () =>
    get<AuditoriaEventoResponse[]>('/auditoria'),

  /**
   * GET /api/v1/core/auditoria/entidad/{entidad}/{entidadId}
   * Filtrar eventos por entidad
   */
  consultarPorEntidad: (entidad: string, entidadId: string) =>
    get<AuditoriaEventoResponse[]>(`/auditoria/entidad/${entidad}/${entidadId}`),

  /**
   * GET /api/v1/core/auditoria/modulo/{modulo}
   * Filtrar eventos por módulo
   */
  consultarPorModulo: (modulo: string) =>
    get<AuditoriaEventoResponse[]>(`/auditoria/modulo/${modulo}`),
};
