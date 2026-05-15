import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { TransaccionService, generarUuidTransaccion } from '../../services/transaccionService';

interface TransaccionCreditoProps {
  navigate: (screen: string) => void;
}

function generarNumComprobante(uuid: string): string {
  const raw = uuid?.replace(/-/g, '') ?? '';
  return `CRE-${raw.slice(-8).toUpperCase()}`;
}

function formatFechaHora(d: Date): string {
  return d.toLocaleString('es-EC', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function TransaccionCredito({ navigate }: TransaccionCreditoProps) {
  const [formData, setFormData] = useState({
    cuentaOrigen: '',
    cuentaDestino: '',
    subtipo: 'DEP_EFECTIVO',
    monto: '',
    descripcion: '',
  });

  const [ejecutando, setEjecutando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [comprobante, setComprobante] = useState<{
    numero: string;
    fechaHora: string;
    cuentaAcreditada: string;
    monto: number;
    subtipo: string;
    descripcion: string;
    uuid: string;
  } | null>(null);

  const validar = (): boolean => {
    const nuevos: Record<string, string> = {};
    if (!formData.cuentaOrigen.trim()) nuevos.cuentaOrigen = 'La cuenta origen es obligatoria.';
    if (!formData.cuentaDestino.trim()) nuevos.cuentaDestino = 'La cuenta a acreditar es obligatoria.';
    if (formData.cuentaOrigen.trim() === formData.cuentaDestino.trim() && formData.cuentaOrigen.trim())
      nuevos.cuentaDestino = 'La cuenta destino no puede ser la misma que la cuenta origen.';
    if (!formData.monto.trim() || isNaN(Number(formData.monto)) || Number(formData.monto) <= 0)
      nuevos.monto = 'Ingrese un monto válido mayor a 0.';
    if (!formData.subtipo) nuevos.subtipo = 'Seleccione el subtipo de transacción.';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);
    setComprobante(null);
    if (!validar()) return;

    setEjecutando(true);
    const snapshotFormData = { ...formData };
    try {
      const resp = await TransaccionService.transferir({
        uuidOperacion: generarUuidTransaccion() as any,
        cuentaOrigen: formData.cuentaOrigen.trim(),
        cuentaDestino: formData.cuentaDestino.trim(),
        monto: Number(formData.monto) as any,
        codigoSubtipo: formData.subtipo,
        descripcion: formData.descripcion.trim() || undefined,
      });

      const uuid = String(resp.uuidCreditoCore);
      setComprobante({
        numero: generarNumComprobante(uuid),
        fechaHora: formatFechaHora(new Date()),
        cuentaAcreditada: snapshotFormData.cuentaDestino.trim(),
        monto: Number(snapshotFormData.monto),
        subtipo: snapshotFormData.subtipo,
        descripcion: snapshotFormData.descripcion.trim(),
        uuid,
      });

      setFormData({ cuentaOrigen: '', cuentaDestino: '', subtipo: 'DEPOSITO_VENTANILLA', monto: '', descripcion: '' });
    } catch (err: any) {
      setErrorGeneral(
        err?.statusText || err?.message || 'No se pudo ejecutar el crédito. Verifique las cuentas e intente de nuevo.'
      );
    } finally {
      setEjecutando(false);
    }
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Crédito Manual</h1>
        <p className="text-gray-600">Acreditar fondos en una cuenta</p>
      </div>

      {/* ── MODAL COMPROBANTE ── */}
      {comprobante && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-[#0D1B4B] px-6 py-5 text-center">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🏦</span>
              </div>
              <h2 className="text-white text-xl font-bold">BanQuito</h2>
              <p className="text-blue-200 text-sm">Comprobante de Crédito</p>
            </div>

            <div className="bg-green-50 border-b border-green-100 px-6 py-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">N° Comprobante</p>
              <p className="text-2xl font-bold text-green-700 font-mono">{comprobante.numero}</p>
              <p className="text-xs text-gray-400 mt-1">{comprobante.fechaHora}</p>
            </div>

            <div className="px-6 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tipo</span>
                <span className="font-medium text-gray-800">{comprobante.subtipo.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Cuenta Acreditada</span>
                <span className="font-mono font-medium text-gray-800">{comprobante.cuentaAcreditada}</span>
              </div>
              {comprobante.descripcion && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Descripción</span>
                  <span className="font-medium text-gray-800 text-right max-w-[55%]">{comprobante.descripcion}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Monto Acreditado</span>
                <span className="text-2xl font-bold text-green-600">+ ${comprobante.monto.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-300 text-center font-mono break-all">{comprobante.uuid}</p>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setComprobante(null)}
                className="flex-1 py-2.5 border-2 border-[#0D1B4B] text-[#0D1B4B] rounded-lg font-semibold hover:bg-[#0D1B4B]/5 transition-colors"
              >
                Nueva Operación
              </button>
              <button
                onClick={() => navigate('dashboard')}
                className="flex-1 py-2.5 bg-[#0D1B4B] text-white rounded-lg font-semibold hover:bg-[#1a2d6b] transition-colors"
              >
                Ir al Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#0D1B4B]">Datos de la Transacción</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-700 text-sm">
              El sistema genera automáticamente el UUID de operación y la clave de idempotencia.
              Ambas cuentas deben estar <strong>ACTIVAS</strong> en el sistema.
            </AlertDescription>
          </Alert>

          {errorGeneral && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              ⚠️ {errorGeneral}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Cuenta Origen *</Label>
              <Input
                value={formData.cuentaOrigen}
                onChange={(e) => { setFormData({ ...formData, cuentaOrigen: e.target.value }); setErrores((p) => ({ ...p, cuentaOrigen: '' })); }}
                placeholder="Número de cuenta origen activa"
                className={`mt-2 ${errores.cuentaOrigen ? 'border-red-400' : ''}`}
              />
              {errores.cuentaOrigen && <p className="text-xs text-red-600 mt-1">{errores.cuentaOrigen}</p>}
            </div>

            <div>
              <Label>Cuenta a Acreditar (Destino) *</Label>
              <Input
                value={formData.cuentaDestino}
                onChange={(e) => { setFormData({ ...formData, cuentaDestino: e.target.value }); setErrores((p) => ({ ...p, cuentaDestino: '' })); }}
                placeholder="Ej: 0010000000001"
                className={`mt-2 ${errores.cuentaDestino ? 'border-red-400' : ''}`}
              />
              {errores.cuentaDestino && <p className="text-xs text-red-600 mt-1">{errores.cuentaDestino}</p>}
            </div>

            <div>
              <Label>Subtipo de Transacción *</Label>
              <select
                value={formData.subtipo}
                onChange={(e) => { setFormData({ ...formData, subtipo: e.target.value }); setErrores((p) => ({ ...p, subtipo: '' })); }}
                className={`w-full mt-2 px-3 py-2 border rounded-lg ${errores.subtipo ? 'border-red-400' : ''}`}
              >
                <option value="DEP_EFECTIVO">Depósito en Efectivo</option>
                <option value="ABONO_NOMINA">Abono de Nómina</option>
                <option value="TRANSFERENCIA_RECIBIDA">Transferencia Recibida</option>
                <option value="INGRESO_SERVICIO_MASIVO">Ingreso Servicio Masivo</option>
              </select>
              {errores.subtipo && <p className="text-xs text-red-600 mt-1">{errores.subtipo}</p>}
            </div>

            <div>
              <Label>Monto *</Label>
              <Input
                type="number" step="0.01" min="0.01"
                value={formData.monto}
                onChange={(e) => { setFormData({ ...formData, monto: e.target.value }); setErrores((p) => ({ ...p, monto: '' })); }}
                placeholder="0.00"
                className={`mt-2 ${errores.monto ? 'border-red-400' : ''}`}
              />
              {errores.monto && <p className="text-xs text-red-600 mt-1">{errores.monto}</p>}
            </div>

            <div>
              <Label>Descripción</Label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full mt-2 px-3 py-2 border rounded-lg min-h-[80px]"
                placeholder="Descripción de la transacción..."
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button type="button" onClick={() => navigate('dashboard')} disabled={ejecutando}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50">
                Cancelar
              </button>
              <button type="submit" disabled={ejecutando}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                {ejecutando ? 'Ejecutando...' : 'Ejecutar Crédito'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
