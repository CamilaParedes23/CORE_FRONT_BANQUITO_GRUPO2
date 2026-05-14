import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { config } from '../../config/env';

interface ClienteNaturalFormProps {
  navigate: (screen: string, id?: string) => void;
}

export default function ClienteNaturalForm({ navigate }: ClienteNaturalFormProps) {
  const [formData, setFormData] = useState({
    tipoId: 'CEDULA',
    numeroId: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    correo: '',
    telefono: '',
    direccion: '',
    segmento: 'RETAIL'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('clientes');
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Nuevo Cliente Persona Natural</h1>
        <p className="text-gray-600">Registre un nuevo cliente persona natural</p>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#0D1B4B]">Datos del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Identificación *</Label>
                <select
                  value={formData.tipoId}
                  onChange={(e) => setFormData({ ...formData, tipoId: e.target.value })}
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
                >
                  <option value="CEDULA">Cédula</option>
                  <option value="PASAPORTE">Pasaporte</option>
                </select>
              </div>
              <div>
                <Label>Número de Identificación *</Label>
                <Input
                  value={formData.numeroId}
                  onChange={(e) => setFormData({ ...formData, numeroId: e.target.value })}
                  placeholder="Ej: 1234567890"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombres *</Label>
                <Input
                  value={formData.nombres}
                  onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Apellidos *</Label>
                <Input
                  value={formData.apellidos}
                  onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha de Nacimiento *</Label>
                <Input
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
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
                  <option value="RETAIL">Retail</option>
                  <option value="PREFERENTE">Preferente</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Correo Electrónico *</Label>
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
                  placeholder="+593 99 123 4567"
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
        <p className="text-xs text-blue-600 mt-1">POST {config.apiBaseUrl}/clientes/naturales</p>
      </div>
    </div>
  );
}
