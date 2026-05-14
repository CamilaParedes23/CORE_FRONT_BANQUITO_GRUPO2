import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CuentaService } from '../../services/cuentaService';
import type { CuentaResponse } from '../../services/cuentaService';

interface CuentasListProps {
  navigate: (screen: string, id?: string) => void;
}

export default function CuentasList({ navigate }: CuentasListProps) {
  const [cuentas, setCuentas] = useState<CuentaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    CuentaService.listar()
      .then(setCuentas)
      .catch(err => setError(err.message || 'Error al cargar cuentas'))
      .finally(() => setLoading(false));
  }, []);

  const cuentasFiltradas = filtroEstado
    ? cuentas.filter(c => String(c.estado) === filtroEstado)
    : cuentas;

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

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-gray-700">Filtrar por Estado</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full mt-2 px-3 py-2 border rounded-lg"
              >
                <option value="">Todos</option>
                <option value="ACTIVA">ACTIVA</option>
                <option value="INACTIVA">INACTIVA</option>
                <option value="BLOQUEADA">BLOQUEADA</option>
                <option value="SUSPENDIDA">SUSPENDIDA</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#0D1B4B]">
              Listado de Cuentas {!loading && `(${cuentasFiltradas.length})`}
            </CardTitle>
            <button
              onClick={() => navigate('cuenta-nueva')}
              className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b]"
            >
              Nueva Cuenta
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando cuentas...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Número</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">ID Cliente</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Saldo Contable</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Saldo Disponible</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {cuentasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">
                        No se encontraron cuentas
                      </td>
                    </tr>
                  ) : (
                    cuentasFiltradas.map((cuenta) => (
                      <tr
                        key={cuenta.numeroCuenta}
                        onClick={() => navigate('cuenta-ficha', cuenta.numeroCuenta)}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="py-3 px-4 text-sm font-medium">{cuenta.numeroCuenta}</td>
                        <td className="py-3 px-4 text-sm">{cuenta.clienteId}</td>
                        <td className="py-3 px-4 text-sm font-medium">
                          ${Number(cuenta.saldoContable).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          ${Number(cuenta.saldoDisponible).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <Badge className={String(cuenta.estado) === 'ACTIVA' ? 'bg-green-600' : 'bg-orange-600'}>
                            {String(cuenta.estado)}
                          </Badge>
                        </td>
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
