import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface AperturaCuentaProps {
  navigate: (screen: string, data?: any) => void;
}

export default function AperturaCuenta({ navigate }: AperturaCuentaProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cuentaNumero, setCuentaNumero] = useState('');

  const [formData, setFormData] = useState({
    clienteId: '',
    clienteNombre: '',
    subtipoCuenta: '',
    sucursal: '',
    montoApertura: '',
  });

  const [clienteFound, setClienteFound] = useState(false);

  const subtiposCuenta = [
    { id: 'ahorro-simple', nombre: 'Ahorro Simple', montoMinimo: 50 },
    { id: 'ahorro-programado', nombre: 'Ahorro Programado', montoMinimo: 100 },
    { id: 'cuenta-corriente', nombre: 'Cuenta Corriente', montoMinimo: 500 },
    { id: 'cuenta-empresarial', nombre: 'Cuenta Empresarial', montoMinimo: 1000 },
  ];

  const sucursales = [
    { id: 'matriz-quito', nombre: 'Matriz Quito' },
    { id: 'norte-quito', nombre: 'Sucursal Norte Quito' },
    { id: 'sur-quito', nombre: 'Sucursal Sur Quito' },
    { id: 'guayaquil', nombre: 'Sucursal Guayaquil' },
  ];

  const handleBuscarCliente = () => {
    if (formData.clienteId) {
      setClienteFound(true);
      setFormData({ ...formData, clienteNombre: 'Juan Carlos Pérez González' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numeroCuenta = `100${Math.floor(Math.random() * 10000000)}`;
    setCuentaNumero(numeroCuenta);
    setShowSuccessModal(true);
  };

  const selectedSubtipo = subtiposCuenta.find(s => s.id === formData.subtipoCuenta);

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1F3864] mb-2">Apertura de Cuenta</h1>
        <p className="text-gray-600">Cree una nueva cuenta bancaria para un cliente</p>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#1F3864]">Información de la Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Buscador de Cliente */}
            <div className="mb-6 pb-6 border-b">
              <Label htmlFor="clienteId">Buscar Cliente (Cédula/RUC) *</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="clienteId"
                  value={formData.clienteId}
                  onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                  placeholder="Ingrese cédula o RUC..."
                />
                <button
                  type="button"
                  onClick={handleBuscarCliente}
                  className="px-6 py-2 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors whitespace-nowrap"
                >
                  Buscar
                </button>
              </div>
              {clienteFound && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">
                    Cliente encontrado: {formData.clienteNombre}
                  </p>
                </div>
              )}
            </div>

            {clienteFound && (
              <div className="space-y-4">
                {/* Subtipo de Cuenta */}
                <div>
                  <Label htmlFor="subtipoCuenta">Subtipo de Cuenta *</Label>
                  <select
                    id="subtipoCuenta"
                    value={formData.subtipoCuenta}
                    onChange={(e) => setFormData({ ...formData, subtipoCuenta: e.target.value })}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E75B6]"
                  >
                    <option value="">Seleccione un subtipo...</option>
                    {subtiposCuenta.map(subtipo => (
                      <option key={subtipo.id} value={subtipo.id}>
                        {subtipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sucursal */}
                <div>
                  <Label htmlFor="sucursal">Sucursal *</Label>
                  <select
                    id="sucursal"
                    value={formData.sucursal}
                    onChange={(e) => setFormData({ ...formData, sucursal: e.target.value })}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E75B6]"
                  >
                    <option value="">Seleccione una sucursal...</option>
                    {sucursales.map(sucursal => (
                      <option key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Monto Mínimo Info */}
                {selectedSubtipo && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Monto mínimo de apertura:</span> ${selectedSubtipo.montoMinimo}.00
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Resumen */}
                {formData.subtipoCuenta && formData.sucursal && (
                  <Card className="bg-gray-50 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-[#1F3864]">Resumen antes de confirmar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><span className="font-medium">Cliente:</span> {formData.clienteNombre}</p>
                      <p><span className="font-medium">Subtipo:</span> {subtiposCuenta.find(s => s.id === formData.subtipoCuenta)?.nombre}</p>
                      <p><span className="font-medium">Sucursal:</span> {sucursales.find(s => s.id === formData.sucursal)?.nombre}</p>
                      <p><span className="font-medium">Monto apertura:</span> ${selectedSubtipo?.montoMinimo}.00</p>
                    </CardContent>
                  </Card>
                )}
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
                disabled={!clienteFound || !formData.subtipoCuenta || !formData.sucursal}
                className="px-6 py-2 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Abrir Cuenta
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de Éxito */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600">Cuenta Abierta Exitosamente</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 mb-4">La cuenta ha sido creada correctamente.</p>
            <p className="font-medium">Número de Cuenta: <span className="text-[#2E75B6] text-lg">{cuentaNumero}</span></p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('detalle-cuenta', { cuentaNumero });
              }}
              className="flex-1 px-4 py-2 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors"
            >
              Ir al detalle de la cuenta
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
          <li>GET /api/v1/clientes/&#123;identificacion&#125;</li>
          <li>GET /api/v1/catalogos/subtipos-cuenta</li>
          <li>GET /api/v1/catalogos/sucursales</li>
          <li>POST /api/v1/cuentas</li>
        </ul>
      </div>
    </div>
  );
}
