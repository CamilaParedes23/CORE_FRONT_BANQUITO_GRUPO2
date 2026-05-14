import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ClienteService } from '../../services/clienteService';
import { CuentaService } from '../../services/cuentaService';
import type { ClienteResponse } from '../../services/clienteService';
import type { CuentaResponse } from '../../services/cuentaService';

interface ClienteFichaProps {
  navigate: (screen: string, id?: string) => void;
  clienteId: string | null;
}

export default function ClienteFicha({ navigate, clienteId }: ClienteFichaProps) {
  const [cliente, setCliente] = useState<ClienteResponse | null>(null);
  const [cuentas, setCuentas] = useState<CuentaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clienteId) return;
    const id = parseInt(clienteId, 10);
    if (isNaN(id)) return;

    setLoading(true);
    setError(null);

    Promise.all([
      ClienteService.obtenerPorId(id),
      CuentaService.listar(),
    ])
      .then(([clienteData, todasCuentas]) => {
        setCliente(clienteData);
        setCuentas(todasCuentas.filter(c => c.clienteId === id));
      })
      .catch(err => setError(err.message || 'Error al cargar datos del cliente'))
      .finally(() => setLoading(false));
  }, [clienteId]);

  if (loading) {
    return (
      <div className="p-8 bg-[#F5F7FA] min-h-full flex items-center justify-center">
        <p className="text-gray-500">Cargando datos del cliente...</p>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="p-8 bg-[#F5F7FA] min-h-full">
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-800">
          ⚠️ {error || 'Cliente no encontrado'}
        </div>
        <button
          onClick={() => navigate('clientes')}
          className="mt-4 px-4 py-2 bg-[#0D1B4B] text-white rounded-lg"
        >
          Volver a Clientes
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Ficha de Cliente</h1>
        <p className="text-gray-600">Información detallada del cliente</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-[#0D1B4B]">{cliente.nombreVisual}</CardTitle>
              <p className="text-gray-600 mt-1">ID: {cliente.identificacion}</p>
            </div>
            <div className="flex gap-3">
              <Badge variant="outline">{cliente.tipoCliente}</Badge>
              <Badge variant="outline">{cliente.tipoIdentificacion}</Badge>
              <Badge className={String(cliente.estado) === 'ACTIVO' ? 'bg-green-600' : 'bg-orange-600'}>
                {String(cliente.estado)}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="datos">
        <TabsList className="mb-6">
          <TabsTrigger value="datos">Datos Generales</TabsTrigger>
          <TabsTrigger value="cuentas">Cuentas ({cuentas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="datos">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0D1B4B]">Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Identificación</p>
                  <p className="font-medium">{cliente.identificacion}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tipo de Identificación</p>
                  <p className="font-medium">{cliente.tipoIdentificacion}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Correo Electrónico</p>
                  <p className="font-medium">{cliente.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                  <p className="font-medium">{cliente.telefonoMovil}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tipo de Cliente</p>
                  <p className="font-medium">{cliente.tipoCliente}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pagos Masivos</p>
                  <p className="font-medium">{cliente.activoPagosMasivos ? 'Habilitado' : 'Deshabilitado'}</p>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b]">
                  Editar Datos
                </button>
                <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  Cambiar Estado
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cuentas">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#0D1B4B]">Cuentas del Cliente</CardTitle>
                <button
                  onClick={() => navigate('cuenta-nueva')}
                  className="px-4 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b]"
                >
                  Nueva Cuenta
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {cuentas.length === 0 ? (
                <p className="text-gray-500 py-4">Este cliente no tiene cuentas registradas</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Número</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Saldo Contable</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Saldo Disponible</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cuentas.map((cuenta) => (
                        <tr key={cuenta.numeroCuenta} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium">{cuenta.numeroCuenta}</td>
                          <td className="py-3 px-4 text-sm">
                            <Badge className={String(cuenta.estado) === 'ACTIVA' ? 'bg-green-600' : 'bg-orange-600'}>
                              {String(cuenta.estado)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">
                            ${Number(cuenta.saldoContable).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">
                            ${Number(cuenta.saldoDisponible).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <button
                              onClick={() => navigate('cuenta-ficha', cuenta.numeroCuenta)}
                              className="text-[#0D1B4B] hover:underline"
                            >
                              Ver detalle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
