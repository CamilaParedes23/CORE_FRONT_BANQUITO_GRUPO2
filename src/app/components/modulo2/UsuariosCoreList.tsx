import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { config } from '../../config/env';
import { UsuarioCoreService } from '../../services/usuarioCoreService';
import type { UsuarioCoreResponse } from '../../services/usuarioCoreService';

interface UsuariosCoreListProps {
  navigate: (screen: string) => void;
}

export default function UsuariosCoreList({ navigate }: UsuariosCoreListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [usernameBuscado, setUsernameBuscado] = useState('');
  const [usuarios, setUsuarios] = useState<UsuarioCoreResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuscar = async () => {
    if (!usernameBuscado.trim()) {
      setUsuarios([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const user = await UsuarioCoreService.obtenerPorUsername(usernameBuscado);
      setUsuarios([user]);
    } catch (err: any) {
      console.error(err);
      if (err?.status === 404) {
        setError('Usuario no encontrado');
        setUsuarios([]);
      } else {
        setError('Error al consultar el usuario');
        setUsuarios([]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Usuarios Core</h1>
        <p className="text-gray-600">Gestión de usuarios internos del sistema</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-800">
          ⚠️ {error}
        </div>
      )}

      {/* Filtros - Modificado para buscar individualmente por limitación del backend */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4 items-end">
            <div className="col-span-2">
              <Label>Buscar por Username</Label>
              <Input 
                value={usernameBuscado}
                onChange={(e) => setUsernameBuscado(e.target.value)}
                placeholder="Ej: admin"
                className="mt-2"
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              />
            </div>
            <div>
              <button
                onClick={handleBuscar}
                disabled={loading}
                className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] transition-colors"
              >
                Nuevo Usuario
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0D1B4B]">Resultados de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nombre</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Usuario</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rol</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">ID Sucursal</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Último Login</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      Ingrese un username para buscar (ej. admin)
                    </td>
                  </tr>
                )}
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">{usuario.id}</td>
                    <td className="py-3 px-4 text-sm">{usuario.nombreCompleto}</td>
                    <td className="py-3 px-4 text-sm">{usuario.usuario}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant="outline" className="text-xs">{usuario.rol}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{usuario.sucursalId || '-'}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge className={usuario.estado === 'ACTIVO' ? 'bg-green-600' : 'bg-red-600'}>
                        {usuario.estado}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {usuario.ultimoLogin ? new Date(usuario.ultimoLogin).toLocaleString() : 'Nunca'}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button className="text-[#0D1B4B] hover:underline" onClick={() => alert('Edición no implementada en backend')}>Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Crear Usuario */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#0D1B4B]">Nuevo Usuario Core</DialogTitle>
            <DialogDescription>
              La creación de usuarios no está implementada en el backend actual.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 opacity-50 pointer-events-none">
            {/* Formulario deshabilitado porque no hay backend para esto */}
            <div>
              <Label>Nombre Completo *</Label>
              <Input placeholder="Ej: Juan Pérez López" className="mt-2" />
            </div>
            <div>
              <Label>Usuario *</Label>
              <Input placeholder="Ej: jperez" className="mt-2" />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateModal(false)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cerrar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* API Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 font-medium">Limitación del Backend:</p>
        <p className="text-xs text-blue-600 mt-1">El backend solo tiene endpoint GET /usuarios-core/{'{username}'}</p>
        <p className="text-xs text-blue-600">No tiene endpoint para listar todos ni para crear nuevos.</p>
      </div>
    </div>
  );
}
