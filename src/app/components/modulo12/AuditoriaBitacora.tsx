import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AuditoriaService } from '../../services/auditoriaService';
import type { AuditoriaEventoResponse } from '../../services/auditoriaService';
import { UsuarioCoreService } from '../../services/usuarioCoreService';

const ITEMS_POR_PAGINA = 15;

const MODULO_MAPPING: Record<string, string[]> = {
  CLIENTES:      ['CLIENTE'],
  CUENTAS:       ['CUENTA'],
  TRANSACCIONES: ['TRANSACCION_CUENTA'],
  USUARIOS:      ['USUARIO_CORE', 'CREDENCIAL_WEB'],
  SEED:          ['SUCURSAL'],
};

interface AuditoriaBitacoraProps {
  navigate: (screen: string) => void;
}

export default function AuditoriaBitacora({ navigate }: AuditoriaBitacoraProps) {
  const [filtros, setFiltros] = useState({ fechaDesde: '', fechaHasta: '', modulo: '', resultado: '' });
  const [eventos, setEventos] = useState<AuditoriaEventoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [rolPorId, setRolPorId] = useState<Record<string, string>>({});

  const cargarEventos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuditoriaService.listar();
      const eventosOrdenados = [...data].sort(
        (a, b) => new Date(b.fechaEvento).getTime() - new Date(a.fechaEvento).getTime()
      );
      setEventos(eventosOrdenados);
    } catch (err: any) {
      setError(err.message || 'Error al cargar eventos de auditoría');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  useEffect(() => {
    if (filtros.modulo !== 'USUARIOS') return;
    UsuarioCoreService.listar()
      .then(usuarios => {
        const mapa: Record<string, string> = {};
        usuarios.forEach(u => { mapa[String(u.id)] = u.rol; });
        setRolPorId(mapa);
      })
      .catch(() => {});
  }, [filtros.modulo]);

  const handleAplicarFiltros = () => {
    setPaginaActual(1);
  };

  const eventosFiltrados = useMemo(() => {
    return eventos.filter(e => {
      if (filtros.resultado && e.resultado !== filtros.resultado) return false;
      if (filtros.modulo) {
        const entidadesPermitidas = MODULO_MAPPING[filtros.modulo];
        if (entidadesPermitidas && !entidadesPermitidas.includes(e.entidad)) return false;
      }
      return true;
    });
  }, [eventos, filtros.resultado, filtros.modulo]);

  const totalPaginas = Math.max(1, Math.ceil(eventosFiltrados.length / ITEMS_POR_PAGINA));
  const eventosPagina = eventosFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  const paginasVisibles = () => {
    const rango: number[] = [];
    const inicio = Math.max(1, paginaActual - 2);
    const fin = Math.min(totalPaginas, paginaActual + 2);
    for (let i = inicio; i <= fin; i++) rango.push(i);
    return rango;
  };

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
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#0D1B4B]">
              Eventos Registrados {!loading && `(${eventosFiltrados.length})`}
            </CardTitle>
            {!loading && eventosFiltrados.length > 0 && (
              <span className="text-sm text-gray-500">
                Página {paginaActual} de {totalPaginas}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando eventos...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-3 font-medium text-gray-600">
                      Fecha <span className="text-[#0D1B4B] ml-1">&#9660;</span>
                    </th>
                    <th className="text-left py-3 px-3 font-medium text-gray-600">Acción</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-600">Entidad</th>
                    {filtros.modulo === 'USUARIOS' && (
                      <th className="text-left py-3 px-3 font-medium text-[#0D1B4B]">Usuario</th>
                    )}
                    <th className="text-left py-3 px-3 font-medium text-gray-600">Resultado</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-600">Canal</th>
                  </tr>
                </thead>
                <tbody>
                  {eventosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={filtros.modulo === 'USUARIOS' ? 6 : 5} className="text-center py-6 text-gray-500">
                        No se encontraron eventos de auditoría
                      </td>
                    </tr>
                  ) : (
                    eventosPagina.map((evento) => (
                      <tr key={evento.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-3">
                          {new Date(evento.fechaEvento).toLocaleString('es-EC')}
                        </td>
                        <td className="py-3 px-3">{evento.accion}</td>
                        <td className="py-3 px-3">{evento.entidad}</td>
                        {filtros.modulo === 'USUARIOS' && (
                          <td className="py-3 px-3">
                            {rolPorId[String(evento.entidadId)]
                              ? <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#0D1B4B]/10 text-[#0D1B4B]">{rolPorId[String(evento.entidadId)]}</span>
                              : <span className="text-gray-400 text-xs">—</span>
                            }
                          </td>
                        )}
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

          {/* Controles de paginación */}
          {!loading && totalPaginas > 1 && (
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
              <span className="text-sm text-gray-500">
                Mostrando {(paginaActual - 1) * ITEMS_POR_PAGINA + 1}–{Math.min(paginaActual * ITEMS_POR_PAGINA, eventosFiltrados.length)} de {eventosFiltrados.length} eventos
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPaginaActual(1)}
                  disabled={paginaActual === 1}
                  className="px-2 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  «
                </button>
                <button
                  onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                  className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ‹ Anterior
                </button>
                {paginasVisibles().map(num => (
                  <button
                    key={num}
                    onClick={() => setPaginaActual(num)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      num === paginaActual
                        ? 'bg-[#0D1B4B] text-white border-[#0D1B4B]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                  disabled={paginaActual === totalPaginas}
                  className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Siguiente ›
                </button>
                <button
                  onClick={() => setPaginaActual(totalPaginas)}
                  disabled={paginaActual === totalPaginas}
                  className="px-2 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
