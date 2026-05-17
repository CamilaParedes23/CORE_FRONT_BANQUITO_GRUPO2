import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ClienteService } from '../../services/clienteService';
import type { ClienteRequest } from '../../services/clienteService';
import type { ClienteResponse } from '../../services/clienteService';

interface ClienteJuridicoFormProps {
  navigate: (screen: string, id?: string) => void;
}

// Subtipo IDs del backend (SUBTIPO_CLIENTE table):
// 3 = JUR_PYME       (JURIDICO - PYME / Gobierno)
// 4 = JUR_CORPORATIVO (JURIDICO - Corporativo)
const SUBTIPO_MAP: Record<string, number> = {
  PYME: 3,
  GOBIERNO: 3,
  CORPORATIVO: 4,
};

export default function ClienteJuridicoForm({ navigate }: ClienteJuridicoFormProps) {
  const [formData, setFormData] = useState({
    ruc: '',
    razonSocial: '',
    fechaConstitucion: '',
    representanteLegalId: '',
    correo: '',
    telefono: '',
    direccion: '',
    segmento: 'PYME',
  });

  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  
  // Estado para búsqueda de representante legal
  const [busquedaCedula, setBusquedaCedula] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState<ClienteResponse[]>([]);
  const [representanteSeleccionado, setRepresentanteSeleccionado] = useState<ClienteResponse | null>(null);
  const [buscandoRepresentante, setBuscandoRepresentante] = useState(false);

  // ── Validaciones ──────────────────────────────────────────────────────────

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.ruc.trim()) {
      nuevosErrores.ruc = 'El RUC es obligatorio.';
    } else if (!/^\d{13}$/.test(formData.ruc.trim())) {
      nuevosErrores.ruc = 'El RUC debe tener exactamente 13 dígitos numéricos.';
    } else if (parseInt(formData.ruc.trim(), 10) <= 0) {
      nuevosErrores.ruc = 'El RUC debe ser un número positivo.';
    }

    if (!formData.razonSocial.trim()) {
      nuevosErrores.razonSocial = 'La razón social es obligatoria.';
    }
    
    if (!representanteSeleccionado) {
      nuevosErrores.representanteLegal = 'Debe seleccionar un representante legal.';
    }

    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'El correo corporativo es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo.trim())) {
      nuevosErrores.correo = 'Ingrese un correo electrónico válido.';
    }
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio.';
    }
    if (!formData.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es obligatoria.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // ── Búsqueda de representante legal ─────────────────────────────────────

  const buscarRepresentantePorCedula = async () => {
    if (!busquedaCedula.trim()) return;
    
    setBuscandoRepresentante(true);
    setResultadosBusqueda([]);
    
    try {
      const todosClientes = await ClienteService.listar();
      const clientesNaturales = todosClientes.filter(c => 
        c.tipoCliente === 'NATURAL' && 
        c.identificacion.includes(busquedaCedula.trim())
      );
      setResultadosBusqueda(clientesNaturales);
    } catch (err) {
      console.error('Error al buscar representante legal:', err);
    } finally {
      setBuscandoRepresentante(false);
    }
  };

  const seleccionarRepresentante = (cliente: ClienteResponse) => {
    setRepresentanteSeleccionado(cliente);
    setFormData({ ...formData, representanteLegalId: String(cliente.id) });
    setBusquedaCedula('');
    setResultadosBusqueda([]);
    setErrores((prev) => ({ ...prev, representanteLegal: '' }));
  };

  const eliminarRepresentante = () => {
    setRepresentanteSeleccionado(null);
    setFormData({ ...formData, representanteLegalId: '' });
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);

    if (!validar()) return;

    const request: ClienteRequest = {
      subtipoClienteId: SUBTIPO_MAP[formData.segmento] ?? 3,
      tipoCliente: 'JURIDICO',
      tipoIdentificacion: 'RUC',
      identificacion: formData.ruc.trim(),
      razonSocial: formData.razonSocial.trim(),
      fechaConstitucion: formData.fechaConstitucion || undefined,
      representanteLegalId: parseInt(formData.representanteLegalId, 10),
      email: formData.correo.trim(),
      telefonoMovil: formData.telefono.trim(),
      direccion: formData.direccion.trim(),
      activoPagosMasivos: false,
    };

    setGuardando(true);
    try {
      const clienteCreado = await ClienteService.crear(request);
      navigate('cliente-ficha', String(clienteCreado.id));
    } catch (err: any) {
      setErrorGeneral(
        err?.statusText || err?.message || 'No se pudo crear el cliente jurídico. Verifique los datos e intente de nuevo.'
      );
    } finally {
      setGuardando(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const campo = (
    key: keyof typeof errores,
    children: React.ReactNode
  ) => (
    <div>
      {children}
      {errores[key] && (
        <p className="text-xs text-red-600 mt-1">{errores[key]}</p>
      )}
    </div>
  );

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Nuevo Cliente Persona Jurídica</h1>
        <p className="text-gray-600">Registre un nuevo cliente persona jurídica (empresa)</p>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#0D1B4B]">Datos de la Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {errorGeneral && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                ⚠️ {errorGeneral}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {campo('ruc',
                <>
                  <Label>
                    RUC *
                    <span className="ml-1 text-xs text-gray-500">(exactamente 13 dígitos)</span>
                  </Label>
                  <Input
                    value={formData.ruc}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 13);
                      setFormData({ ...formData, ruc: val });
                      setErrores((prev) => ({ ...prev, ruc: '' }));
                    }}
                    placeholder="1234567890001"
                    maxLength={13}
                    className={`mt-2 ${errores.ruc ? 'border-red-400' : ''}`}
                  />
                  {formData.ruc.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{formData.ruc.length}/13 dígitos</p>
                  )}
                </>
              )}
              <div>
                <Label>Fecha de Constitución</Label>
                <Input
                  type="date"
                  value={formData.fechaConstitucion}
                  onChange={(e) => setFormData({ ...formData, fechaConstitucion: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Representante Legal *</Label>
                {representanteSeleccionado ? (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{representanteSeleccionado.nombres} {representanteSeleccionado.apellidos}</p>
                        <p className="text-xs text-gray-600">Cédula: {representanteSeleccionado.identificacion}</p>
                      </div>
                      <button
                        type="button"
                        onClick={eliminarRepresentante}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Cambiar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <div className="flex gap-2">
                      <Input
                        value={busquedaCedula}
                        onChange={(e) => setBusquedaCedula(e.target.value)}
                        placeholder="Ingrese cédula del representante"
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={buscarRepresentantePorCedula}
                        disabled={buscandoRepresentante}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        {buscandoRepresentante ? 'Buscando...' : 'Buscar'}
                      </button>
                    </div>
                    {resultadosBusqueda.length > 0 && (
                      <div className="mt-2 border rounded-md max-h-60 overflow-y-auto">
                        {resultadosBusqueda.map((cliente) => (
                          <div
                            key={cliente.id}
                            onClick={() => seleccionarRepresentante(cliente)}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium">{cliente.nombres} {cliente.apellidos}</p>
                                <p className="text-xs text-gray-600">Cédula: {cliente.identificacion}</p>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  seleccionarRepresentante(cliente);
                                }}
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                              >
                                Seleccionar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {errores.representanteLegal && <p className="text-xs text-red-600 mt-1">{errores.representanteLegal}</p>}
                  </div>
                )}
              </div>
            </div>

            {campo('razonSocial',
              <>
                <Label>Razón Social *</Label>
                <Input
                  value={formData.razonSocial}
                  onChange={(e) => {
                    setFormData({ ...formData, razonSocial: e.target.value });
                    setErrores((prev) => ({ ...prev, razonSocial: '' }));
                  }}
                  placeholder="Empresa XYZ S.A."
                  className={`mt-2 ${errores.razonSocial ? 'border-red-400' : ''}`}
                />
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              {campo('correo',
                <>
                  <Label>Correo Corporativo *</Label>
                  <Input
                    type="email"
                    value={formData.correo}
                    onChange={(e) => {
                      setFormData({ ...formData, correo: e.target.value });
                      setErrores((prev) => ({ ...prev, correo: '' }));
                    }}
                    className={`mt-2 ${errores.correo ? 'border-red-400' : ''}`}
                  />
                </>
              )}
              {campo('telefono',
                <>
                  <Label>Teléfono *</Label>
                  <Input
                    value={formData.telefono}
                    onChange={(e) => {
                      setFormData({ ...formData, telefono: e.target.value });
                      setErrores((prev) => ({ ...prev, telefono: '' }));
                    }}
                    className={`mt-2 ${errores.telefono ? 'border-red-400' : ''}`}
                  />
                </>
              )}
            </div>

            {campo('direccion',
              <>
                <Label>Dirección *</Label>
                <Input
                  value={formData.direccion}
                  onChange={(e) => {
                    setFormData({ ...formData, direccion: e.target.value });
                    setErrores((prev) => ({ ...prev, direccion: '' }));
                  }}
                  className={`mt-2 ${errores.direccion ? 'border-red-400' : ''}`}
                />
              </>
            )}

            <div>
              <Label>Segmento</Label>
              <select
                value={formData.segmento}
                onChange={(e) => setFormData({ ...formData, segmento: e.target.value })}
                className="w-full mt-2 px-3 py-2 border rounded-lg"
              >
                <option value="PYME">PYME</option>
                <option value="CORPORATIVO">Corporativo</option>
                <option value="GOBIERNO">Gobierno</option>
              </select>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('clientes')}
                disabled={guardando}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="px-6 py-2 bg-[#C9A84C] text-[#0D1B4B] rounded-lg hover:bg-[#b89640] disabled:opacity-50 font-medium"
              >
                {guardando ? 'Guardando...' : 'Crear Cliente Jurídico'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
