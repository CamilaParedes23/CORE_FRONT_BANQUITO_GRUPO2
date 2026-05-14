import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { TransaccionService, generarUuidTransaccion } from '../../services/transaccionService';

interface TransaccionCreditoProps {
  navigate: (screen: string) => void;
}

export default function TransaccionCredito({ navigate }: TransaccionCreditoProps) {
  const [formData, setFormData] = useState({
    cuentaOrigen: '',
    cuentaDestino: '',
    subtipo: 'DEPOSITO_VENTANILLA',
    monto: '',
    descripcion: '',
  });

  const [ejecutando, setEjecutando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{
    estado: string;
    uuidCredito: string;
    saldoDisponible: number;
  } | null>(null);

  // ── Validaciones ──────────────────────────────────────────────────────────

  const validar = (): boolean => {
    const nuevos: Record<string, string> = {};

    if (!formData.cuentaOrigen.trim()) {
      nuevos.cuentaOrigen = 'La cuenta origen es obligatoria.';
    }
    if (!formData.cuentaDestino.trim()) {
      nuevos.cuentaDestino = 'La cuenta a acreditar es obligatoria.';
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
        uuidCredito: String(resp.uuidCreditoCore),
        saldoDisponible: Number(resp.saldoDisponibleOrigen),
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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Crédito Manual</h1>
        <p className="text-gray-600">Acreditar fondos en una cuenta</p>
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
              <p className="text-sm font-semibold text-green-800 mb-2">✅ Crédito ejecutado exitosamente</p>
              <div className="space-y-1 text-sm text-green-700">
                <p><span className="font-medium">Estado:</span> {resultado.estado}</p>
                <p><span className="font-medium">UUID Crédito:</span> <span className="font-mono text-xs">{resultado.uuidCredito}</span></p>
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
              <Label>Cuenta Origen *</Label>
              <Input
                value={formData.cuentaOrigen}
                onChange={(e) => {
                  setFormData({ ...formData, cuentaOrigen: e.target.value });
                  setErrores((prev) => ({ ...prev, cuentaOrigen: '' }));
                }}
                placeholder="Número de cuenta origen activa"
                className={`mt-2 ${errores.cuentaOrigen ? 'border-red-400' : ''}`}
              />
              {errores.cuentaOrigen && <p className="text-xs text-red-600 mt-1">{errores.cuentaOrigen}</p>}
            </div>

            <div>
              <Label>Cuenta a Acreditar (Destino) *</Label>
              <Input
                value={formData.cuentaDestino}
                onChange={(e) => {
                  setFormData({ ...formData, cuentaDestino: e.target.value });
                  setErrores((prev) => ({ ...prev, cuentaDestino: '' }));
                }}
                placeholder="Ej: BQCENTRO000001001"
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
                <option value="DEPOSITO_VENTANILLA">Depósito por Ventanilla</option>
                <option value="ABONO_NOMINA">Abono de Nómina</option>
                <option value="TRANSFERENCIA_RECIBIDA">Transferencia Recibida</option>
                <option value="INGRESO_SERVICIO_MASIVO">Ingreso Servicio Masivo</option>
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
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {ejecutando ? 'Ejecutando...' : 'Ejecutar Crédito'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
