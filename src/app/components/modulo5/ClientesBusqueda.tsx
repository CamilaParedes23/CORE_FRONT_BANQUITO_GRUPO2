import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Search } from 'lucide-react';
import { ClienteService } from '../../services/clienteService';
import { CuentaService } from '../../services/cuentaService';
import type { ClienteResponse } from '../../services/clienteService';
import type { CuentaResponse } from '../../services/cuentaService';

interface ClientesBusquedaProps {
  navigate: (screen: string, id?: string) => void;
}

export default function ClientesBusqueda({ navigate }: ClientesBusquedaProps) {
  const [tipoId, setTipoId] = useState('CEDULA');
  const [numeroId, setNumeroId] = useState('');
  const [resultado, setResultado] = useState<ClienteResponse | null | undefined>(undefined);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuscar = async () => {
    if (!numeroId.trim()) return;
    setBuscando(true);
    setError(null);
    setResultado(undefined);

    try {
      if (tipoId === 'CEDULA') {
        if (!/^\d{10}$/.test(numeroId.trim())) {
          throw new Error('Cédula inválida: debe tener exactamente 10 dígitos numéricos');
        }
      } else if (tipoId === 'RUC') {
        if (!/^\d{13}$/.test(numeroId.trim())) {
          throw new Error('RUC inválido: debe tener exactamente 13 dígitos numéricos');
        }
      } else if (tipoId === 'PASAPORTE') {
        if (!/^[A-Za-z0-9]{6,12}$/.test(numeroId.trim())) {
          throw new Error('Pasaporte inválido: debe tener entre 6 y 12 caracteres alfanuméricos');
        }
        if (!/[A-Za-z]/.test(numeroId.trim())) {
          throw new Error('Pasaporte inválido: debe contener al menos una letra');
        }
      }

      const cliente = await ClienteService.obtenerPorIdentificacion(numeroId.trim());
      setResultado(cliente);
    } catch (err: any) {
      if (err?.status === 404) {
        setResultado(null);
      } else {
        setError(err.message || 'Error al buscar el cliente');
      }
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Búsqueda de Cliente</h1>
        <p className="text-gray-600">Busque un cliente por su número de identificación</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-[#0D1B4B] flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Tipo de Identificación</Label>
              <select
                value={tipoId}
                onChange={(e) => setTipoId(e.target.value)}
                className="w-full mt-2 px-3 py-2 border rounded-lg"
              >
                <option value="CEDULA">Cédula</option>
                <option value="RUC">RUC</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
            </div>

            <div>
              <Label>Número de Identificación</Label>
              <Input
                value={numeroId}
                onChange={(e) => setNumeroId(e.target.value)}
                placeholder="Ingrese el número de identificación"
                className="mt-2"
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleBuscar}
              disabled={!numeroId.trim() || buscando}
              className="w-full py-3 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] disabled:opacity-50"
            >
              {buscando ? 'Buscando...' : 'Buscar Cliente'}
            </button>

            {resultado && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-3">Cliente encontrado:</p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm"><span className="font-medium">Tipo:</span> {resultado.tipoCliente}</p>
                  <p className="text-sm"><span className="font-medium">Nombre:</span> {resultado.tipoCliente === 'NATURAL' ? `${resultado.nombres} ${resultado.apellidos}` : resultado.razonSocial}</p>
                  <p className="text-sm"><span className="font-medium">Identificación:</span> {resultado.identificacion}</p>
                  <p className="text-sm"><span className="font-medium">Estado:</span> {String(resultado.estado)}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {resultado.email}</p>
                  <p className="text-sm"><span className="font-medium">Teléfono:</span> {resultado.telefonoMovil}</p>
                </div>
                <button
                  onClick={() => navigate('cliente-ficha', String(resultado.id))}
                  className="w-full py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b]"
                >
                  Ver Ficha Completa
                </button>
              </div>
            )}

            {resultado === null && !buscando && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-medium text-orange-800 mb-3">Cliente no encontrado</p>
                <p className="text-sm text-orange-700 mb-4">
                  No existe un cliente con el número de identificación ingresado.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('cliente-natural-nuevo')}
                    className="flex-1 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b]"
                  >
                    Crear Cliente Natural
                  </button>
                  <button
                    onClick={() => navigate('cliente-juridico-nuevo')}
                    className="flex-1 py-2 bg-[#C9A84C] text-[#0D1B4B] rounded-lg hover:bg-[#b89640]"
                  >
                    Crear Cliente Jurídico
                  </button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
