import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ClienteService } from '../../services/clienteService';
import type { ClienteRequest } from '../../services/clienteService';

interface ClienteNaturalFormProps {
  navigate: (screen: string, id?: string) => void;
}

// Subtipo IDs del backend (SUBTIPO_CLIENTE table):
// 1 = NAT_MASIVO  (NATURAL - Retail)
// 2 = NAT_ALTO_VALOR (NATURAL - Preferente/Premium)
const SUBTIPO_MAP: Record<string, number> = {
  RETAIL: 1,
  PREFERENTE: 2,
  PREMIUM: 2,
};

export default function ClienteNaturalForm({ navigate }: ClienteNaturalFormProps) {
  const [formData, setFormData] = useState({
    tipoId: 'CEDULA',
    numeroId: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    correo: '',
    telefono: '',
    direccion: '',
    segmento: 'RETAIL',
  });

  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  // ── Validaciones ──────────────────────────────────────────────────────────

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.numeroId.trim()) {
      nuevosErrores.numeroId = 'El número de identificación es obligatorio.';
    } else if (formData.tipoId === 'CEDULA') {
      if (!/^\d{10}$/.test(formData.numeroId.trim())) {
        nuevosErrores.numeroId = 'La cédula debe tener exactamente 10 dígitos numéricos.';
      }
    } else if (formData.tipoId === 'PASAPORTE') {
      if (!/^[A-Za-z]{2}\d{6,7}$/.test(formData.numeroId.trim())) {
        nuevosErrores.numeroId = 'El pasaporte debe tener 2 letras seguidas de 6 o 7 dígitos (Ej: AB1234567).';
      }
    }

    if (!formData.nombres.trim()) {
      nuevosErrores.nombres = 'Los nombres son obligatorios.';
    }
    if (!formData.apellidos.trim()) {
      nuevosErrores.apellidos = 'Los apellidos son obligatorios.';
    }
    if (!formData.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
    }
    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'El correo electrónico es obligatorio.';
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

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);

    if (!validar()) return;

    const request: ClienteRequest = {
      subtipoClienteId: SUBTIPO_MAP[formData.segmento] ?? 1,
      tipoCliente: 'NATURAL',
      tipoIdentificacion: formData.tipoId as 'CEDULA' | 'PASAPORTE',
      identificacion: formData.numeroId.trim(),
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      fechaNacimiento: formData.fechaNacimiento,
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
        err?.statusText || err?.message || 'No se pudo crear el cliente. Verifique los datos e intente de nuevo.'
      );
    } finally {
      setGuardando(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const campo = (
    campo: keyof typeof errores,
    children: React.ReactNode
  ) => (
    <div>
      {children}
      {errores[campo] && (
        <p className="text-xs text-red-600 mt-1">{errores[campo]}</p>
      )}
    </div>
  );

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Nuevo Cliente Persona Natural</h1>
        <p className="text-gray-600">Registre un nuevo cliente persona natural</p>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#0D1B4B]">Datos del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {errorGeneral && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                ⚠️ {errorGeneral}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Identificación *</Label>
                <select
                  value={formData.tipoId}
                  onChange={(e) => {
                    setFormData({ ...formData, tipoId: e.target.value, numeroId: '' });
                    setErrores((prev) => ({ ...prev, numeroId: '' }));
                  }}
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
                >
                  <option value="CEDULA">Cédula (10 dígitos)</option>
                  <option value="PASAPORTE">Pasaporte</option>
                </select>
              </div>

              {campo('numeroId',
                <>
                  <Label>
                    Número de Identificación *
                    {formData.tipoId === 'CEDULA' && (
                      <span className="ml-1 text-xs text-gray-500">(exactamente 10 dígitos)</span>
                    )}
                    {formData.tipoId === 'PASAPORTE' && (
                      <span className="ml-1 text-xs text-gray-500">(2 letras + 6 ó 7 dígitos, ej: AB1234567)</span>
                    )}
                  </Label>
                  <Input
                    value={formData.numeroId}
                    onChange={(e) => {
                      const val = formData.tipoId === 'CEDULA'
                        ? e.target.value.replace(/\D/g, '').slice(0, 10)
                        : e.target.value.toUpperCase().slice(0, 9);
                      setFormData({ ...formData, numeroId: val });
                      setErrores((prev) => ({ ...prev, numeroId: '' }));
                    }}
                    placeholder={formData.tipoId === 'CEDULA' ? 'Ej: 1234567890' : 'Ej: AB1234567'}
                    maxLength={formData.tipoId === 'CEDULA' ? 10 : 9}
                    className={`mt-2 ${errores.numeroId ? 'border-red-400' : ''}`}
                  />
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {campo('nombres',
                <>
                  <Label>Nombres *</Label>
                  <Input
                    value={formData.nombres}
                    onChange={(e) => {
                      setFormData({ ...formData, nombres: e.target.value });
                      setErrores((prev) => ({ ...prev, nombres: '' }));
                    }}
                    className={`mt-2 ${errores.nombres ? 'border-red-400' : ''}`}
                  />
                </>
              )}
              {campo('apellidos',
                <>
                  <Label>Apellidos *</Label>
                  <Input
                    value={formData.apellidos}
                    onChange={(e) => {
                      setFormData({ ...formData, apellidos: e.target.value });
                      setErrores((prev) => ({ ...prev, apellidos: '' }));
                    }}
                    className={`mt-2 ${errores.apellidos ? 'border-red-400' : ''}`}
                  />
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {campo('fechaNacimiento',
                <>
                  <Label>Fecha de Nacimiento *</Label>
                  <Input
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => {
                      setFormData({ ...formData, fechaNacimiento: e.target.value });
                      setErrores((prev) => ({ ...prev, fechaNacimiento: '' }));
                    }}
                    className={`mt-2 ${errores.fechaNacimiento ? 'border-red-400' : ''}`}
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
                  <option value="RETAIL">Retail (Masivo)</option>
                  <option value="PREFERENTE">Preferente (Alto Valor)</option>
                  <option value="PREMIUM">Premium (Alto Valor)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {campo('correo',
                <>
                  <Label>Correo Electrónico *</Label>
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
                  <Label>Teléfono Móvil *</Label>
                  <Input
                    value={formData.telefono}
                    onChange={(e) => {
                      setFormData({ ...formData, telefono: e.target.value });
                      setErrores((prev) => ({ ...prev, telefono: '' }));
                    }}
                    placeholder="+593 99 123 4567"
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
                className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] disabled:opacity-50"
              >
                {guardando ? 'Guardando...' : 'Crear Cliente'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
