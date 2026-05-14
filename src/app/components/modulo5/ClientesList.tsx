import { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { ClienteService } from '../../services/clienteService';
import type { ClienteResponse } from '../../services/clienteService';

interface ClientesListProps {
  navigate: (screen: string, id?: string) => void;
}

const estadoColor: Record<string, string> = {
  ACTIVO: 'bg-green-600',
  INACTIVO: 'bg-orange-500',
  SUSPENDIDO: 'bg-red-600',
};

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

export default function ClientesList({ navigate }: ClientesListProps) {
  const [filters, setFilters] = useState({ tipo: '', estado: '', pagosMasivos: '', busqueda: '' });
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);

  useEffect(() => {
    ClienteService.listar()
      .then(setClientes)
      .catch(err => setError(err.message || 'Error al cargar clientes'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setPagina(1); }, [filters, porPagina]);

  const clientesFiltrados = clientes.filter(c => {
    if (filters.tipo && c.tipoCliente !== filters.tipo) return false;
    if (filters.estado && c.estado !== filters.estado) return false;
    if (filters.pagosMasivos === 'SI' && !c.activoPagosMasivos) return false;
    if (filters.pagosMasivos === 'NO' && c.activoPagosMasivos) return false;
    if (filters.busqueda) {
      const q = filters.busqueda.toLowerCase();
      return c.identificacion.includes(q) || c.nombreVisual.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPaginas = Math.max(1, Math.ceil(clientesFiltrados.length / porPagina));
  const inicio = (pagina - 1) * porPagina;
  const fin = Math.min(inicio + porPagina, clientesFiltrados.length);
  const clientesPagina = clientesFiltrados.slice(inicio, fin);

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Clientes</h1>
        <p className="text-gray-600">Gestión de clientes del banco</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-800">
          ⚠️ {error}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Búsqueda</label>
            <input
              type="text"
              value={filters.busqueda}
              onChange={(e) => setFilters({ ...filters, busqueda: e.target.value })}
              placeholder="Identificación o nombre..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1B4B]/40"
            />
          </div>
          <div className="min-w-[130px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filters.tipo}
              onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Todos</option>
              <option value="NATURAL">Natural</option>
              <option value="JURIDICO">Jurídico</option>
            </select>
          </div>
          <div className="min-w-[130px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={filters.estado}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Todos</option>
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
              <option value="SUSPENDIDO">SUSPENDIDO</option>
            </select>
          </div>
          <div className="min-w-[140px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pagos Masivos</label>
            <select
              value={filters.pagosMasivos}
              onChange={(e) => setFilters({ ...filters, pagosMasivos: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Todos</option>
              <option value="SI">Habilitado</option>
              <option value="NO">Deshabilitado</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigate('cliente-natural-nuevo')}
            className="px-5 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] text-sm font-medium transition-colors"
          >
            + Nuevo Cliente Natural
          </button>
          <button
            onClick={() => navigate('cliente-juridico-nuevo')}
            className="px-5 py-2 bg-[#C9A84C] text-[#0D1B4B] rounded-lg hover:bg-[#b89640] text-sm font-medium transition-colors"
          >
            + Nuevo Cliente Jurídico
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Identificación</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre / Razón Social</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pagos Masivos</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">Cargando clientes...</td>
                </tr>
              ) : clientesPagina.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">No se encontraron clientes</td>
                </tr>
              ) : (
                clientesPagina.map((cliente) => (
                  <tr
                    key={cliente.id}
                    onClick={() => navigate('cliente-ficha', String(cliente.id))}
                    className="hover:bg-[#0D1B4B]/5 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-mono font-medium text-gray-800">
                      {cliente.identificacion}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant="outline" className="text-xs">
                        {cliente.tipoCliente}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">{cliente.nombreVisual}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge className={estadoColor[String(cliente.estado)] || 'bg-gray-400'}>
                        {String(cliente.estado)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      {cliente.activoPagosMasivos
                        ? <span className="text-blue-600 font-medium">✓ Sí</span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className="text-[#0D1B4B] hover:underline font-medium">Ver ficha</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {!loading && clientesFiltrados.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Registros por página:</span>
              <select
                value={porPagina}
                onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}
                className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1B4B]/40"
              >
                {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <span className="text-sm text-gray-600">
              {inicio + 1}–{fin} de {clientesFiltrados.length} registros
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagina(p => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ‹
              </button>
              <span className="text-sm text-gray-700 min-w-[90px] text-center">
                Pág. {pagina} de {totalPaginas}
              </span>
              <button
                onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
