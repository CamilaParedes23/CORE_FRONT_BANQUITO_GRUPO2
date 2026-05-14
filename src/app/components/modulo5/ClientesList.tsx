import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ClienteService } from '../../services/clienteService';
import type { ClienteResponse } from '../../services/clienteService';

interface ClientesListProps {
  navigate: (screen: string, id?: string) => void;
}

export default function ClientesList({ navigate }: ClientesListProps) {
  const [filters, setFilters] = useState({ tipo: '', estado: '', pagosMasivos: '', busqueda: '' });
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ClienteService.listar()
      .then(setClientes)
      .catch(err => setError(err.message || 'Error al cargar clientes'))
      .finally(() => setLoading(false));
  }, []);

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

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-5 gap-4 mb-4">
            <div>
              <Label>Tipo</Label>
              <select
                value={filters.tipo}
                onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                className="w-full mt-2 px-3 py-2 border rounded-lg"
              >
                <option value="">Todos</option>
                <option value="NATURAL">Natural</option>
                <option value="JURIDICO">Jurídico</option>
              </select>
            </div>
            <div>
              <Label>Estado</Label>
              <select
                value={filters.estado}
                onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                className="w-full mt-2 px-3 py-2 border rounded-lg"
              >
                <option value="">Todos</option>
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
                <option value="SUSPENDIDO">SUSPENDIDO</option>
              </select>
            </div>
            <div>
              <Label>Pagos Masivos</Label>
              <select
                value={filters.pagosMasivos}
                onChange={(e) => setFilters({ ...filters, pagosMasivos: e.target.value })}
                className="w-full mt-2 px-3 py-2 border rounded-lg"
              >
                <option value="">Todos</option>
                <option value="SI">Habilitado</option>
                <option value="NO">Deshabilitado</option>
              </select>
            </div>
            <div className="col-span-2">
              <Label>Búsqueda</Label>
              <Input
                value={filters.busqueda}
                onChange={(e) => setFilters({ ...filters, busqueda: e.target.value })}
                placeholder="Identificación, nombre..."
                className="mt-2"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('cliente-natural-nuevo')}
              className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b]"
            >
              Nuevo Cliente Natural
            </button>
            <button
              onClick={() => navigate('cliente-juridico-nuevo')}
              className="px-6 py-2 bg-[#C9A84C] text-[#0D1B4B] rounded-lg hover:bg-[#b89640]"
            >
              Nuevo Cliente Jurídico
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#0D1B4B]">
            Listado de Clientes {!loading && `(${clientesFiltrados.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando clientes...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Identificación</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tipo</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nombre / Razón Social</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Pagos Masivos</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">
                        No se encontraron clientes
                      </td>
                    </tr>
                  ) : (
                    clientesFiltrados.map((cliente) => (
                      <tr
                        key={cliente.id}
                        onClick={() => navigate('cliente-ficha', String(cliente.id))}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="py-3 px-4 text-sm font-medium">{cliente.identificacion}</td>
                        <td className="py-3 px-4 text-sm">
                          <Badge variant="outline">{cliente.tipoCliente}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">{cliente.nombreVisual}</td>
                        <td className="py-3 px-4 text-sm">
                          <Badge className={cliente.estado === 'ACTIVO' ? 'bg-green-600' : 'bg-orange-600'}>
                            {String(cliente.estado)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {cliente.activoPagosMasivos ? '✓' : '-'}
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
