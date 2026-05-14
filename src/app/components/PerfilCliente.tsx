import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

interface PerfilClienteProps {
  navigate: (screen: string, data?: any) => void;
  clienteId: string | null;
}

export default function PerfilCliente({ navigate, clienteId }: PerfilClienteProps) {
  const [activeTab, setActiveTab] = useState('datos');

  const clienteData = {
    tipo: 'Natural',
    estado: 'ACTIVO',
    cedula: clienteId || '1234567890',
    nombres: 'Juan Carlos',
    apellidos: 'Pérez González',
    fechaNacimiento: '1985-06-15',
    telefono: '+593 99 123 4567',
    email: 'juan.perez@email.com',
    direccion: 'Av. Amazonas N24-03 y Colón, Quito',
  };

  const cuentas = [
    {
      numero: '1001234567',
      subtipo: 'Ahorro Simple',
      estado: 'ACTIVA',
      saldoDisponible: '$5,240.50',
      fechaApertura: '2024-01-15',
    },
    {
      numero: '1001234568',
      subtipo: 'Cuenta Corriente',
      estado: 'ACTIVA',
      saldoDisponible: '$12,890.00',
      fechaApertura: '2024-03-20',
    },
    {
      numero: '1001234569',
      subtipo: 'Ahorro Programado',
      estado: 'INACTIVA',
      saldoDisponible: '$0.00',
      fechaApertura: '2023-11-10',
    },
  ];

  const historialCambios = [
    {
      fecha: '2025-04-15 14:30',
      usuario: 'admin.operaciones',
      campo: 'Dirección',
      valorAnterior: 'Av. Amazonas N24-01',
      valorNuevo: 'Av. Amazonas N24-03 y Colón, Quito',
    },
    {
      fecha: '2025-03-10 10:15',
      usuario: 'admin.operaciones',
      campo: 'Teléfono',
      valorAnterior: '+593 99 111 2222',
      valorNuevo: '+593 99 123 4567',
    },
    {
      fecha: '2024-01-15 09:00',
      usuario: 'operador.matriz',
      campo: 'Registro Inicial',
      valorAnterior: '-',
      valorNuevo: 'Cliente creado',
    },
  ];

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1F3864] mb-2">Perfil del Cliente</h1>
        <p className="text-gray-600">Información detallada y cuentas asociadas</p>
      </div>

      {/* Header del Perfil */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-[#1F3864]">
                {clienteData.nombres} {clienteData.apellidos}
              </CardTitle>
              <p className="text-gray-600 mt-1">Identificación: {clienteData.cedula}</p>
            </div>
            <div className="flex gap-3">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                {clienteData.tipo}
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-green-600">
                {clienteData.estado}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="datos">Datos Personales</TabsTrigger>
          <TabsTrigger value="cuentas">Cuentas</TabsTrigger>
          <TabsTrigger value="historial">Historial de Cambios</TabsTrigger>
        </TabsList>

        {/* Tab: Datos Personales */}
        <TabsContent value="datos">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1F3864]">Información Personal</CardTitle>
                <button
                  onClick={() => navigate('editar-cliente', { clienteId: clienteData.cedula })}
                  className="px-4 py-2 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors"
                >
                  Editar Datos
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cédula</p>
                  <p className="font-medium">{clienteData.cedula}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fecha de Nacimiento</p>
                  <p className="font-medium">{clienteData.fechaNacimiento}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nombres</p>
                  <p className="font-medium">{clienteData.nombres}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Apellidos</p>
                  <p className="font-medium">{clienteData.apellidos}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                  <p className="font-medium">{clienteData.telefono}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium">{clienteData.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Dirección</p>
                  <p className="font-medium">{clienteData.direccion}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Cuentas */}
        <TabsContent value="cuentas">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1F3864]">Cuentas Asociadas</CardTitle>
                <button
                  onClick={() => navigate('apertura-cuenta')}
                  className="px-4 py-2 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors"
                >
                  Abrir Nueva Cuenta
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Número de Cuenta</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Subtipo</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Saldo Disponible</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Fecha Apertura</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuentas.map((cuenta) => (
                      <tr key={cuenta.numero} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium">{cuenta.numero}</td>
                        <td className="py-3 px-4 text-sm">{cuenta.subtipo}</td>
                        <td className="py-3 px-4 text-sm">
                          <Badge
                            variant={cuenta.estado === 'ACTIVA' ? 'default' : 'secondary'}
                            className={cuenta.estado === 'ACTIVA' ? 'bg-green-600' : ''}
                          >
                            {cuenta.estado}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">{cuenta.saldoDisponible}</td>
                        <td className="py-3 px-4 text-sm">{cuenta.fechaApertura}</td>
                        <td className="py-3 px-4 text-sm">
                          <button
                            onClick={() => navigate('detalle-cuenta', { cuentaNumero: cuenta.numero })}
                            className="text-[#2E75B6] hover:underline"
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Historial */}
        <TabsContent value="historial">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#1F3864]">Historial de Cambios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {historialCambios.map((cambio, index) => (
                  <div key={index} className="border-l-4 border-[#2E75B6] pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{cambio.campo}</p>
                      <p className="text-xs text-gray-500">{cambio.fecha}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Usuario:</span> {cambio.usuario}
                      </p>
                      <p className="mt-1">
                        <span className="font-medium">Anterior:</span> <span className="line-through text-red-600">{cambio.valorAnterior}</span>
                      </p>
                      <p>
                        <span className="font-medium">Nuevo:</span> <span className="text-green-600">{cambio.valorNuevo}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Servicios REST */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600 font-medium">Servicio REST:</p>
        <ul className="text-xs text-red-600 mt-2 space-y-1">
          <li>GET /api/v1/clientes/&#123;identificacion&#125;</li>
          <li>GET /api/v1/clientes/&#123;identificacion&#125;/cuentas</li>
        </ul>
      </div>
    </div>
  );
}
