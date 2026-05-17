import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { UsuarioCoreService } from '../../services/usuarioCoreService';
import type { UsuarioCoreResponse } from '../../services/usuarioCoreService';
import { SucursalService } from '../../services/sucursalService';
import type { SucursalResponse } from '../../services/sucursalService';

interface UsuariosCoreListProps {
  navigate: (screen: string) => void;
}

const ROLES = ['CAJERO', 'SUPERVISOR_AGENCIA', 'ADMIN_CORE', 'AUDITOR'];

export default function UsuariosCoreList({ navigate }: UsuariosCoreListProps) {
  // Búsqueda
  const [usernameBuscado, setUsernameBuscado] = useState('');
  const [usuarios, setUsuarios] = useState<UsuarioCoreResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creando, setCreando] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [credencialesCreadas, setCredencialesCreadas] = useState<{ usuario: string; password: string } | null>(null);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    usuario: '',
    password: '',
    confirmPassword: '',
    rol: 'CAJERO',
    sucursalId: '',
  });
  const [formErrores, setFormErrores] = useState<Record<string, string>>({});
  
  // Sucursales
  const [sucursales, setSucursales] = useState<SucursalResponse[]>([]);
  const [cargandoSucursales, setCargandoSucursales] = useState(false);

  // Cargar sucursales al montar el componente
  useEffect(() => {
    const cargarSucursales = async () => {
      setCargandoSucursales(true);
      try {
        const data = await SucursalService.listarActivas();
        setSucursales(data);
      } catch (err) {
        console.error('Error al cargar sucursales:', err);
      } finally {
        setCargandoSucursales(false);
      }
    };
    cargarSucursales();
  }, []);

  // Helper para obtener nombre de sucursal por ID
  const getNombreSucursal = (sucursalId?: number): string => {
    if (!sucursalId) return '—';
    const sucursal = sucursales.find(s => s.id === sucursalId);
    return sucursal ? sucursal.nombre : '—';
  };

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

  const handleGuardar = async () => {
    if (!validarForm()) return;
    setCreando(true);
    setCreateError(null);
    setCreateSuccess(null);
    try {
      const nuevo = await UsuarioCoreService.crear({
        usuario: formData.usuario.trim(),
        contrasena: formData.password,
        nombreCompleto: formData.nombreCompleto.trim(),
        rol: formData.rol,
        sucursalId: formData.sucursalId ? Number(formData.sucursalId) : null,
      });
      setCredencialesCreadas({ usuario: formData.usuario.trim(), password: formData.password });
      setCreateSuccess(`Usuario "${nuevo.usuario}" creado exitosamente con rol ${nuevo.rol}.`);
      setShowCreateModal(false);
      setFormData({ nombreCompleto: '', usuario: '', password: '', confirmPassword: '', rol: 'CAJERO', sucursalId: '' });
    } catch (err: any) {
      setCreateError(err?.message || 'Error al crear el usuario. Verifique los datos e intente de nuevo.');
    } finally {
      setCreando(false);
    }
  };

  const handleAbrirModal = () => {
    setFormData({ nombreCompleto: '', usuario: '', password: '', confirmPassword: '', rol: 'CAJERO', sucursalId: '' });
    setFormErrores({});
    setCreateError(null);
    setCreateSuccess(null);
    setCredencialesCreadas(null);
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

      {createSuccess && credencialesCreadas && (
        <div className="mb-4 p-4 bg-green-50 border border-green-300 rounded-lg text-sm text-green-800">
          <div className="font-semibold mb-2">✅ {createSuccess}</div>
          <div className="bg-white p-3 rounded border border-green-200 mt-2">
            <div className="text-xs text-gray-500 mb-1">Credenciales de acceso (guárdalas):</div>
            <div className="font-mono text-sm">
              <div><strong>Usuario:</strong> {credencialesCreadas.usuario}</div>
              <div><strong>Contraseña:</strong> {credencialesCreadas.password}</div>
            </div>
          </div>
        </div>
      )}
      {createSuccess && !credencialesCreadas && (
        <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-lg text-sm text-green-800">
          ✅ {createSuccess}
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
                    <td className="py-3 px-4 text-sm text-gray-600">{getNombreSucursal(u.sucursalId)}</td>
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
              <Label>Sucursal <span className="text-gray-400 text-xs">(opcional)</span></Label>
              {cargandoSucursales ? (
                <div className="mt-2 text-sm text-gray-500">Cargando sucursales...</div>
              ) : (
                <select
                  value={formData.sucursalId}
                  onChange={(e) => setFormData({ ...formData, sucursalId: e.target.value })}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Sin sucursal asignada</option>
                  {sucursales.map(s => (
                    <option key={s.id} value={String(s.id)}>
                      {s.nombre} - {s.ciudad}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <button
              onClick={() => setShowCreateModal(false)}
              disabled={creando}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={creando}
              className="px-4 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] transition-colors text-sm disabled:opacity-50"
            >
              {creando ? 'Creando...' : 'Crear Usuario'}
            </button>
          </DialogFooter>

          {createError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
              ⚠️ {createError}
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
