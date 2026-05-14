import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { TransaccionService, generarUuidTransaccion } from '../../services/transaccionService';

interface TransaccionDebitoProps {
  navigate: (screen: string) => void;
}

export default function TransaccionDebito({ navigate }: TransaccionDebitoProps) {
  const [formData, setFormData] = useState({
    cuentaOrigen: '',
    cuentaDestino: '',
    subtipo: 'RETIRO_CAJERO',
    monto: '',
    descripcion: '',
  });

  const [ejecutando, setEjecutando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{
    estado: string;
    uuidDebito: string;
    saldoDisponible: number;
  } | null>(null);

  // ── Validaciones ──────────────────────────────────────────────────────────

  const validar = (): boolean => {
    const nuevos: Record<string, string> = {};

    if (!formData.cuentaOrigen.trim()) {
      nuevos.cuentaOrigen = 'La cuenta a debitar es obligatoria.';
    }
    if (!formData.cuentaDestino.trim()) {
      nuevos.cuentaDestino = 'La cuenta destino es obligatoria.';
    }
    if (formData.cuentaOrigen.trim() === formData.cuentaDestino.trim() && formData.cuentaOrigen.trim()) {
      nuevos.cuentaDestino = 'La cuenta destino no puede ser la misma que la cuenta origen.';
    }
    if (!formData.monto.trim() || isNaN(Number(formData.monto)) || Number(formData.monto) <= 0) {
      nuevos.monto = 'Ingrese un monto válido mayor a 0.';
    }
    if (!formData.subtipo) {
      nuevos.subtipo = 'Seleccione el subtipo de transacción.';
    }

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);
    setResultado(null);

    if (!validar()) return;

    setEjecutando(true);
    try {
      const resp = await TransaccionService.transferir({
        uuidOperacion: generarUuidTransaccion() as any,
        cuentaOrigen: formData.cuentaOrigen.trim(),
        cuentaDestino: formData.cuentaDestino.trim(),
        monto: Number(formData.monto) as any,
        codigoSubtipo: formData.subtipo,
        descripcion: formData.descripcion.trim() || undefined,
      });

      setResultado({
        estado: resp.estado,
        uuidDebito: String(resp.uuidDebitoCore),
        saldoDisponible: Number(resp.saldoDisponibleOrigen),
      });

      // Limpiar formulario tras éxito
      setFormData({ cuentaOrigen: '', cuentaDestino: '', subtipo: 'RETIRO_CAJERO', monto: '', descripcion: '' });
    } catch (err: any) {
      setErrorGeneral(
        err?.statusText || err?.message || 'No se pudo ejecutar el débito. Verifique las cuentas y el saldo disponible.'
      );
    } finally {
      setEjecutando(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Débito Manual</h1>
        <p className="text-gray-600">Ejecutar un débito (retiro) en una cuenta</p>
      </div>

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

          {resultado && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-800 mb-2">✅ Débito ejecutado exitosamente</p>
              <div className="space-y-1 text-sm text-green-700">
                <p><span className="font-medium">Estado:</span> {resultado.estado}</p>
                <p><span className="font-medium">UUID Débito:</span> <span className="font-mono text-xs">{resultado.uuidDebito}</span></p>
                <p><span className="font-medium">Saldo disponible origen:</span> ${resultado.saldoDisponible.toFixed(2)}</p>
              </div>
            </div>
          )}

          {errorGeneral && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              ⚠️ {errorGeneral}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Cuenta a Debitar (Origen) *</Label>
              <Input
                value={formData.cuentaOrigen}
                onChange={(e) => {
                  setFormData({ ...formData, cuentaOrigen: e.target.value });
                  setErrores((prev) => ({ ...prev, cuentaOrigen: '' }));
                }}
                placeholder="Ej: BQCENTRO000001001"
                className={`mt-2 ${errores.cuentaOrigen ? 'border-red-400' : ''}`}
              />
              {errores.cuentaOrigen && <p className="text-xs text-red-600 mt-1">{errores.cuentaOrigen}</p>}
            </div>

            <div>
              <Label>Cuenta Receptora (Destino) *</Label>
              <Input
                value={formData.cuentaDestino}
                onChange={(e) => {
                  setFormData({ ...formData, cuentaDestino: e.target.value });
                  setErrores((prev) => ({ ...prev, cuentaDestino: '' }));
                }}
                placeholder="Número de cuenta destino activa"
                className={`mt-2 ${errores.cuentaDestino ? 'border-red-400' : ''}`}
              />
              {errores.cuentaDestino && <p className="text-xs text-red-600 mt-1">{errores.cuentaDestino}</p>}
            </div>

            <div>
              <Label>Subtipo de Transacción *</Label>
              <select
                value={formData.subtipo}
                onChange={(e) => {
                  setFormData({ ...formData, subtipo: e.target.value });
                  setErrores((prev) => ({ ...prev, subtipo: '' }));
                }}
                className={`w-full mt-2 px-3 py-2 border rounded-lg ${errores.subtipo ? 'border-red-400' : ''}`}
              >
                <option value="RETIRO_CAJERO">Retiro por Cajero</option>
                <option value="PAGO_MASIVO">Pago Masivo</option>
                <option value="COMPRA_COMERCIO">Compra en Comercio</option>
                <option value="COBRO_COMISION">Cobro de Comisión</option>
                <option value="PAGO_IMPUESTO">Pago de Impuesto</option>
                <option value="TRANSFERENCIA_SALIDA">Transferencia Salida</option>
              </select>
              {errores.subtipo && <p className="text-xs text-red-600 mt-1">{errores.subtipo}</p>}
            </div>

            <div>
              <Label>Monto *</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.monto}
                onChange={(e) => {
                  setFormData({ ...formData, monto: e.target.value });
                  setErrores((prev) => ({ ...prev, monto: '' }));
                }}
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
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                disabled={ejecutando}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={ejecutando}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {ejecutando ? 'Ejecutando...' : 'Ejecutar Débito'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
