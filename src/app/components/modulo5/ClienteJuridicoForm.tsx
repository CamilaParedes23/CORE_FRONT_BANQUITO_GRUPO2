import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { config } from '../../config/env';

interface ClienteJuridicoFormProps {
  navigate: (screen: string, id?: string) => void;
}

export default function ClienteJuridicoForm({ navigate }: ClienteJuridicoFormProps) {
  const [formData, setFormData] = useState({
    ruc: '',
    razonSocial: '',
    fechaConstitucion: '',
    correo: '',
    telefono: '',
    direccion: '',
    representanteLegal: '',
    segmento: 'PYME'
  });

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Nuevo Cliente Persona Jurídica</h1>
        <p className="text-gray-600">Registre un nuevo cliente persona jurídica (empresa)</p>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#0D1B4B]">Datos de la Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); navigate('clientes'); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>RUC *</Label>
                <Input
                  value={formData.ruc}
                  onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                  placeholder="1234567890001"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Fecha de Constitución</Label>
                <Input
                  type="date"
                  value={formData.fechaConstitucion}
                  onChange={(e) => setFormData({ ...formData, fechaConstitucion: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Razón Social *</Label>
              <Input
                value={formData.razonSocial}
                onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                placeholder="Empresa XYZ S.A."
                className="mt-2"
              />
            </div>

            <div>
              <Label>Representante Legal (Cédula)</Label>
              <Input
                value={formData.representanteLegal}
                onChange={(e) => setFormData({ ...formData, representanteLegal: e.target.value })}
                placeholder="Buscar cliente natural existente..."
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Correo Corporativo *</Label>
                <Input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Dirección</Label>
              <Input
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Segmento</Label>
              <select
                value={formData.segmento}
                onChange={(e) => setFormData({ ...formData, segmento: e.target.value })}
                className="w-full mt-2 px-3 py-2 border rounded-lg"
              >
                <option value="PYME">PYME</option>
                <option value="CORPORATIVO">Corporativo</option>
                <option value="GOBIERNO">Gobierno</option>
              </select>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('clientes')}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b]"
              >
                Crear Cliente
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 max-w-4xl p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 font-medium">Endpoint API:</p>
        <p className="text-xs text-blue-600 mt-1">POST {config.apiBaseUrl}/clientes/juridicos</p>
      </div>
    </div>
  );
}
