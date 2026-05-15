import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RefreshCw } from 'lucide-react';
import { CuentaService } from '../../services/cuentaService';
import { TransaccionService } from '../../services/transaccionService';
import { ClienteService } from '../../services/clienteService';
import { SucursalService } from '../../services/sucursalService';
import type { CuentaResponse, SaldoResponse, CambioEstadoData, BloqueoData } from '../../services/cuentaService';
import type { MovimientoCuentaResponse } from '../../services/transaccionService';
import type { ClienteResponse } from '../../services/clienteService';
import type { SucursalResponse } from '../../services/sucursalService';
import { useAuth } from '../../context/AuthContext';

interface CuentaFichaProps {
  navigate: (screen: string, id?: string) => void;
  numeroCuenta: string | null;
}

export default function CuentaFicha({ navigate, numeroCuenta }: CuentaFichaProps) {
  const { hasRole, user } = useAuth();
  const [cuenta, setCuenta] = useState<CuentaResponse | null>(null);
  const [saldo, setSaldo] = useState<SaldoResponse | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoCuentaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cliente, setCliente] = useState<ClienteResponse | null>(null);
  const [sucursal, setSucursal] = useState<SucursalResponse | null>(null);

  // Estados para modales
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [showBloqueoModal, setShowBloqueoModal] = useState(false);
  const [estadoFormData, setEstadoFormData] = useState({
    nuevoEstado: 'ACTIVA' as 'ACTIVA' | 'INACTIVA' | 'BLOQUEADA' | 'SUSPENDIDA',
    motivoCambio: '',
  });
  const [bloqueoFormData, setBloqueoFormData] = useState({
    montoBloqueado: '',
    motivo: 'PREVIO_PAGO' as 'JUDICIAL' | 'PREVIO_PAGO' | 'GARANTIA',
    referenciaExterna: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formErrores, setFormErrores] = useState<Record<string, string>>({});

  const cargarMovimientos = async (num: string) => {
    setLoadingMovimientos(true);
    try {
      const movs = await TransaccionService.obtenerMovimientosPorCuenta(num);
      setMovimientos(movs);
    } catch {
      setMovimientos([]);
    } finally {
      setLoadingMovimientos(false);
    }
  };

  useEffect(() => {
    if (!numeroCuenta) return;
    setLoading(true);
    setError(null);

    Promise.all([
      CuentaService.obtenerPorNumero(numeroCuenta),
      CuentaService.obtenerSaldo(numeroCuenta),
    ])
      .then(([cuentaData, saldoData]) => {
        setCuenta(cuentaData);
        setSaldo(saldoData);
        cargarMovimientos(numeroCuenta);

        // Cargar cliente y sucursal
        if (cuentaData.clienteId) {
          ClienteService.obtenerPorId(cuentaData.clienteId)
            .then(setCliente)
            .catch(() => {});
        }
        if (cuentaData.sucursalId) {
          SucursalService.obtenerPorId(cuentaData.sucursalId)
            .then(setSucursal)
            .catch(() => {});
        }
      })
      .catch(err => setError(err.message || 'Error al cargar datos de la cuenta'))
      .finally(() => setLoading(false));
  }, [numeroCuenta]);

  if (loading) {
    return (
      <div className="p-8 bg-[#F5F7FA] min-h-full flex items-center justify-center">
        <p className="text-gray-500">Cargando datos de la cuenta...</p>
      </div>
    );
  }

  if (error || !cuenta) {
    return (
      <div className="p-8 bg-[#F5F7FA] min-h-full">
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-800">
          ⚠️ {error || 'Cuenta no encontrada'}
        </div>
        <button
          onClick={() => navigate('cuentas')}
          className="mt-4 px-4 py-2 bg-[#0D1B4B] text-white rounded-lg"
        >
          Volver a Cuentas
        </button>
      </div>
    );
  }

  const saldoContable = saldo ? Number(saldo.saldoContable) : Number(cuenta.saldoContable);
  const saldoDisponible = saldo ? Number(saldo.saldoDisponible) : Number(cuenta.saldoDisponible);
  const totalBloqueado = saldoContable - saldoDisponible;

  // Handlers para modales
  const handleAbrirEstadoModal = () => {
    if (!cuenta) return;
    const opciones = ['ACTIVA', 'INACTIVA', 'BLOQUEADA', 'SUSPENDIDA'] as const;
    const siguiente = opciones.find(e => e !== cuenta.estado) || 'INACTIVA';
    setEstadoFormData({
      nuevoEstado: siguiente,
      motivoCambio: '',
    });
    setFormErrores({});
    setShowEstadoModal(true);
  };

  const handleGuardarEstado = async () => {
    if (!cuenta) return;

    const nuevosErrores: Record<string, string> = {};
    if (!estadoFormData.motivoCambio.trim()) nuevosErrores.motivoCambio = 'El motivo es obligatorio.';

    if (Object.keys(nuevosErrores).length > 0) {
      setFormErrores(nuevosErrores);
      return;
    }

    setSubmitting(true);
    try {
      const data: CambioEstadoData = {
        nuevoEstado: estadoFormData.nuevoEstado,
        motivoCambio: estadoFormData.motivoCambio.trim(),
        usuarioCoreId: typeof user?.id === 'number' ? user.id : parseInt(user?.id || '1'),
      };
      const actualizada = await CuentaService.cambiarEstado(cuenta.id, data);
      setCuenta(actualizada);
      setShowEstadoModal(false);
      // Recargar saldo
      if (numeroCuenta) {
        const saldoData = await CuentaService.obtenerSaldo(numeroCuenta);
        setSaldo(saldoData);
      }
    } catch (err: any) {
      setFormErrores({ general: err.message || 'Error al cambiar estado' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAbrirBloqueoModal = () => {
    setBloqueoFormData({
      montoBloqueado: '',
      motivo: 'PREVIO_PAGO',
      referenciaExterna: '',
    });
    setFormErrores({});
    setShowBloqueoModal(true);
  };

  const handleGuardarBloqueo = async () => {
    if (!cuenta) return;

    const nuevosErrores: Record<string, string> = {};
    if (!bloqueoFormData.montoBloqueado.trim()) nuevosErrores.montoBloqueado = 'El monto es obligatorio.';
    else if (isNaN(Number(bloqueoFormData.montoBloqueado)) || Number(bloqueoFormData.montoBloqueado) <= 0) {
      nuevosErrores.montoBloqueado = 'Ingrese un monto válido mayor a 0.';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setFormErrores(nuevosErrores);
      return;
    }

    setSubmitting(true);
    try {
      const data: BloqueoData = {
        montoBloqueado: Number(bloqueoFormData.montoBloqueado),
        motivo: bloqueoFormData.motivo,
        referenciaExterna: bloqueoFormData.referenciaExterna.trim() || undefined,
        usuarioCoreId: typeof user?.id === 'number' ? user.id : parseInt(user?.id || '1'),
      };
      await CuentaService.crearBloqueo(cuenta.id, data);
      setShowBloqueoModal(false);
      // Recargar saldo
      if (numeroCuenta) {
        const saldoData = await CuentaService.obtenerSaldo(numeroCuenta);
        setSaldo(saldoData);
      }
    } catch (err: any) {
      setFormErrores({ general: err.message || 'Error al crear bloqueo' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Ficha de Cuenta</h1>
        <p className="text-gray-600">Información detallada de la cuenta {cuenta.numeroCuenta}</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-[#0D1B4B]">Cuenta {cuenta.numeroCuenta}</CardTitle>
              <p className="text-gray-600 mt-1">Cliente: {cliente?.nombreVisual || 'Cargando...'} | Sucursal: {sucursal?.nombre || 'Cargando...'}</p>
            </div>
            <Badge className={String(cuenta.estado) === 'ACTIVA' ? 'bg-green-600' : 'bg-orange-600'}>
              {String(cuenta.estado)}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-2">Saldo Contable</p>
            <p className="text-3xl font-bold text-[#0D1B4B]">${saldoContable.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-2">Total Bloqueado</p>
            <p className="text-3xl font-bold text-orange-600">${totalBloqueado.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Saldo Disponible</p>
              <RefreshCw
                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => numeroCuenta && cargarMovimientos(numeroCuenta)}
              />
            </div>
            <p className="text-3xl font-bold text-green-600">${saldoDisponible.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="saldo">
        <TabsList className="mb-6">
          <TabsTrigger value="saldo">Saldo y Bloqueos</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
        </TabsList>

        <TabsContent value="saldo">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0D1B4B]">Información de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">ID Subtipo Cuenta</p>
                  <p className="font-medium">{cuenta.subtipoCuentaId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Permite Sobregiro</p>
                  <p className="font-medium">{cuenta.permiteSobregiro ? 'Sí' : 'No'}</p>
                </div>
                {cuenta.permiteSobregiro && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Límite de Sobregiro</p>
                    <p className="font-medium">${Number(cuenta.limiteSobregiro).toFixed(2)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cuenta Favorita Pagos</p>
                  <p className="font-medium">{cuenta.esFavoritaPagos ? 'Sí' : 'No'}</p>
                </div>
                {saldo && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Permite Débito</p>
                    <p className="font-medium">{saldo.permiteDebito ? 'Sí' : 'No'}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button onClick={handleAbrirEstadoModal} className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  Cambiar Estado
                </button>
                {hasRole(['ADMIN_CORE']) && (
                  <button onClick={handleAbrirBloqueoModal} className="px-6 py-2 bg-[#C9A84C] text-[#0D1B4B] rounded-lg hover:bg-[#b89640]">
                    Agregar Bloqueo
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movimientos">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0D1B4B]">Movimientos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMovimientos ? (
                <p className="text-gray-500 py-4">Cargando movimientos...</p>
              ) : movimientos.length === 0 ? (
                <p className="text-gray-500 py-4">No hay movimientos registrados para esta cuenta</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Fecha</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tipo</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Monto</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Saldo Resultante</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movimientos.map((mov) => (
                        <tr key={mov.uuidTransaccion} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">
                            {new Date(mov.fechaTransaccion).toLocaleString('es-EC')}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className={mov.tipoMovimiento === 'DEBITO' ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                              {mov.tipoMovimiento}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">
                            ${Number(mov.monto).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            ${Number(mov.saldoResultante).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{mov.descripcion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Cambiar Estado */}
      <Dialog open={showEstadoModal} onOpenChange={setShowEstadoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#0D1B4B]">Cambiar Estado de la Cuenta</DialogTitle>
            <DialogDescription>
              Estado actual: <strong>{cuenta?.estado}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Nuevo Estado *</Label>
              <select
                value={estadoFormData.nuevoEstado}
                onChange={(e) => {
                  setEstadoFormData({ ...estadoFormData, nuevoEstado: e.target.value as any });
                  setFormErrores((prev) => ({ ...prev, nuevoEstado: '' }));
                }}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D1B4B]/40"
              >
                {['ACTIVA', 'INACTIVA', 'BLOQUEADA', 'SUSPENDIDA']
                  .filter(e => e !== cuenta?.estado)
                  .map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))
                }
              </select>
            </div>
            <div>
              <Label>Motivo *</Label>
              <Input
                value={estadoFormData.motivoCambio}
                onChange={(e) => {
                  setEstadoFormData({ ...estadoFormData, motivoCambio: e.target.value });
                  setFormErrores((prev) => ({ ...prev, motivoCambio: '' }));
                }}
                className={`mt-2 ${formErrores.motivoCambio ? 'border-red-400' : ''}`}
                placeholder="Ingrese el motivo del cambio de estado"
              />
              {formErrores.motivoCambio && <p className="text-xs text-red-600 mt-1">{formErrores.motivoCambio}</p>}
            </div>
            {formErrores.general && <p className="text-xs text-red-600 mt-2">{formErrores.general}</p>}
          </div>
          <DialogFooter className="mt-4">
            <button
              onClick={() => setShowEstadoModal(false)}
              disabled={submitting}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardarEstado}
              disabled={submitting}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Confirmar Cambio'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Agregar Bloqueo */}
      <Dialog open={showBloqueoModal} onOpenChange={setShowBloqueoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#0D1B4B]">Agregar Bloqueo</DialogTitle>
            <DialogDescription>
              Bloquear monto del saldo disponible de la cuenta
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Monto a Bloquear *</Label>
              <Input
                type="number"
                value={bloqueoFormData.montoBloqueado}
                onChange={(e) => {
                  setBloqueoFormData({ ...bloqueoFormData, montoBloqueado: e.target.value });
                  setFormErrores((prev) => ({ ...prev, montoBloqueado: '' }));
                }}
                className={`mt-2 ${formErrores.montoBloqueado ? 'border-red-400' : ''}`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {formErrores.montoBloqueado && <p className="text-xs text-red-600 mt-1">{formErrores.montoBloqueado}</p>}
            </div>
            <div>
              <Label>Motivo del Bloqueo *</Label>
              <select
                value={bloqueoFormData.motivo}
                onChange={(e) => {
                  setBloqueoFormData({ ...bloqueoFormData, motivo: e.target.value as any });
                  setFormErrores((prev) => ({ ...prev, motivo: '' }));
                }}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D1B4B]/40"
              >
                <option value="PREVIO_PAGO">Previo a Pago</option>
                <option value="JUDICIAL">Judicial</option>
                <option value="GARANTIA">Garantía</option>
              </select>
            </div>
            <div>
              <Label>Referencia Externa (Opcional)</Label>
              <Input
                value={bloqueoFormData.referenciaExterna}
                onChange={(e) => {
                  setBloqueoFormData({ ...bloqueoFormData, referenciaExterna: e.target.value });
                }}
                className="mt-2"
                placeholder="Número de referencia externa"
              />
            </div>
            {formErrores.general && <p className="text-xs text-red-600 mt-2">{formErrores.general}</p>}
          </div>
          <DialogFooter className="mt-4">
            <button
              onClick={() => setShowBloqueoModal(false)}
              disabled={submitting}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardarBloqueo}
              disabled={submitting}
              className="px-4 py-2 bg-[#C9A84C] text-[#0D1B4B] rounded-lg hover:bg-[#b89640] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Crear Bloqueo'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
