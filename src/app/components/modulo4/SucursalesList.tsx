import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { config } from '../../config/env';
import { SucursalService } from '../../services/sucursalService';
import type { SucursalResponse, SucursalRequest } from '../../services/sucursalService';

interface SucursalesListProps {
  navigate: (screen: string) => void;
}

// Datos de respaldo cuando el backend no está disponible
const SUCURSALES_FALLBACK: SucursalResponse[] = [
  { id: 1, codigoSucursal: 'BQ-NORTE', nombre: 'Norte', ciudad: 'Quito', direccion: 'Av. Amazonas N12-34', estado: 'ACTIVA' },
  { id: 2, codigoSucursal: 'BQ-SUR', nombre: 'Sur', ciudad: 'Quito', direccion: 'Av. Maldonado S5-67', estado: 'ACTIVA' },
  { id: 3, codigoSucursal: 'BQ-CENTRO', nombre: 'Centro', ciudad: 'Quito', direccion: 'Calle García Moreno E4-56', estado: 'ACTIVA' },
  { id: 4, codigoSucursal: 'BQ-VALLES', nombre: 'Valles', ciudad: 'Sangolquí', estado: 'ACTIVA' },
  { id: 5, codigoSucursal: 'BQ-DIGITAL', nombre: 'Digital', ciudad: '', estado: 'ACTIVA' },
];

export default function SucursalesList({ navigate }: SucursalesListProps) {
  const [showModal, setShowModal] = useState(false);
  const [sucursales, setSucursales] = useState<SucursalResponse[]>(SUCURSALES_FALLBACK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState<SucursalRequest>({
    codigoSucursal: '',
    nombre: '',
    ciudad: '',
    direccion: '',
  });

  // Cargar sucursales desde la API al montar el componente
  useEffect(() => {
    const cargarSucursales = async () => {
      setLoading(true);
      try {
        const data = await SucursalService.listar();
        setSucursales(data);
        setError(null);
      } catch (err) {
        console.warn('Backend no disponible, usando datos de respaldo:', err);
        setSucursales(SUCURSALES_FALLBACK);
        setError('No se pudo conectar al servidor. Mostrando datos de respaldo.');
      } finally {
        setLoading(false);
      }
    };
    cargarSucursales();
  }, []);

  // Handler para crear sucursal
  const handleCrear = async () => {
    if (!formData.codigoSucursal || !formData.nombre || !formData.ciudad) {
      alert('Los campos Código, Nombre y Ciudad son obligatorios.');
      return;
    }

    setSubmitting(true);
    try {
      const nueva = await SucursalService.crear(formData);
      setSucursales(prev => [...prev, nueva]);
      setShowModal(false);
      setFormData({ codigoSucursal: '', nombre: '', ciudad: '', direccion: '' });
      setError(null);
    } catch (err: any) {
      console.error('Error al crear sucursal:', err);
      alert(`Error al crear sucursal: ${err.message || 'Error desconocido'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Sucursales</h1>
        <p className="text-gray-600">Gestión de sucursales del banco</p>
      </div>

      {/* Banner de error/fallback */}
      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800">
          ⚠️ {error}
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#0D1B4B]">Listado de Sucursales</CardTitle>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b]"
            >
              Nueva Sucursal
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando sucursales...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Código</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nombre</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ciudad</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sucursales.map((sucursal) => (
                    <tr key={sucursal.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">{sucursal.codigoSucursal}</td>
                      <td className="py-3 px-4 text-sm">{sucursal.nombre}</td>
                      <td className="py-3 px-4 text-sm">
                        {sucursal.ciudad || <span className="text-gray-400">Sin sede física</span>}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Badge className="bg-green-600">{sucursal.estado}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <button className="text-[#0D1B4B] hover:underline">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Crear Sucursal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#0D1B4B]">Nueva Sucursal</DialogTitle>
            <DialogDescription className="text-gray-500">
              Complete los datos para registrar una nueva sucursal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Código *</Label>
              <Input
                placeholder="Ej: MTZ-Q"
                className="mt-2"
                value={formData.codigoSucursal}
                onChange={(e) => setFormData({ ...formData, codigoSucursal: e.target.value })}
              />
            </div>
            <div>
              <Label>Nombre *</Label>
              <Input
                placeholder="Ej: Matriz Quito"
                className="mt-2"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>
            <div>
              <Label>Ciudad *</Label>
              <Input
                placeholder="Ej: Quito"
                className="mt-2"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              />
            </div>
            <div>
              <Label>Dirección</Label>
              <Input
                placeholder="Dirección completa"
                className="mt-2"
                value={formData.direccion || ''}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              onClick={handleCrear}
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] disabled:opacity-50"
            >
              {submitting ? 'Creando...' : 'Crear Sucursal'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 font-medium">Endpoint API:</p>
        <p className="text-xs text-blue-600 mt-1">GET {config.apiBaseUrl}/sucursales</p>
        <p className="text-xs text-blue-600">POST {config.apiBaseUrl}/sucursales</p>
      </div>
    </div>
  );
}
