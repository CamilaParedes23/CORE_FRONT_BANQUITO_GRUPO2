import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface DetalleTransaccionProps {
  navigate: (screen: string, data?: any) => void;
  transaccionUuid: string | null;
}

export default function DetalleTransaccion({ navigate, transaccionUuid }: DetalleTransaccionProps) {
  const [showReversoModal, setShowReversoModal] = useState(false);
  const [reversoData, setReversoData] = useState({ motivo: '', usuario: 'Juan Pérez (Operador)' });
  const [reversoGenerado, setReversoGenerado] = useState<string | null>(null);

  const transaccionData = {
    uuid: transaccionUuid || 'TXN-001-2026',
    estado: 'EXITOSA',
    cuenta: '1001234567',
    tipoMovimiento: 'CREDITO',
    monto: '$500.00',
    subtipo: 'Depósito',
    fechaHora: '2026-04-30 14:25:30',
    saldoResultante: '$5,740.50',
    transaccionRelacionada: null,
  };

  const handleAplicarReverso = () => {
    if (reversoData.motivo) {
      const uuidReverso = `TXN-REV-${Math.floor(Math.random() * 100000)}-2026`;
      setReversoGenerado(uuidReverso);
    }
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1F3864] mb-2">Detalle de Transacción</h1>
        <p className="text-gray-600">Información completa de la transacción</p>
      </div>

      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-[#1F3864]">UUID: {transaccionData.uuid}</CardTitle>
            </div>
            <Badge className={`px-4 py-2 text-sm ${transaccionData.estado === 'EXITOSA' ? 'bg-green-600' : 'bg-red-600'}`}>
              {transaccionData.estado}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Datos de la Transacción */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-[#1F3864]">Información de la Transacción</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cuenta</p>
              <p className="font-medium">{transaccionData.cuenta}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tipo de Movimiento</p>
              <p className={`font-medium ${transaccionData.tipoMovimiento === 'DEBITO' ? 'text-red-600' : 'text-green-600'}`}>
                {transaccionData.tipoMovimiento}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Monto</p>
              <p className="font-medium text-2xl text-[#1F3864]">{transaccionData.monto}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Subtipo</p>
              <p className="font-medium">{transaccionData.subtipo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Fecha y Hora</p>
              <p className="font-medium">{transaccionData.fechaHora}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Saldo Resultante</p>
              <p className="font-medium">{transaccionData.saldoResultante}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transacción Relacionada */}
      {transaccionData.transaccionRelacionada && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-[#1F3864]">Transacción Relacionada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Esta es una transacción de reverso de:{' '}
              <button
                onClick={() => navigate('detalle-transaccion', { transaccionUuid: transaccionData.transaccionRelacionada })}
                className="text-[#2E75B6] hover:underline font-medium"
              >
                {transaccionData.transaccionRelacionada}
              </button>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reverso Generado */}
      {reversoGenerado && (
        <Card className="mb-6 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700">Reverso Aplicado Exitosamente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">Se ha generado una transacción compensatoria:</p>
            <p className="font-medium">
              UUID Reverso:{' '}
              <button
                onClick={() => navigate('detalle-transaccion', { transaccionUuid: reversoGenerado })}
                className="text-[#2E75B6] hover:underline"
              >
                {reversoGenerado}
              </button>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Botón de Reverso */}
      {transaccionData.estado === 'EXITOSA' && !reversoGenerado && (
        <div className="mb-6">
          <button
            onClick={() => setShowReversoModal(true)}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Aplicar Reverso
          </button>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('historial-movimientos', { cuentaNumero: transaccionData.cuenta })}
          className="px-6 py-3 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors"
        >
          Ver Historial de la Cuenta
        </button>
        <button
          onClick={() => navigate('dashboard')}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Volver al Dashboard
        </button>
      </div>

      {/* Modal Reverso */}
      <Dialog open={showReversoModal} onOpenChange={setShowReversoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#1F3864]">Aplicar Reverso</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                ⚠️ Esta acción creará una transacción compensatoria que anulará el efecto de la transacción original.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="motivo">Motivo del Reverso *</Label>
                <textarea
                  id="motivo"
                  value={reversoData.motivo}
                  onChange={(e) => setReversoData({ ...reversoData, motivo: e.target.value })}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E75B6] min-h-[100px]"
                  placeholder="Describa el motivo del reverso..."
                />
              </div>

              <div>
                <Label htmlFor="usuario">Usuario Autorizador</Label>
                <Input
                  id="usuario"
                  value={reversoData.usuario}
                  disabled
                  className="bg-gray-100 text-gray-600"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowReversoModal(false)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                handleAplicarReverso();
                setShowReversoModal(false);
              }}
              disabled={!reversoData.motivo}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Reverso
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Servicios REST */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600 font-medium">Servicio REST:</p>
        <ul className="text-xs text-red-600 mt-2 space-y-1">
          <li>GET /api/v1/transacciones/&#123;uuidTransaccion&#125;</li>
          <li>POST /api/v1/transacciones/&#123;uuidTransaccion&#125;/reverso</li>
        </ul>
      </div>
    </div>
  );
}
