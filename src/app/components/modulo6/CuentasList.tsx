import { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { CuentaService } from '../../services/cuentaService';
import type { CuentaResponse } from '../../services/cuentaService';

interface CuentasListProps {
  navigate: (screen: string, id?: string) => void;
}

const estadoColor: Record<string, string> = {
  ACTIVA: 'bg-green-600',
  INACTIVA: 'bg-orange-500',
  BLOQUEADA: 'bg-red-600',
  SUSPENDIDA: 'bg-yellow-600',
};

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

export default function CuentasList({ navigate }: CuentasListProps) {
  const [cuentas, setCuentas] = useState<CuentaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);

  useEffect(() => {
    CuentaService.listar()
      .then(setCuentas)
      .catch(err => setError(err.message || 'Error al cargar cuentas'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setPagina(1); }, [filtroEstado, busqueda, porPagina]);

  const cuentasFiltradas = cuentas.filter(c => {
    if (filtroEstado && String(c.estado) !== filtroEstado) return false;
    if (busqueda.trim() && !c.numeroCuenta.includes(busqueda.trim())) return false;
    return true;
  });

  const totalPaginas = Math.max(1, Math.ceil(cuentasFiltradas.length / porPagina));
  const inicio = (pagina - 1) * porPagina;
  const fin = Math.min(inicio + porPagina, cuentasFiltradas.length);
  const cuentasPagina = cuentasFiltradas.slice(inicio, fin);

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Cuentas</h1>
        <p className="text-gray-600">Gestión de cuentas bancarias</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-800">
          ⚠️ {error}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar por Número</label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ej: 0010000000001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1B4B]/40"
            />
          </div>
          <div className="min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Todos</option>
              <option value="ACTIVA">ACTIVA</option>
              <option value="INACTIVA">INACTIVA</option>
              <option value="BLOQUEADA">BLOQUEADA</option>
              <option value="SUSPENDIDA">SUSPENDIDA</option>
            </select>
          </div>
          <button
            onClick={() => navigate('cuenta-nueva')}
            className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] text-sm font-medium transition-colors"
          >
            + Nueva Cuenta
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Número de Cuenta</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Saldo Contable</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Saldo Disponible</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">Cargando cuentas...</td>
                </tr>
              ) : cuentasPagina.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">No se encontraron cuentas</td>
                </tr>
              ) : (
                cuentasPagina.map((cuenta) => (
                  <tr
                    key={cuenta.numeroCuenta}
                    onClick={() => navigate('cuenta-ficha', cuenta.numeroCuenta)}
                    className="hover:bg-[#0D1B4B]/5 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-mono font-medium text-gray-800">
                      {cuenta.numeroCuenta}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Badge className={estadoColor[String(cuenta.estado)] || 'bg-gray-400'}>
                        {String(cuenta.estado)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-800 text-right">
                      ${Number(cuenta.saldoContable).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-green-700 text-right">
                      ${Number(cuenta.saldoDisponible).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className="text-[#0D1B4B] hover:underline font-medium">Ver detalle</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {!loading && cuentasFiltradas.length > 0 && (
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
              {inicio + 1}–{fin} de {cuentasFiltradas.length} registros
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
