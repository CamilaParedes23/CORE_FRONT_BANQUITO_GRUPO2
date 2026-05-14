import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';

interface EditarClienteProps {
  navigate: (screen: string, data?: any) => void;
  clienteId: string | null;
}

export default function EditarCliente({ navigate, clienteId }: EditarClienteProps) {
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [formData, setFormData] = useState({
    cedula: clienteId || '1234567890',
    tipo: 'Natural',
    nombres: 'Juan Carlos',
    apellidos: 'Pérez González',
    telefono: '+593 99 123 4567',
    email: 'juan.perez@email.com',
    direccion: 'Av. Amazonas N24-03 y Colón, Quito',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessToast(true);
    setTimeout(() => {
      navigate('perfil-cliente', { clienteId: formData.cedula });
    }, 1500);
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1F3864] mb-2">Editar Datos del Cliente</h1>
        <p className="text-gray-600">Actualice la información de contacto del cliente</p>
      </div>

      {showSuccessToast && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-600 font-medium">
            Datos actualizados correctamente
          </AlertDescription>
        </Alert>
      )}

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#1F3864]">Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-700 text-sm">
              Solo se pueden editar datos de contacto. Para cambios de identificación contacte a Cumplimiento.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Campos no editables */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cedula">Identificación</Label>
                  <Input
                    id="cedula"
                    value={formData.cedula}
                    disabled
                    className="bg-gray-100 text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo de Cliente</Label>
                  <Input
                    id="tipo"
                    value={formData.tipo}
                    disabled
                    className="bg-gray-100 text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombres">Nombres</Label>
                  <Input
                    id="nombres"
                    value={formData.nombres}
                    disabled
                    className="bg-gray-100 text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input
                    id="apellidos"
                    value={formData.apellidos}
                    disabled
                    className="bg-gray-100 text-gray-500"
                  />
                </div>
              </div>

              {/* Campos editables */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('perfil-cliente', { clienteId: formData.cedula })}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Servicios REST */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-4xl">
        <p className="text-sm text-red-600 font-medium">Servicio REST:</p>
        <ul className="text-xs text-red-600 mt-2 space-y-1">
          <li>GET /api/v1/clientes/&#123;identificacion&#125;</li>
          <li>PUT /api/v1/clientes/&#123;identificacion&#125;</li>
        </ul>
      </div>
    </div>
  );
}
