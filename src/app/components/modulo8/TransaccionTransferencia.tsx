import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { TransaccionService, generarUuidTransaccion } from '../../services/transaccionService';

interface TransaccionTransferenciaProps {
  navigate: (screen: string) => void;
}

function generarNumComprobante(uuid: string): string {
  const raw = uuid?.replace(/-/g, '') ?? '';
  return `TRF-${raw.slice(-8).toUpperCase()}`;
}

function formatFechaHora(d: Date): string {
  return d.toLocaleString('es-EC', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function TransaccionTransferencia({ navigate }: TransaccionTransferenciaProps) {
  const [formData, setFormData] = useState({
    cuentaOrigen: '',
    cuentaDestino: '',
    monto: '',
    subtipo: 'TRF_INTERNA',
    descripcion: '',
  });

  const [ejecutando, setEjecutando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [comprobante, setComprobante] = useState<{
    numero: string;
    fechaHora: string;
    cuentaOrigen: string;
    cuentaDestino: string;
    monto: number;
    comision: number;
    descripcion: string;
    saldoDisponible: number;
    uuid: string;
  } | null>(null);

  const validar = (): boolean => {
    const nuevos: Record<string, string> = {};
    if (!formData.cuentaOrigen.trim()) nuevos.cuentaOrigen = 'La cuenta origen es obligatoria.';
    if (!formData.cuentaDestino.trim()) nuevos.cuentaDestino = 'La cuenta destino es obligatoria.';
    if (formData.cuentaOrigen.trim() === formData.cuentaDestino.trim() && formData.cuentaOrigen.trim())
      nuevos.cuentaDestino = 'Las cuentas origen y destino no pueden ser las mismas.';
    if (!formData.monto.trim() || isNaN(Number(formData.monto)) || Number(formData.monto) <= 0)
      nuevos.monto = 'Ingrese un monto válido mayor a 0.';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);
    setComprobante(null);
    if (!validar()) return;

    setEjecutando(true);
    const snap = { ...formData };
    try {
      const resp = await TransaccionService.transferir({
        uuidOperacion: generarUuidTransaccion() as any,
        cuentaOrigen: formData.cuentaOrigen.trim(),
        cuentaDestino: formData.cuentaDestino.trim(),
        monto: Number(formData.monto) as any,
        codigoSubtipo: formData.subtipo,
        descripcion: formData.descripcion.trim() || undefined,
      });

      const uuid = String(resp.uuidGrupoOperacion);
      setComprobante({
        numero: generarNumComprobante(uuid),
        fechaHora: formatFechaHora(new Date()),
        cuentaOrigen: snap.cuentaOrigen.trim(),
        cuentaDestino: snap.cuentaDestino.trim(),
        monto: Number(snap.monto),
        comision: 0,
        descripcion: snap.descripcion.trim(),
        saldoDisponible: Number(resp.saldoDisponibleOrigen),
        uuid,
      });

      setFormData({ cuentaOrigen: '', cuentaDestino: '', monto: '', subtipo: 'TRF_INTERNA', descripcion: '' });
    } catch (err: any) {
      setErrorGeneral(
        err?.statusText || err?.message || 'No se pudo ejecutar la transferencia. Verifique las cuentas y el saldo.'
      );
    } finally {
      setEjecutando(false);
    }
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Transferencia Interna</h1>
        <p className="text-gray-600">Transferir fondos entre cuentas BanQuito</p>
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
              <p className="text-blue-200 text-sm">Comprobante de Transferencia</p>
            </div>

            <div className="bg-blue-50 border-b border-blue-100 px-6 py-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">N° Comprobante</p>
              <p className="text-2xl font-bold text-[#0D1B4B] font-mono">{comprobante.numero}</p>
              <p className="text-xs text-gray-400 mt-1">{comprobante.fechaHora}</p>
            </div>

            <div className="px-6 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Cuenta Origen</span>
                <span className="font-mono font-medium text-gray-800">{comprobante.cuentaOrigen}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Cuenta Destino</span>
                <span className="font-mono font-medium text-gray-800">{comprobante.cuentaDestino}</span>
              </div>
              {comprobante.descripcion && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Descripción</span>
                  <span className="font-medium text-gray-800 text-right max-w-[55%]">{comprobante.descripcion}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Monto Transferido</span>
                <span className="text-2xl font-bold text-[#0D1B4B]">${comprobante.monto.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-gray-500">Comisión</span>
                <span className="font-semibold text-gray-700">${comprobante.comision.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-gray-500">Saldo disponible origen</span>
                <span className="font-semibold text-gray-700">${comprobante.saldoDisponible.toFixed(2)}</span>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setComprobante(null)}
                className="flex-1 py-2.5 border-2 border-[#0D1B4B] text-[#0D1B4B] rounded-lg font-semibold hover:bg-[#0D1B4B]/5 transition-colors"
              >
                Nueva Transferencia
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
          <CardTitle className="text-[#0D1B4B]">Datos de la Transferencia</CardTitle>
        </CardHeader>
        <CardContent>
          {errorGeneral && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              ⚠️ {errorGeneral}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cuenta Origen *</Label>
                <Input
                  value={formData.cuentaOrigen}
                  onChange={(e) => { setFormData({ ...formData, cuentaOrigen: e.target.value }); setErrores((p) => ({ ...p, cuentaOrigen: '' })); }}
                  placeholder="Número de cuenta origen"
                  className={`mt-2 ${errores.cuentaOrigen ? 'border-red-400' : ''}`}
                />
                {errores.cuentaOrigen && <p className="text-xs text-red-600 mt-1">{errores.cuentaOrigen}</p>}
              </div>
              <div>
                <Label>Cuenta Destino *</Label>
                <Input
                  value={formData.cuentaDestino}
                  onChange={(e) => { setFormData({ ...formData, cuentaDestino: e.target.value }); setErrores((p) => ({ ...p, cuentaDestino: '' })); }}
                  placeholder="Número de cuenta destino"
                  className={`mt-2 ${errores.cuentaDestino ? 'border-red-400' : ''}`}
                />
                {errores.cuentaDestino && <p className="text-xs text-red-600 mt-1">{errores.cuentaDestino}</p>}
              </div>
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
              <Label>Tipo de Transferencia</Label>
              <select
                value={formData.subtipo}
                onChange={(e) => setFormData({ ...formData, subtipo: e.target.value })}
                className="w-full mt-2 px-3 py-2 border rounded-lg"
              >
                <option value="TRF_INTERNA">Transferencia Interna BanQuito</option>
                <option value="RET_EFECTIVO">Retiro en Efectivo</option>
                <option value="COM_MANTENIMIENTO">Cobro de Comisión</option>
              </select>
            </div>

            <div>
              <Label>Descripción</Label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full mt-2 px-3 py-2 border rounded-lg min-h-[80px]"
                placeholder="Descripción de la transferencia..."
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button type="button" onClick={() => navigate('dashboard')} disabled={ejecutando}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50">
                Cancelar
              </button>
              <button type="submit" disabled={ejecutando}
                className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] disabled:opacity-50">
                {ejecutando ? 'Ejecutando...' : 'Ejecutar Transferencia'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
