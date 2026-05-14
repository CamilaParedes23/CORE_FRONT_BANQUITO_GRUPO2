import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { UsuarioCoreService } from '../../services/usuarioCoreService';
import type { UsuarioCoreResponse } from '../../services/usuarioCoreService';

interface UsuariosCoreListProps {
  navigate: (screen: string) => void;
}

const ROLES = ['CAJERO', 'OPERADOR', 'SUPERVISOR_AGENCIA', 'ADMIN_CORE', 'AUDITOR'];

export default function UsuariosCoreList({ navigate }: UsuariosCoreListProps) {
  // Búsqueda
  const [usernameBuscado, setUsernameBuscado] = useState('');
  const [usuarios, setUsuarios] = useState<UsuarioCoreResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal crear usuario
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    usuario: '',
    password: '',
    confirmPassword: '',
    rol: 'CAJERO',
    sucursalId: '',
  });
  const [formErrores, setFormErrores] = useState<Record<string, string>>({});

  const handleBuscar = async () => {
    if (!usernameBuscado.trim()) {
      setUsuarios([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const user = await UsuarioCoreService.obtenerPorUsername(usernameBuscado.trim());
      setUsuarios([user]);
    } catch (err: any) {
      if (err?.status === 404) {
        setError('Usuario no encontrado.');
      } else {
        setError('Error al consultar el usuario.');
      }
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const validarForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.nombreCompleto.trim()) errs.nombreCompleto = 'El nombre completo es obligatorio.';
    if (!formData.usuario.trim()) errs.usuario = 'El nombre de usuario es obligatorio.';
    else if (formData.usuario.trim().length < 4) errs.usuario = 'Mínimo 4 caracteres.';
    if (!formData.password) errs.password = 'La contraseña es obligatoria.';
    else if (formData.password.length < 6) errs.password = 'Mínimo 6 caracteres.';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden.';
    if (!formData.rol) errs.rol = 'Seleccione un rol.';
    setFormErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGuardar = () => {
    if (!validarForm()) return;
    setShowCreateModal(false);
    setShowInfoModal(true);
  };

  const handleAbrirModal = () => {
    setFormData({ nombreCompleto: '', usuario: '', password: '', confirmPassword: '', rol: 'CAJERO', sucursalId: '' });
    setFormErrores({});
    setShowCreateModal(true);
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

      {/* Buscador */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label>Buscar por Username</Label>
              <Input
                value={usernameBuscado}
                onChange={(e) => setUsernameBuscado(e.target.value)}
                placeholder="Ej: admin, cajero01..."
                className="mt-2"
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              />
            </div>
            <button
              onClick={handleBuscar}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
            <button
              onClick={handleAbrirModal}
              className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] transition-colors text-sm"
            >
              + Nuevo Usuario
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0D1B4B]">Resultados de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nombre Completo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Usuario</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rol</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Sucursal</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Último Login</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400">
                      Ingrese un username y presione Buscar (ej: admin)
                    </td>
                  </tr>
                )}
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">{u.nombreCompleto}</td>
                    <td className="py-3 px-4 text-sm font-mono">{u.usuario}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant="outline" className="text-xs">{u.rol}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{u.sucursalId || '—'}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge className={String(u.estado) === 'ACTIVO' ? 'bg-green-600' : 'bg-red-600'}>
                        {String(u.estado)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {u.ultimoLogin ? new Date(u.ultimoLogin).toLocaleString('es-EC') : 'Nunca'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
        ℹ️ La búsqueda es individual por username (limitación del backend). No existe listado general.
      </div>

      {/* Modal Crear Usuario */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#0D1B4B]">Nuevo Usuario Core</DialogTitle>
            <DialogDescription>
              Complete los datos del nuevo usuario interno del sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Nombre completo */}
            <div>
              <Label>Nombre Completo *</Label>
              <Input
                value={formData.nombreCompleto}
                onChange={(e) => {
                  setFormData({ ...formData, nombreCompleto: e.target.value });
                  setFormErrores(p => ({ ...p, nombreCompleto: '' }));
                }}
                placeholder="Ej: Juan Pérez López"
                className={`mt-2 ${formErrores.nombreCompleto ? 'border-red-400' : ''}`}
              />
              {formErrores.nombreCompleto && (
                <p className="text-xs text-red-600 mt-1">{formErrores.nombreCompleto}</p>
              )}
            </div>

            {/* Usuario */}
            <div>
              <Label>Nombre de Usuario *</Label>
              <Input
                value={formData.usuario}
                onChange={(e) => {
                  setFormData({ ...formData, usuario: e.target.value.toLowerCase().replace(/\s/g, '') });
                  setFormErrores(p => ({ ...p, usuario: '' }));
                }}
                placeholder="Ej: jperez"
                className={`mt-2 ${formErrores.usuario ? 'border-red-400' : ''}`}
              />
              {formErrores.usuario && (
                <p className="text-xs text-red-600 mt-1">{formErrores.usuario}</p>
              )}
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Contraseña *</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setFormErrores(p => ({ ...p, password: '' }));
                  }}
                  placeholder="Mín. 6 caracteres"
                  className={`mt-2 ${formErrores.password ? 'border-red-400' : ''}`}
                />
                {formErrores.password && (
                  <p className="text-xs text-red-600 mt-1">{formErrores.password}</p>
                )}
              </div>
              <div>
                <Label>Confirmar Contraseña *</Label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    setFormErrores(p => ({ ...p, confirmPassword: '' }));
                  }}
                  placeholder="Repetir contraseña"
                  className={`mt-2 ${formErrores.confirmPassword ? 'border-red-400' : ''}`}
                />
                {formErrores.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">{formErrores.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Rol */}
            <div>
              <Label>Rol *</Label>
              <select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Sucursal */}
            <div>
              <Label>ID Sucursal <span className="text-gray-400 text-xs">(opcional)</span></Label>
              <Input
                type="number"
                value={formData.sucursalId}
                onChange={(e) => setFormData({ ...formData, sucursalId: e.target.value })}
                placeholder="Ej: 1"
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              className="px-4 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] transition-colors text-sm"
            >
              Crear Usuario
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Info (backend sin endpoint POST) */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-amber-600">⚠️ Función no disponible en backend</DialogTitle>
            <DialogDescription>
              El backend actual no expone un endpoint <code className="bg-gray-100 px-1 rounded">POST /usuarios-core</code>. Para crear usuarios, inserte el registro directamente en la tabla <code className="bg-gray-100 px-1 rounded">USUARIO_CORE</code> de la base de datos MariaDB.
            </DialogDescription>
          </DialogHeader>
          <div className="my-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 space-y-1">
            <p className="font-medium mb-1">Datos listos para insertar:</p>
            <p>👤 Nombre: <strong>{formData.nombreCompleto}</strong></p>
            <p>🔑 Usuario: <strong>{formData.usuario}</strong></p>
            <p>🎭 Rol: <strong>{formData.rol}</strong></p>
            {formData.sucursalId && <p>🏦 Sucursal ID: <strong>{formData.sucursalId}</strong></p>}
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowInfoModal(false)}
              className="px-4 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] transition-colors text-sm"
            >
              Entendido
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
