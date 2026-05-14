import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Search } from 'lucide-react';
import { ClienteService } from '../../services/clienteService';
import type { ClienteResponse } from '../../services/clienteService';
import { CuentaService } from '../../services/cuentaService';
import { SucursalService } from '../../services/sucursalService';
import type { SucursalResponse } from '../../services/sucursalService';

interface CuentaAperturaFormProps {
  navigate: (screen: string, id?: string) => void;
}

// SubtiposCuenta del backend (SUBTIPO_CUENTA table):
// 1 = AHO_STD — Cuenta de Ahorros Estándar
// 2 = CTE_STD — Cuenta Corriente Estándar
// 3 = NOM_STD — Cuenta de Nómina
const SUBTIPOS_CUENTA = [
  { id: 1, nombre: 'Cuenta de Ahorros Estándar (AHO_STD)' },
  { id: 2, nombre: 'Cuenta Corriente Estándar (CTE_STD)' },
  { id: 3, nombre: 'Cuenta de Nómina (NOM_STD)' },
];

export default function CuentaAperturaForm({ navigate }: CuentaAperturaFormProps) {
  const [identificacion, setIdentificacion] = useState('');
  const [buscandoCliente, setBuscandoCliente] = useState(false);
  const [clienteEncontrado, setClienteEncontrado] = useState<ClienteResponse | null>(null);
  const [errorCliente, setErrorCliente] = useState<string | null>(null);

  const [sucursales, setSucursales] = useState<SucursalResponse[]>([]);
  const [sucursalId, setSucursalId] = useState('');
  const [subtipoCuentaId, setSubtipoCuentaId] = useState('1');
  const [permiteSobregiro, setPermiteSobregiro] = useState(false);

  const [abriendo, setAbriendo] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Cargar sucursales al montar
  useEffect(() => {
    SucursalService.listarActivas()
      .then(setSucursales)
      .catch(() => setSucursales([]));
  }, []);

  // ── Buscar cliente ────────────────────────────────────────────────────────

  const buscarCliente = async () => {
    if (!identificacion.trim()) return;
    setBuscandoCliente(true);
    setErrorCliente(null);
    setClienteEncontrado(null);
    setErrorGeneral(null);

    try {
      const cliente = await ClienteService.obtenerPorIdentificacion(identificacion.trim());
      setClienteEncontrado(cliente);
    } catch (err: any) {
      if (err?.status === 404) {
        setErrorCliente('No se encontró un cliente con esa identificación.');
      } else {
        setErrorCliente(err?.message || 'Error al buscar el cliente.');
      }
    } finally {
      setBuscandoCliente(false);
    }
  };

  // ── Validar y abrir cuenta ────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);
    const nuevos: Record<string, string> = {};

    if (!clienteEncontrado) {
      nuevos.identificacion = 'Primero busque y seleccione un cliente.';
    }
    if (!sucursalId) {
      nuevos.sucursalId = 'Seleccione una sucursal.';
    }
    if (!subtipoCuentaId) {
      nuevos.subtipoCuentaId = 'Seleccione el tipo de cuenta.';
    }

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setAbriendo(true);
    try {
      const cuenta = await CuentaService.abrir({
        clienteId: clienteEncontrado!.id,
        sucursalId: parseInt(sucursalId, 10),
        subtipoCuentaId: parseInt(subtipoCuentaId, 10),
        permiteSobregiro,
        esFavoritaPagos: false,
      });
      navigate('cuenta-ficha', cuenta.numeroCuenta);
    } catch (err: any) {
      setErrorGeneral(
        err?.statusText || err?.message || 'No se pudo abrir la cuenta. Intente de nuevo.'
      );
    } finally {
      setAbriendo(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Apertura de Cuenta</h1>
        <p className="text-gray-600">Crear una nueva cuenta bancaria para un cliente</p>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#0D1B4B]">Datos de la Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {errorGeneral && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                ⚠️ {errorGeneral}
              </div>
            )}

            {/* Búsqueda de cliente */}
            <div>
              <Label>Cliente (Cédula / RUC / Pasaporte) *</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={identificacion}
                  onChange={(e) => {
                    setIdentificacion(e.target.value);
                    setClienteEncontrado(null);
                    setErrorCliente(null);
                    setErrores((prev) => ({ ...prev, identificacion: '' }));
                  }}
                  placeholder="Ingrese cédula o RUC del cliente..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), buscarCliente())}
                  className={errores.identificacion ? 'border-red-400' : ''}
                />
                <button
                  type="button"
                  onClick={buscarCliente}
                  disabled={!identificacion.trim() || buscandoCliente}
                  className="px-4 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  {buscandoCliente ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
              {errores.identificacion && (
                <p className="text-xs text-red-600 mt-1">{errores.identificacion}</p>
              )}
              {errorCliente && (
                <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                  {errorCliente}
                </div>
              )}
              {clienteEncontrado && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">✅ Cliente encontrado:</p>
                  <p className="text-sm text-green-700 mt-1">
                    <span className="font-medium">{clienteEncontrado.nombreVisual}</span>
                    {' · '}
                    {clienteEncontrado.tipoIdentificacion}: {clienteEncontrado.identificacion}
                    {' · '}
                    Estado: {String(clienteEncontrado.estado)}
                  </p>
                </div>
              )}
            </div>

            {/* Campos del formulario — solo aparecen cuando se encontró un cliente */}
            {clienteEncontrado && (
              <>
                <div>
                  <Label>Sucursal *</Label>
                  <select
                    value={sucursalId}
                    onChange={(e) => {
                      setSucursalId(e.target.value);
                      setErrores((prev) => ({ ...prev, sucursalId: '' }));
                    }}
                    className={`w-full mt-2 px-3 py-2 border rounded-lg ${errores.sucursalId ? 'border-red-400' : ''}`}
                  >
                    <option value="">Seleccione una sucursal...</option>
                    {sucursales.map((s) => (
                      <option key={s.id} value={String(s.id)}>
                        {s.nombre} — {s.ciudad}
                      </option>
                    ))}
                  </select>
                  {errores.sucursalId && (
                    <p className="text-xs text-red-600 mt-1">{errores.sucursalId}</p>
                  )}
                </div>

                <div>
                  <Label>Tipo de Cuenta *</Label>
                  <select
                    value={subtipoCuentaId}
                    onChange={(e) => {
                      setSubtipoCuentaId(e.target.value);
                      setErrores((prev) => ({ ...prev, subtipoCuentaId: '' }));
                    }}
                    className={`w-full mt-2 px-3 py-2 border rounded-lg ${errores.subtipoCuentaId ? 'border-red-400' : ''}`}
                  >
                    {SUBTIPOS_CUENTA.map((s) => (
                      <option key={s.id} value={String(s.id)}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                  {errores.subtipoCuentaId && (
                    <p className="text-xs text-red-600 mt-1">{errores.subtipoCuentaId}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sobregiro"
                    checked={permiteSobregiro}
                    onChange={(e) => setPermiteSobregiro(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="sobregiro" className="cursor-pointer">
                    Permitir sobregiro
                  </Label>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => navigate('cuentas')}
                    disabled={abriendo}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={abriendo}
                    className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] disabled:opacity-50"
                  >
                    {abriendo ? 'Abriendo cuenta...' : 'Abrir Cuenta'}
                  </button>
                </div>
              </>
            )}

            {/* Botón cancelar cuando no hay cliente aún */}
            {!clienteEncontrado && (
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => navigate('cuentas')}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
