import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CuentaService } from '../services/cuentaService';
import { ClienteService } from '../services/clienteService';
import type { CuentaResponse, MovimientoResponse } from '../services/cuentaService';
import type { ClienteResponse } from '../services/clienteService';
import { CatalogoService } from '../services/catalogoService';
import { ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface DashboardEmpresaProps {
  navigate: (screen: string, id?: string) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

export default function DashboardEmpresa({ navigate }: DashboardEmpresaProps) {
  const { user } = useAuth();

  const [cliente, setCliente] = useState<ClienteResponse | null>(null);
  const [cuentas, setCuentas] = useState<CuentaResponse[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoResponse[]>([]);
  const [tiposCuenta, setTiposCuenta] = useState<Record<number, string>>({});
  const [loadingCliente, setLoadingCliente] = useState(true);
  const [loadingCuentas, setLoadingCuentas] = useState(true);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
  const [errorCliente, setErrorCliente] = useState<string | null>(null);
  const [errorCuentas, setErrorCuentas] = useState<string | null>(null);
  const [errorMovimientos, setErrorMovimientos] = useState<string | null>(null);

  const [paginaCuentas, setPaginaCuentas] = useState(1);
  const [paginaMovimientos, setPaginaMovimientos] = useState(1);
  const [busquedaCuentas, setBusquedaCuentas] = useState('');
  const [errorBusquedaCuentas, setErrorBusquedaCuentas] = useState<string | null>(null);
  const elementosPorPaginaCuentas = 5;
  const elementosPorPaginaMovimientos = 10;

  useEffect(() => {
    if (!user?.clienteId && !user?.identificacion) {
      setLoadingCliente(false);
      setErrorCliente('No se encontró información del cliente');
      return;
    }

    const fetchCliente = async () => {
      try {
        let clienteData: ClienteResponse | null = null;

        if (user.clienteId) {
          clienteData = await ClienteService.obtenerPorId(user.clienteId);
        } else if (user.identificacion) {
          clienteData = await ClienteService.obtenerPorIdentificacion(user.identificacion);
        }

        setCliente(clienteData);
      } catch (err: unknown) {
        setErrorCliente(err instanceof Error ? err.message : 'Error al cargar información del cliente');
      } finally {
        setLoadingCliente(false);
      }
    };

    fetchCliente();
  }, [user]);

  useEffect(() => {
    CatalogoService.obtenerSubtiposCuenta().then((subtipos) =>
      setTiposCuenta(
        Object.fromEntries(subtipos.map((s) => [s.subtipoCuentaId, s.nombre]))
      )
    );
  }, []);

  useEffect(() => {
    if (!cliente) {
      setLoadingCuentas(false);
      return;
    }
    CuentaService.listar()
      .then((todasLasCuentas) => {
        const cuentasFiltradas = todasLasCuentas.filter(
          (cuenta) => cuenta.clienteId === cliente.id
        );
        setCuentas(cuentasFiltradas);
      })
      .catch((err: unknown) => {
        setErrorCuentas(err instanceof Error ? err.message : 'Error al cargar cuentas');
      })
      .finally(() => setLoadingCuentas(false));
  }, [cliente]);

  useEffect(() => {
    if (cuentas.length === 0) {
      return;
    }

    setLoadingMovimientos(true);
    setErrorMovimientos(null);
    Promise.all(cuentas.map((c) => CuentaService.obtenerMovimientos(c.numeroCuenta)))
      .then((resultados) => {
        const movimientosOrdenados = resultados
          .flat()
          .sort(
            (a, b) =>
              new Date(b.fechaTransaccion).getTime() -
              new Date(a.fechaTransaccion).getTime()
          );
        setMovimientos(movimientosOrdenados);
      })
      .catch((err: unknown) => {
        setErrorMovimientos(err instanceof Error ? err.message : 'Error al cargar movimientos');
      })
      .finally(() => setLoadingMovimientos(false));
  }, [cuentas]);

  useEffect(() => {
    setPaginaCuentas(1);
    setPaginaMovimientos(1);
  }, [cuentas, movimientos]);

  useEffect(() => {
    setPaginaCuentas(1);
    setErrorBusquedaCuentas(null);
  }, [busquedaCuentas]);

  const cuentasFiltradas = cuentas.filter((cuenta) =>
    cuenta.numeroCuenta.toLowerCase().includes(busquedaCuentas.toLowerCase())
  );

  const totalPaginasCuentas = Math.ceil(cuentasFiltradas.length / elementosPorPaginaCuentas);
  const totalPaginasMovimientos = Math.ceil(movimientos.length / elementosPorPaginaMovimientos);

  const cuentasPaginadas = cuentasFiltradas.slice(
    (paginaCuentas - 1) * elementosPorPaginaCuentas,
    paginaCuentas * elementosPorPaginaCuentas
  );

  const movimientosPaginados = movimientos.slice(
    (paginaMovimientos - 1) * elementosPorPaginaMovimientos,
    paginaMovimientos * elementosPorPaginaMovimientos
  );

  return (
    <div className="p-8 bg-slate-50 min-h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Bienvenido, {user?.nombreCompleto}
        </h1>
        <p className="text-sm text-slate-500 mt-1">Banca Web Corporativa — Core Bancario</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Mis Cuentas Corporativas
          </h2>

          {!loadingCliente && !loadingCuentas && !errorCliente && !errorCuentas && (
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por número de cuenta..."
                  value={busquedaCuentas}
                  onChange={(e) => setBusquedaCuentas(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1B4B] focus:border-transparent"
                />
              </div>
            </div>
          )}

          {loadingCliente && (
            <p className="text-sm text-slate-400 animate-pulse">Cargando información del cliente...</p>
          )}
          {errorCliente && (
            <p className="text-sm text-red-500">{errorCliente}</p>
          )}
          {loadingCuentas && (
            <p className="text-sm text-slate-400 animate-pulse">Cargando cuentas...</p>
          )}
          {errorCuentas && (
            <p className="text-sm text-red-500">{errorCuentas}</p>
          )}
          {!loadingCliente && !loadingCuentas && !errorCliente && !errorCuentas && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left py-3 px-5 font-medium text-slate-500">
                      Número de Cuenta
                    </th>
                    <th className="text-left py-3 px-5 font-medium text-slate-500">
                      Tipo de Cuenta
                    </th>
                    <th className="text-left py-3 px-5 font-medium text-slate-500">
                      Estado
                    </th>
                    <th className="text-right py-3 px-5 font-medium text-slate-500">
                      Saldo Disponible
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cuentasPaginadas.map((cuenta) => (
                    <tr key={cuenta.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-5 font-mono text-slate-800">
                        {cuenta.numeroCuenta}
                      </td>
                      <td className="py-3.5 px-5 text-slate-600">
                        {tiposCuenta[cuenta.subtipoCuentaId] ??
                          `Subtipo ${cuenta.subtipoCuentaId}`}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          {cuenta.estado}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-semibold text-slate-900">
                        {formatCurrency(cuenta.saldoDisponible)}
                      </td>
                    </tr>
                  ))}
                  {cuentasFiltradas.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-slate-500"
                      >
                        {busquedaCuentas ? 'La cuenta buscada no pertenece a esta empresa o no existe en el sistema' : 'No se encontraron cuentas para esta empresa'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {cuentasFiltradas.length > elementosPorPaginaCuentas && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Página {paginaCuentas} de {totalPaginasCuentas}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPaginaCuentas(paginaCuentas - 1)}
                      disabled={paginaCuentas === 1}
                      className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => setPaginaCuentas(paginaCuentas + 1)}
                      disabled={paginaCuentas === totalPaginasCuentas}
                      className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Últimos Movimientos del Core
          </h2>

          {loadingMovimientos && (
            <p className="text-sm text-slate-400 animate-pulse">Cargando movimientos...</p>
          )}
          {errorMovimientos && (
            <p className="text-sm text-red-500">{errorMovimientos}</p>
          )}
          {!loadingMovimientos && !errorMovimientos && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left py-3 px-5 font-medium text-slate-500">Fecha</th>
                    <th className="text-left py-3 px-5 font-medium text-slate-500">
                      Descripción
                    </th>
                    <th className="text-left py-3 px-5 font-medium text-slate-500">Tipo</th>
                    <th className="text-right py-3 px-5 font-medium text-slate-500">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {movimientosPaginados.map((mov) => {
                    const esIngreso = mov.tipoMovimiento === 'CREDITO';
                    return (
                      <tr key={mov.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">
                          {formatDate(mov.fechaTransaccion)}
                        </td>
                        <td className="py-3.5 px-5 text-slate-700 max-w-xs truncate">
                          {mov.descripcion}
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold ${
                              esIngreso ? 'text-emerald-600' : 'text-red-500'
                            }`}
                          >
                            {esIngreso ? (
                              <ArrowDownRight className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            )}
                            {esIngreso ? 'INGRESO' : 'EGRESO'}
                          </span>
                        </td>
                        <td
                          className={`py-3.5 px-5 text-right font-semibold ${
                            esIngreso ? 'text-emerald-600' : 'text-red-500'
                          }`}
                        >
                          {esIngreso ? '+' : '−'}
                          {formatCurrency(mov.monto)}
                        </td>
                      </tr>
                    );
                  })}
                  {movimientos.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-slate-500"
                      >
                        No hay movimientos recientes
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {movimientos.length > elementosPorPaginaMovimientos && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Página {paginaMovimientos} de {totalPaginasMovimientos}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPaginaMovimientos(paginaMovimientos - 1)}
                      disabled={paginaMovimientos === 1}
                      className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => setPaginaMovimientos(paginaMovimientos + 1)}
                      disabled={paginaMovimientos === totalPaginasMovimientos}
                      className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
