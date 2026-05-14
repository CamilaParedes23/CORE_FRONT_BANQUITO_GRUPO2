import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface CatalogosProps {
  navigate: (screen: string, data?: any) => void;
}

export default function Catalogos({ navigate }: CatalogosProps) {
  const [activeTab, setActiveTab] = useState('sucursales');
  const [busquedaSucursal, setBusquedaSucursal] = useState('');

  const sucursales = [
    { codigo: 'SUC-001', nombre: 'Matriz Quito', ciudad: 'Quito', estado: 'ACTIVA' },
    { codigo: 'SUC-002', nombre: 'Sucursal Norte Quito', ciudad: 'Quito', estado: 'ACTIVA' },
    { codigo: 'SUC-003', nombre: 'Sucursal Sur Quito', ciudad: 'Quito', estado: 'ACTIVA' },
    { codigo: 'SUC-004', nombre: 'Sucursal Guayaquil', ciudad: 'Guayaquil', estado: 'ACTIVA' },
    { codigo: 'SUC-005', nombre: 'Sucursal Cuenca', ciudad: 'Cuenca', estado: 'ACTIVA' },
    { codigo: 'SUC-006', nombre: 'Sucursal Ambato', ciudad: 'Ambato', estado: 'ACTIVA' },
    { codigo: 'SUC-007', nombre: 'Sucursal Machala', ciudad: 'Machala', estado: 'INACTIVA' },
  ];

  const subtiposCuenta = [
    { id: 'ST-001', nombre: 'Ahorro Simple', tipoBase: 'Ahorro', montoMinimo: '$50.00', estado: 'ACTIVA' },
    { id: 'ST-002', nombre: 'Ahorro Programado', tipoBase: 'Ahorro', montoMinimo: '$100.00', estado: 'ACTIVA' },
    { id: 'ST-003', nombre: 'Ahorro Premium', tipoBase: 'Ahorro', montoMinimo: '$500.00', estado: 'ACTIVA' },
    { id: 'ST-004', nombre: 'Cuenta Corriente Personal', tipoBase: 'Corriente', montoMinimo: '$500.00', estado: 'ACTIVA' },
    { id: 'ST-005', nombre: 'Cuenta Corriente Empresarial', tipoBase: 'Corriente', montoMinimo: '$1,000.00', estado: 'ACTIVA' },
    { id: 'ST-006', nombre: 'Cuenta Nómina', tipoBase: 'Ahorro', montoMinimo: '$0.00', estado: 'ACTIVA' },
    { id: 'ST-007', nombre: 'Cuenta Estudiantil', tipoBase: 'Ahorro', montoMinimo: '$25.00', estado: 'INACTIVA' },
  ];

  const sucursalesFiltradas = sucursales.filter(
    (suc) =>
      suc.nombre.toLowerCase().includes(busquedaSucursal.toLowerCase()) ||
      suc.ciudad.toLowerCase().includes(busquedaSucursal.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1F3864] mb-2">Catálogos</h1>
        <p className="text-gray-600">Consulta de catálogos del sistema</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="sucursales">Sucursales</TabsTrigger>
          <TabsTrigger value="subtipos">Subtipos de Cuenta</TabsTrigger>
        </TabsList>

        {/* Tab: Sucursales */}
        <TabsContent value="sucursales">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1F3864]">Sucursales</CardTitle>
                <div className="w-80">
                  <Input
                    placeholder="Buscar por nombre o ciudad..."
                    value={busquedaSucursal}
                    onChange={(e) => setBusquedaSucursal(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Código</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nombre</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ciudad</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sucursalesFiltradas.map((sucursal) => (
                      <tr key={sucursal.codigo} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium">{sucursal.codigo}</td>
                        <td className="py-3 px-4 text-sm">{sucursal.nombre}</td>
                        <td className="py-3 px-4 text-sm">{sucursal.ciudad}</td>
                        <td className="py-3 px-4 text-sm">
                          <Badge
                            variant={sucursal.estado === 'ACTIVA' ? 'default' : 'secondary'}
                            className={sucursal.estado === 'ACTIVA' ? 'bg-green-600' : ''}
                          >
                            {sucursal.estado}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {sucursalesFiltradas.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron sucursales que coincidan con la búsqueda
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Subtipos de Cuenta */}
        <TabsContent value="subtipos">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#1F3864]">Subtipos de Cuenta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nombre</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tipo Base</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Monto Mínimo Apertura</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subtiposCuenta.map((subtipo) => (
                      <tr key={subtipo.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium">{subtipo.id}</td>
                        <td className="py-3 px-4 text-sm">{subtipo.nombre}</td>
                        <td className="py-3 px-4 text-sm">
                          <Badge variant="outline">
                            {subtipo.tipoBase}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">{subtipo.montoMinimo}</td>
                        <td className="py-3 px-4 text-sm">
                          <Badge
                            variant={subtipo.estado === 'ACTIVA' ? 'default' : 'secondary'}
                            className={subtipo.estado === 'ACTIVA' ? 'bg-green-600' : ''}
                          >
                            {subtipo.estado}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Servicios REST */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600 font-medium">Servicio REST:</p>
        <ul className="text-xs text-red-600 mt-2 space-y-1">
          <li>GET /api/v1/catalogos/sucursales</li>
          <li>GET /api/v1/catalogos/subtipos-cuenta</li>
        </ul>
      </div>
    </div>
  );
}
