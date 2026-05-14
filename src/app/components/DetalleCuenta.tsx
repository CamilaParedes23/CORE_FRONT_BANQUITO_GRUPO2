import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface DetalleCuentaProps {
  navigate: (screen: string, data?: any) => void;
  cuentaNumero: string | null;
}

export default function DetalleCuenta({ navigate, cuentaNumero }: DetalleCuentaProps) {
  const [showBloqueoModal, setShowBloqueoModal] = useState(false);
  const [bloqueoData, setBloqueoData] = useState({ motivo: '', monto: '' });
  const [bloqueos, setBloqueos] = useState([
    { id: 'BLQ-001', motivo: 'Retención judicial', monto: '$1,000.00', fecha: '2026-04-15' },
    { id: 'BLQ-002', motivo: 'Verificación de origen', monto: '$500.00', fecha: '2026-04-20' },
  ]);

  const cuentaData = {
    numero: cuentaNumero || '1001234567',
    estado: 'ACTIVA',
    titular: 'Juan Carlos Pérez González',
    subtipo: 'Ahorro Simple',
    sucursal: 'Matriz Quito',
    fechaApertura: '2024-01-15',
    saldoContable: '$6,740.50',
    saldoDisponible: '$5,240.50',
  };

  const handleAgregarBloqueo = () => {
    if (bloqueoData.motivo && bloqueoData.monto) {
      const nuevoBloqueo = {
        id: `BLQ-${String(bloqueos.length + 1).padStart(3, '0')}`,
        motivo: bloqueoData.motivo,
        monto: `$${parseFloat(bloqueoData.monto).toFixed(2)}`,
        fecha: new Date().toISOString().split('T')[0],
      };
      setBloqueos([...bloqueos, nuevoBloqueo]);
      setBloqueoData({ motivo: '', monto: '' });
      setShowBloqueoModal(false);
    }
  };

  const handleLiberarBloqueo = (id: string) => {
    setBloqueos(bloqueos.filter(b => b.id !== id));
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1F3864] mb-2">Detalle de Cuenta</h1>
        <p className="text-gray-600">Información completa y saldos en tiempo real</p>
      </div>

      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-[#1F3864]">Cuenta {cuentaData.numero}</CardTitle>
              <p className="text-gray-600 mt-1">Titular: {cuentaData.titular}</p>
            </div>
            <Badge className="px-4 py-2 text-sm bg-green-600">
              {cuentaData.estado}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Saldos */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Saldo Contable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-semibold text-[#1F3864]">{cuentaData.saldoContable}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Saldo Disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-semibold text-[#2E75B6]">{cuentaData.saldoDisponible}</div>
            <p className="text-xs text-gray-500 mt-2">Contable − Bloqueos</p>
          </CardContent>
        </Card>
      </div>

      {/* Ficha de la Cuenta */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-[#1F3864]">Ficha de la Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Subtipo</p>
              <p className="font-medium">{cuentaData.subtipo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Sucursal</p>
              <p className="font-medium">{cuentaData.sucursal}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Fecha de Apertura</p>
              <p className="font-medium">{cuentaData.fechaApertura}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Titular</p>
              <p className="font-medium">{cuentaData.titular}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bloqueos Activos */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#1F3864]">Bloqueos Activos</CardTitle>
            <button
              onClick={() => setShowBloqueoModal(true)}
              className="px-4 py-2 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors"
            >
              Agregar Bloqueo
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">ID Bloqueo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Motivo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Monto</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bloqueos.map((bloqueo) => (
                  <tr key={bloqueo.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">{bloqueo.id}</td>
                    <td className="py-3 px-4 text-sm">{bloqueo.motivo}</td>
                    <td className="py-3 px-4 text-sm font-medium">{bloqueo.monto}</td>
                    <td className="py-3 px-4 text-sm">{bloqueo.fecha}</td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        onClick={() => handleLiberarBloqueo(bloqueo.id)}
                        className="text-red-600 hover:underline"
                      >
                        Liberar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Accesos Rápidos */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('historial-movimientos', { cuentaNumero: cuentaData.numero })}
          className="px-6 py-3 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors"
        >
          Ver Movimientos
        </button>
        <button
          onClick={() => navigate('cambio-estado-cuenta', { cuentaNumero: cuentaData.numero })}
          className="px-6 py-3 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors"
        >
          Cambiar Estado
        </button>
        <button
          onClick={() => navigate('registro-transaccion')}
          className="px-6 py-3 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors"
        >
          Nueva Transacción
        </button>
      </div>

      {/* Modal Agregar Bloqueo */}
      <Dialog open={showBloqueoModal} onOpenChange={setShowBloqueoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#1F3864]">Agregar Bloqueo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="motivo">Motivo del Bloqueo *</Label>
              <Input
                id="motivo"
                value={bloqueoData.motivo}
                onChange={(e) => setBloqueoData({ ...bloqueoData, motivo: e.target.value })}
                placeholder="Ej: Retención judicial"
              />
            </div>
            <div>
              <Label htmlFor="monto">Monto a Bloquear *</Label>
              <Input
                id="monto"
                type="number"
                step="0.01"
                value={bloqueoData.monto}
                onChange={(e) => setBloqueoData({ ...bloqueoData, monto: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowBloqueoModal(false)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAgregarBloqueo}
              className="flex-1 px-4 py-2 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors"
            >
              Agregar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Servicios REST */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600 font-medium">Servicio REST:</p>
        <ul className="text-xs text-red-600 mt-2 space-y-1">
          <li>GET /api/v1/cuentas/&#123;numero&#125;</li>
          <li>GET /api/v1/cuentas/&#123;numero&#125;/saldos</li>
          <li>POST /api/v1/cuentas/&#123;numero&#125;/bloqueos</li>
          <li>DELETE /api/v1/cuentas/&#123;numero&#125;/bloqueos/&#123;id&#125;</li>
        </ul>
      </div>
    </div>
  );
}
