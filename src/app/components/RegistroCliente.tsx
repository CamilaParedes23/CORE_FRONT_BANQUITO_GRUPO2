import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface RegistroClienteProps {
  navigate: (screen: string, data?: any) => void;
}

export default function RegistroCliente({ navigate }: RegistroClienteProps) {
  const [tipoCliente, setTipoCliente] = useState<'natural' | 'juridico'>('natural');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [clienteId, setClienteId] = useState('');

  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    direccion: '',
    ruc: '',
    razonSocial: '',
    nombreComercial: '',
    representanteLegal: '',
    emailCorporativo: '',
    direccionFiscal: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (tipoCliente === 'natural') {
      if (!formData.cedula) newErrors.cedula = 'Cédula es requerida';
      if (!formData.nombres) newErrors.nombres = 'Nombres son requeridos';
      if (!formData.apellidos) newErrors.apellidos = 'Apellidos son requeridos';
      if (!formData.email) newErrors.email = 'Email es requerido';
    } else {
      if (!formData.ruc) newErrors.ruc = 'RUC es requerido';
      if (!formData.razonSocial) newErrors.razonSocial = 'Razón Social es requerida';
      if (!formData.emailCorporativo) newErrors.emailCorporativo = 'Email corporativo es requerido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const generatedId = tipoCliente === 'natural' ? formData.cedula : formData.ruc;
    setClienteId(generatedId);
    setShowSuccessModal(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1F3864] mb-2">Registro de Nuevo Cliente</h1>
        <p className="text-gray-600">Complete el formulario según el tipo de cliente</p>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#1F3864]">Datos del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Toggle Tipo de Cliente */}
            <div className="mb-6">
              <Label className="mb-2 block">Tipo de Cliente</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTipoCliente('natural')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    tipoCliente === 'natural'
                      ? 'bg-[#2E75B6] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Persona Natural
                </button>
                <button
                  type="button"
                  onClick={() => setTipoCliente('juridico')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    tipoCliente === 'juridico'
                      ? 'bg-[#2E75B6] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Persona Jurídica
                </button>
              </div>
            </div>

            {/* Formulario Persona Natural */}
            {tipoCliente === 'natural' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cedula">Cédula *</Label>
                    <Input
                      id="cedula"
                      value={formData.cedula}
                      onChange={(e) => handleInputChange('cedula', e.target.value)}
                      className={errors.cedula ? 'border-red-500' : ''}
                    />
                    {errors.cedula && <p className="text-xs text-red-500 mt-1">{errors.cedula}</p>}
                  </div>
                  <div>
                    <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                    <Input
                      id="fechaNacimiento"
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombres">Nombres *</Label>
                    <Input
                      id="nombres"
                      value={formData.nombres}
                      onChange={(e) => handleInputChange('nombres', e.target.value)}
                      className={errors.nombres ? 'border-red-500' : ''}
                    />
                    {errors.nombres && <p className="text-xs text-red-500 mt-1">{errors.nombres}</p>}
                  </div>
                  <div>
                    <Label htmlFor="apellidos">Apellidos *</Label>
                    <Input
                      id="apellidos"
                      value={formData.apellidos}
                      onChange={(e) => handleInputChange('apellidos', e.target.value)}
                      className={errors.apellidos ? 'border-red-500' : ''}
                    />
                    {errors.apellidos && <p className="text-xs text-red-500 mt-1">{errors.apellidos}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Formulario Persona Jurídica */}
            {tipoCliente === 'juridico' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ruc">RUC *</Label>
                    <Input
                      id="ruc"
                      value={formData.ruc}
                      onChange={(e) => handleInputChange('ruc', e.target.value)}
                      className={errors.ruc ? 'border-red-500' : ''}
                    />
                    {errors.ruc && <p className="text-xs text-red-500 mt-1">{errors.ruc}</p>}
                  </div>
                  <div>
                    <Label htmlFor="razonSocial">Razón Social *</Label>
                    <Input
                      id="razonSocial"
                      value={formData.razonSocial}
                      onChange={(e) => handleInputChange('razonSocial', e.target.value)}
                      className={errors.razonSocial ? 'border-red-500' : ''}
                    />
                    {errors.razonSocial && <p className="text-xs text-red-500 mt-1">{errors.razonSocial}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="nombreComercial">Nombre Comercial</Label>
                  <Input
                    id="nombreComercial"
                    value={formData.nombreComercial}
                    onChange={(e) => handleInputChange('nombreComercial', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="representanteLegal">ID Representante Legal</Label>
                    <Input
                      id="representanteLegal"
                      value={formData.representanteLegal}
                      onChange={(e) => handleInputChange('representanteLegal', e.target.value)}
                      placeholder="Buscar por cédula..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailCorporativo">Email Corporativo *</Label>
                    <Input
                      id="emailCorporativo"
                      type="email"
                      value={formData.emailCorporativo}
                      onChange={(e) => handleInputChange('emailCorporativo', e.target.value)}
                      className={errors.emailCorporativo ? 'border-red-500' : ''}
                    />
                    {errors.emailCorporativo && <p className="text-xs text-red-500 mt-1">{errors.emailCorporativo}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="direccionFiscal">Dirección Fiscal</Label>
                  <Input
                    id="direccionFiscal"
                    value={formData.direccionFiscal}
                    onChange={(e) => handleInputChange('direccionFiscal', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors"
              >
                Guardar Cliente
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de Éxito */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600">Cliente Creado Exitosamente</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 mb-4">El cliente ha sido registrado correctamente.</p>
            <p className="font-medium">ID del Cliente: <span className="text-[#2E75B6]">{clienteId}</span></p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('perfil-cliente', { clienteId });
              }}
              className="flex-1 px-4 py-2 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors"
            >
              Ver Perfil del Cliente
            </button>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('dashboard');
              }}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Servicios REST */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-4xl">
        <p className="text-sm text-red-600 font-medium">Servicio REST:</p>
        <ul className="text-xs text-red-600 mt-2 space-y-1">
          <li>POST /api/v1/clientes</li>
        </ul>
      </div>
    </div>
  );
}
