import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface HistorialMovimientosProps {
  navigate: (screen: string, data?: any) => void;
  cuentaNumero: string | null;
}

export default function HistorialMovimientos({ navigate, cuentaNumero }: HistorialMovimientosProps) {
  const [filtros, setFiltros] = useState({
    fechaDesde: '2026-01-01',
    fechaHasta: '2026-05-01',
    subtipo: '',
    estado: '',
  });

  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);

  const movimientos = [
    {
      fecha: '2026-04-30 14:25',
      uuid: 'TXN-001-2026',
      subtipo: 'Depósito',
      tipo: 'CREDITO',
      monto: '$500.00',
      saldoDespues: '$5,740.50',
      estado: 'EXITOSA',
    },
    {
      fecha: '2026-04-28 10:15',
      uuid: 'TXN-002-2026',
      subtipo: 'Retiro',
      tipo: 'DEBITO',
      monto: '$250.00',
      saldoDespues: '$5,240.50',
      estado: 'EXITOSA',
    },
    {
      fecha: '2026-04-25 16:40',
      uuid: 'TXN-003-2026',
      subtipo: 'Transferencia',
      tipo: 'DEBITO',
      monto: '$1,000.00',
      saldoDespues: '$5,490.50',
      estado: 'EXITOSA',
    },
    {
      fecha: '2026-04-20 09:30',
      uuid: 'TXN-004-2026',
      subtipo: 'Nómina',
      tipo: 'CREDITO',
      monto: '$2,500.00',
      saldoDespues: '$6,490.50',
      estado: 'EXITOSA',
    },
    {
      fecha: '2026-04-15 11:20',
      uuid: 'TXN-005-2026',
      subtipo: 'Retiro',
      tipo: 'DEBITO',
      monto: '$5,000.00',
      saldoDespues: '$3,990.50',
      estado: 'RECHAZADA',
    },
    {
      fecha: '2026-04-10 15:45',
      uuid: 'TXN-006-2026',
      subtipo: 'Depósito',
      tipo: 'CREDITO',
      monto: '$750.00',
      saldoDespues: '$3,990.50',
      estado: 'EXITOSA',
    },
    {
      fecha: '2026-04-05 13:10',
      uuid: 'TXN-007-2026',
      subtipo: 'Proveedores',
      tipo: 'DEBITO',
      monto: '$320.00',
      saldoDespues: '$3,240.50',
      estado: 'EXITOSA',
    },
    {
      fecha: '2026-03-30 10:00',
      uuid: 'TXN-008-2026',
      subtipo: 'Depósito',
      tipo: 'CREDITO',
      monto: '$1,200.00',
      saldoDespues: '$3,560.50',
      estado: 'EXITOSA',
    },
  ];

  const totalPaginas = Math.ceil(movimientos.length / registrosPorPagina);
  const movimientosPaginados = movimientos.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1F3864] mb-2">Historial de Movimientos</h1>
        <p className="text-gray-600">Cuenta: {cuentaNumero || '1001234567'}</p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-[#1F3864]">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="fechaDesde">Fecha Desde</Label>
              <Input
                id="fechaDesde"
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="fechaHasta">Fecha Hasta</Label>
              <Input
                id="fechaHasta"
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="subtipo">Subtipo de Transacción</Label>
              <select
                id="subtipo"
                value={filtros.subtipo}
                onChange={(e) => setFiltros({ ...filtros, subtipo: e.target.value })}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E75B6]"
              >
                <option value="">Todos</option>
                <option value="deposito">Depósito</option>
                <option value="retiro">Retiro</option>
                <option value="transferencia">Transferencia</option>
                <option value="nomina">Nómina</option>
                <option value="proveedores">Proveedores</option>
              </select>
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <select
                id="estado"
                value={filtros.estado}
                onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E75B6]"
              >
                <option value="">Todos</option>
                <option value="exitosas">Exitosas</option>
                <option value="rechazadas">Rechazadas</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button className="px-6 py-2 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors">
              Aplicar Filtros
            </button>
            <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
              Exportar CSV
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Resultados */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#1F3864]">Resultados</CardTitle>
            <p className="text-sm text-gray-600">{movimientos.length} movimientos encontrados</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">UUID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Subtipo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tipo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Monto</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Saldo Después</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody>
                {movimientosPaginados.map((mov) => (
                  <tr
                    key={mov.uuid}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate('detalle-transaccion', { transaccionUuid: mov.uuid })}
                  >
                    <td className="py-3 px-4 text-sm">{mov.fecha}</td>
                    <td className="py-3 px-4 text-sm font-medium">{mov.uuid}</td>
                    <td className="py-3 px-4 text-sm">{mov.subtipo}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={mov.tipo === 'DEBITO' ? 'text-red-600' : 'text-green-600'}>
                        {mov.tipo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">{mov.monto}</td>
                    <td className="py-3 px-4 text-sm">{mov.saldoDespues}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant={mov.estado === 'EXITOSA' ? 'default' : 'destructive'}>
                        {mov.estado}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Registros por página:</Label>
              <select
                value={registrosPorPagina}
                onChange={(e) => {
                  setRegistrosPorPagina(Number(e.target.value));
                  setPaginaActual(1);
                }}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E75B6]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                disabled={paginaActual === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
                disabled={paginaActual === totalPaginas}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Servicios REST */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600 font-medium">Servicio REST:</p>
        <ul className="text-xs text-red-600 mt-2 space-y-1">
          <li>GET /api/v1/cuentas/&#123;numero&#125;/movimientos</li>
        </ul>
      </div>
    </div>
  );
}
