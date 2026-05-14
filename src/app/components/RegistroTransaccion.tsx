import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface RegistroTransaccionProps {
  navigate: (screen: string, data?: any) => void;
}

export default function RegistroTransaccion({ navigate }: RegistroTransaccionProps) {
  const [tipoMovimiento, setTipoMovimiento] = useState<'DEBITO' | 'CREDITO'>('CREDITO');
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultado, setResultado] = useState({ uuid: '', estado: 'EXITOSA', hora: '' });

  const [formData, setFormData] = useState({
    numeroCuenta: '',
    titular: '',
    saldoDisponible: '',
    monto: '',
    subtipoTransaccion: '',
    uuid: `TXN-${Math.floor(Math.random() * 100000)}-2026`,
  });

  const [cuentaValidada, setCuentaValidada] = useState(false);

  const subtiposTransaccion = [
    { value: 'nomina', label: 'Nómina' },
    { value: 'proveedores', label: 'Proveedores' },
    { value: 'retiro', label: 'Retiro' },
    { value: 'deposito', label: 'Depósito' },
    { value: 'transferencia', label: 'Transferencia' },
  ];

  const handleValidarCuenta = () => {
    if (formData.numeroCuenta) {
      setCuentaValidada(true);
      setFormData({
        ...formData,
        titular: 'Juan Carlos Pérez González',
        saldoDisponible: '$5,240.50',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const monto = parseFloat(formData.monto);
    const saldoDisponible = parseFloat(formData.saldoDisponible.replace('$', '').replace(',', ''));

    let estado = 'EXITOSA';
    if (tipoMovimiento === 'DEBITO' && monto > saldoDisponible) {
      estado = 'RECHAZADA';
    }

    setResultado({
      uuid: formData.uuid,
      estado,
      hora: new Date().toLocaleString(),
    });
    setShowResultModal(true);
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1F3864] mb-2">Registro de Transacción</h1>
        <p className="text-gray-600">Procesar un débito o crédito sobre una cuenta</p>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#1F3864]">Nueva Transacción</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Toggle Tipo de Movimiento */}
            <div className="mb-6">
              <Label className="mb-2 block">Tipo de Movimiento</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTipoMovimiento('DEBITO')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    tipoMovimiento === 'DEBITO'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  DÉBITO
                </button>
                <button
                  type="button"
                  onClick={() => setTipoMovimiento('CREDITO')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    tipoMovimiento === 'CREDITO'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  CRÉDITO
                </button>
              </div>
            </div>

            {/* Número de Cuenta */}
            <div className="mb-6">
              <Label htmlFor="numeroCuenta">Número de Cuenta *</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="numeroCuenta"
                  value={formData.numeroCuenta}
                  onChange={(e) => setFormData({ ...formData, numeroCuenta: e.target.value })}
                  placeholder="Ingrese número de cuenta..."
                />
                <button
                  type="button"
                  onClick={handleValidarCuenta}
                  className="px-6 py-2 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors whitespace-nowrap"
                >
                  Validar
                </button>
              </div>
              {cuentaValidada && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Titular:</span> {formData.titular}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    <span className="font-medium">Saldo Disponible:</span> {formData.saldoDisponible}
                  </p>
                </div>
              )}
            </div>

            {cuentaValidada && (
              <div className="space-y-4">
                {/* Monto */}
                <div>
                  <Label htmlFor="monto">Monto *</Label>
                  <Input
                    id="monto"
                    type="number"
                    step="0.01"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    placeholder="0.00"
                    className="mt-2"
                  />
                  {tipoMovimiento === 'DEBITO' && formData.monto && parseFloat(formData.monto) > parseFloat(formData.saldoDisponible.replace('$', '').replace(',', '')) && (
                    <p className="text-xs text-red-500 mt-1">El monto excede el saldo disponible</p>
                  )}
                </div>

                {/* Subtipo */}
                <div>
                  <Label htmlFor="subtipo">Subtipo de Transacción *</Label>
                  <select
                    id="subtipo"
                    value={formData.subtipoTransaccion}
                    onChange={(e) => setFormData({ ...formData, subtipoTransaccion: e.target.value })}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E75B6]"
                  >
                    <option value="">Seleccione un subtipo...</option>
                    {subtiposTransaccion.map(subtipo => (
                      <option key={subtipo.value} value={subtipo.value}>
                        {subtipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* UUID */}
                <div>
                  <Label htmlFor="uuid">UUID de Transacción</Label>
                  <Input
                    id="uuid"
                    value={formData.uuid}
                    onChange={(e) => setFormData({ ...formData, uuid: e.target.value })}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Auto-generado, puede editarse si es necesario</p>
                </div>

                {/* Vista Previa */}
                {formData.monto && formData.subtipoTransaccion && (
                  <Card className="bg-gray-50 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-[#1F3864]">Vista Previa</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><span className="font-medium">Tipo:</span> <span className={tipoMovimiento === 'DEBITO' ? 'text-red-600' : 'text-green-600'}>{tipoMovimiento}</span></p>
                      <p><span className="font-medium">Monto:</span> ${parseFloat(formData.monto).toFixed(2)}</p>
                      <p><span className="font-medium">Subtipo:</span> {subtiposTransaccion.find(s => s.value === formData.subtipoTransaccion)?.label}</p>
                      <p><span className="font-medium">UUID:</span> {formData.uuid}</p>
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
                disabled={!cuentaValidada || !formData.monto || !formData.subtipoTransaccion}
                className="px-6 py-2 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Procesar Transacción
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal Resultado */}
      <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={resultado.estado === 'EXITOSA' ? 'text-green-600' : 'text-red-600'}>
              Transacción {resultado.estado}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <p className="font-medium">UUID: <span className="text-[#2E75B6]">{resultado.uuid}</span></p>
            <p>Estado: <span className={`font-medium ${resultado.estado === 'EXITOSA' ? 'text-green-600' : 'text-red-600'}`}>{resultado.estado}</span></p>
            <p className="text-sm text-gray-600">Hora de procesamiento: {resultado.hora}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowResultModal(false);
                navigate('detalle-transaccion', { transaccionUuid: resultado.uuid });
              }}
              className="flex-1 px-4 py-2 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors"
            >
              Ver Detalle
            </button>
            <button
              onClick={() => {
                setShowResultModal(false);
                navigate('dashboard');
              }}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Servicios REST */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-4xl">
        <p className="text-sm text-red-600 font-medium">Servicio REST:</p>
        <ul className="text-xs text-red-600 mt-2 space-y-1">
          <li>GET /api/v1/cuentas/&#123;numero&#125;/saldos</li>
          <li>POST /api/v1/transacciones</li>
        </ul>
      </div>
    </div>
  );
}
