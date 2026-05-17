import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { config } from '../../config/env';
import { SucursalService } from '../../services/sucursalService';
import type { SucursalResponse, SucursalRequest } from '../../services/sucursalService';
import { useAuth } from '../../context/AuthContext';

interface SucursalesListProps {
  navigate: (screen: string) => void;
}

const SUCURSALES_FALLBACK: SucursalResponse[] = [
  { id: 1, codigoSucursal: 'BQ-NORTE', nombre: 'Norte', ciudad: 'Quito', direccion: 'Av. Amazonas N12-34', estado: 'ACTIVA' },
  { id: 2, codigoSucursal: 'BQ-SUR', nombre: 'Sur', ciudad: 'Quito', direccion: 'Av. Maldonado S5-67', estado: 'ACTIVA' },
  { id: 3, codigoSucursal: 'BQ-CENTRO', nombre: 'Centro', ciudad: 'Quito', direccion: 'Calle García Moreno E4-56', estado: 'ACTIVA' },
  { id: 4, codigoSucursal: 'BQ-VALLES', nombre: 'Valles', ciudad: 'Sangolquí', estado: 'ACTIVA' },
  { id: 5, codigoSucursal: 'BQ-DIGITAL', nombre: 'Digital', ciudad: '', estado: 'ACTIVA' },
];

export default function SucursalesList({ navigate }: SucursalesListProps) {
  const { hasRole } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sucursales, setSucursales] = useState<SucursalResponse[]>(SUCURSALES_FALLBACK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState<SucursalResponse | null>(null);
  const [sucursalToToggle, setSucursalToToggle] = useState<SucursalResponse | null>(null);
  const [formData, setFormData] = useState<SucursalRequest>({
    codigoSucursal: '',
    nombre: '',
    ciudad: '',
    direccion: '',
  });
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
  const handleCrear = async () => {
    if (!formData.nombre || !formData.ciudad) {
      alert('Los campos Nombre y Ciudad son obligatorios.');
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
  const handleEditar = (sucursal: SucursalResponse) => {
    setSelectedSucursal(sucursal);
    setFormData({
      codigoSucursal: sucursal.codigoSucursal,
      nombre: sucursal.nombre,
      ciudad: sucursal.ciudad,
      direccion: sucursal.direccion || '',
    });
    setShowEditModal(true);
  };
  const handleGuardarEdicion = async () => {
    if (!selectedSucursal || !formData.nombre || !formData.ciudad) {
      alert('Los campos Nombre y Ciudad son obligatorios.');
      return;
    }

    setSubmitting(true);
    try {
      const actualizada = await SucursalService.actualizar(selectedSucursal.id, formData);
      setSucursales(prev => prev.map(s => s.id === selectedSucursal.id ? actualizada : s));
      setShowEditModal(false);
      setSelectedSucursal(null);
      setFormData({ codigoSucursal: '', nombre: '', ciudad: '', direccion: '' });
      setError(null);
    } catch (err: any) {
      console.error('Error al actualizar sucursal:', err);
      alert(`Error al actualizar sucursal: ${err.message || 'Error desconocido'}`);
    } finally {
      setSubmitting(false);
    }
  };
  const handleAbrirConfirmacionEstado = (sucursal: SucursalResponse) => {
    setSucursalToToggle(sucursal);
    setShowConfirmModal(true);
  };
  const handleCambiarEstado = async () => {
    if (!sucursalToToggle) return;

    const nuevoEstado = sucursalToToggle.estado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA';

    setSubmitting(true);
    setShowConfirmModal(false);
    try {
      const updateData: SucursalRequest = {
        codigoSucursal: sucursalToToggle.codigoSucursal,
        nombre: sucursalToToggle.nombre,
        ciudad: sucursalToToggle.ciudad,
        direccion: sucursalToToggle.direccion || '',
        estado: nuevoEstado,
      };
      const actualizada = await SucursalService.actualizar(sucursalToToggle.id, updateData);
      setSucursales(prev => prev.map(s => s.id === sucursalToToggle.id ? actualizada : s));
      setSucursalToToggle(null);
      setError(null);
    } catch (err: any) {
      console.error('Error al cambiar estado de sucursal:', err);
      alert(`Error al cambiar estado: ${err.message || 'Error desconocido'}`);
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
              onClick={() => {
                const maxId = sucursales.length > 0 ? Math.max(...sucursales.map(s => s.id)) : 0;
                const siguienteCodigo = String(maxId + 1).padStart(3, '0');
                setFormData({ codigoSucursal: siguienteCodigo, nombre: '', ciudad: '', direccion: '' });
                setShowModal(true);
              }}
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
                        {hasRole(['ADMIN_CORE']) && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditar(sucursal)}
                              className="px-3 py-1.5 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] text-xs font-medium"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleAbrirConfirmacionEstado(sucursal)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                                sucursal.estado === 'ACTIVA'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                              disabled={submitting}
                            >
                              {sucursal.estado === 'ACTIVA' ? 'Desactivar' : 'Activar'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Editar Sucursal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#0D1B4B]">Editar Sucursal</DialogTitle>
            <DialogDescription className="text-gray-500">
              Modifique los datos de la sucursal seleccionada.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Código</Label>
              <Input
                placeholder="Auto-incrementado"
                className="mt-2 text-gray-900"
                value={formData.codigoSucursal}
                onChange={(e) => setFormData({ ...formData, codigoSucursal: e.target.value })}
                disabled
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
              onClick={() => setShowEditModal(false)}
              className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardarEdicion}
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Confirmación Cambio de Estado */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#0D1B4B]">
              {sucursalToToggle?.estado === 'ACTIVA' ? 'Desactivar Sucursal' : 'Activar Sucursal'}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {sucursalToToggle?.estado === 'ACTIVA'
                ? `¿Estás seguro de que deseas desactivar la sucursal "${sucursalToToggle?.nombre}"? Esta acción impedirá que la sucursal realice operaciones.`
                : `¿Estás seguro de que deseas activar la sucursal "${sucursalToToggle?.nombre}"? Esta acción permitirá que la sucursal realice operaciones nuevamente.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowConfirmModal(false);
                setSucursalToToggle(null);
              }}
              disabled={submitting}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCambiarEstado}
              disabled={submitting}
              className={sucursalToToggle?.estado === 'ACTIVA' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {submitting ? 'Procesando...' : sucursalToToggle?.estado === 'ACTIVA' ? 'Desactivar' : 'Activar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              <Label>Código</Label>
              <Input
                placeholder="Auto-incrementado"
                className="mt-2 text-gray-900"
                value={formData.codigoSucursal}
                onChange={(e) => setFormData({ ...formData, codigoSucursal: e.target.value })}
                disabled
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
    </div>
  );
}
