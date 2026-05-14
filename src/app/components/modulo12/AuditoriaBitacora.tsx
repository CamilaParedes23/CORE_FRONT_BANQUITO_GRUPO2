import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AuditoriaService } from '../../services/auditoriaService';
import type { AuditoriaEventoResponse } from '../../services/auditoriaService';

interface AuditoriaBitacoraProps {
  navigate: (screen: string) => void;
}

export default function AuditoriaBitacora({ navigate }: AuditoriaBitacoraProps) {
  const [filtros, setFiltros] = useState({ fechaDesde: '', fechaHasta: '', modulo: '', resultado: '' });
  const [eventos, setEventos] = useState<AuditoriaEventoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarEventos = async (moduloFiltro?: string) => {
    setLoading(true);
    setError(null);
    try {
      let data: AuditoriaEventoResponse[];
      if (moduloFiltro) {
        data = await AuditoriaService.consultarPorModulo(moduloFiltro);
      } else {
        data = await AuditoriaService.listar();
      }
      setEventos(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar eventos de auditoría');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const handleAplicarFiltros = () => {
    cargarEventos(filtros.modulo || undefined);
  };

  const eventosFiltrados = eventos.filter(e => {
    if (filtros.resultado && e.resultado !== filtros.resultado) return false;
    return true;
  });

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Bitácora de Auditoría</h1>
        <p className="text-gray-600">Registro de eventos del sistema</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-800">
          ⚠️ {error}
        </div>
      )}

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <Label>Fecha Desde</Label>
              <Input
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Fecha Hasta</Label>
              <Input
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Módulo</Label>
              <select
                value={filtros.modulo}
                onChange={(e) => setFiltros({ ...filtros, modulo: e.target.value })}
                className="w-full mt-2 px-3 py-2 border rounded-lg"
              >
                <option value="">Todos</option>
                <option value="CLIENTES">CLIENTES</option>
                <option value="CUENTAS">CUENTAS</option>
                <option value="TRANSACCIONES">TRANSACCIONES</option>
                <option value="USUARIOS">USUARIOS</option>
              </select>
            </div>
            <div>
              <Label>Resultado</Label>
              <select
                value={filtros.resultado}
                onChange={(e) => setFiltros({ ...filtros, resultado: e.target.value })}
                className="w-full mt-2 px-3 py-2 border rounded-lg"
              >
                <option value="">Todos</option>
                <option value="EXITOSO">EXITOSO</option>
                <option value="FALLIDO">FALLIDO</option>
                <option value="RECHAZADO">RECHAZADO</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAplicarFiltros}
                disabled={loading}
                className="w-full py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] disabled:opacity-50"
              >
                {loading ? 'Cargando...' : 'Aplicar Filtros'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#0D1B4B]">
            Eventos Registrados {!loading && `(${eventosFiltrados.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando eventos...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-3 font-medium text-gray-600">Fecha</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-600">Módulo</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-600">Acción</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-600">Entidad</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-600">ID Entidad</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-600">Resultado</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-600">Canal</th>
                  </tr>
                </thead>
                <tbody>
                  {eventosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-gray-500">
                        No se encontraron eventos de auditoría
                      </td>
                    </tr>
                  ) : (
                    eventosFiltrados.map((evento) => (
                      <tr key={evento.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-3">
                          {new Date(evento.fechaEvento).toLocaleString('es-EC')}
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="text-xs">{evento.modulo}</Badge>
                        </td>
                        <td className="py-3 px-3">{evento.accion}</td>
                        <td className="py-3 px-3">{evento.entidad}</td>
                        <td className="py-3 px-3 font-medium">{evento.entidadId}</td>
                        <td className="py-3 px-3">
                          <Badge className={evento.resultado === 'EXITOSO' ? 'bg-green-600' : 'bg-red-600'}>
                            {evento.resultado}
                          </Badge>
                        </td>
                        <td className="py-3 px-3">{evento.canalOrigen}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
