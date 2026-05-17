import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ClienteService, getNombreCompleto } from '../../services/clienteService';
import { CuentaService } from '../../services/cuentaService';
import type { ClienteResponse } from '../../services/clienteService';
import type { CuentaResponse } from '../../services/cuentaService';
import type { ClienteRequest } from '../../services/clienteService';
import { useAuth } from '../../context/AuthContext';

interface ClienteFichaProps {
  navigate: (screen: string, id?: string) => void;
  clienteId: string | null;
}

export default function ClienteFicha({ navigate, clienteId }: ClienteFichaProps) {
  const { hasRole } = useAuth();
  const [cliente, setCliente] = useState<ClienteResponse | null>(null);
  const [cuentas, setCuentas] = useState<CuentaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los modales
  const [showConfirmStateChange, setShowConfirmStateChange] = useState(false);
  const [nuevoEstadoSeleccionado, setNuevoEstadoSeleccionado] = useState('');
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [infoTitle, setInfoTitle] = useState('');

  // Estado para modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nombres: '',
    apellidos: '',
    razonSocial: '',
    fechaNacimiento: '',
    email: '',
    telefonoMovil: '',
    direccion: '',
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editErrores, setEditErrores] = useState<Record<string, string>>({});

  // Buscador de cuentas
  const [busquedaCuenta, setBusquedaCuenta] = useState('');

  useEffect(() => {
    if (!clienteId) return;
    const id = parseInt(clienteId, 10);
    if (isNaN(id)) return;

    setLoading(true);
    setError(null);

    Promise.all([
      ClienteService.obtenerPorId(id),
      CuentaService.listar(),
    ])
      .then(([clienteData, todasCuentas]) => {
        setCliente(clienteData);
        setCuentas(todasCuentas.filter(c => c.clienteId === id));
      })
      .catch(err => setError(err.message || 'Error al cargar datos del cliente'))
      .finally(() => setLoading(false));
  }, [clienteId]);

  const handleCambiarEstadoClick = () => {
    if (!cliente) return;
    // Pre-seleccionar el estado "opuesto" al actual
    const opciones = ['ACTIVO', 'INACTIVO', 'SUSPENDIDO'];
    const siguiente = opciones.find(e => e !== cliente.estado) || 'INACTIVO';
    setNuevoEstadoSeleccionado(siguiente);
    setShowConfirmStateChange(true);
  };

  const confirmarCambioEstado = async () => {
    if (!cliente || !nuevoEstadoSeleccionado) return;
    setShowConfirmStateChange(false);
    try {
      const response = await ClienteService.cambiarEstado(cliente.id, nuevoEstadoSeleccionado);
      setCliente({ ...cliente, estado: response.estado || nuevoEstadoSeleccionado });
      setInfoTitle('Éxito');
      setInfoMessage(`Estado actualizado a ${nuevoEstadoSeleccionado}`);
      setShowInfoDialog(true);
    } catch (err: any) {
      setInfoTitle('Error');
      setInfoMessage(err.message || 'Error al cambiar el estado en el servidor');
      setShowInfoDialog(true);
    }
  };

  const handleEditarDatos = () => {
    if (!cliente) return;
    setEditFormData({
      nombres: cliente.nombres || '',
      apellidos: cliente.apellidos || '',
      razonSocial: cliente.razonSocial || '',
      fechaNacimiento: cliente.fechaNacimiento || '',
      email: cliente.email,
      telefonoMovil: cliente.telefonoMovil,
      direccion: cliente.direccion || '',
    });
    setEditErrores({});
    setShowEditModal(true);
  };

  const handleGuardarEdicion = async () => {
    if (!cliente) return;

    // Validaciones
    const nuevosErrores: Record<string, string> = {};
    if (!editFormData.email.trim()) nuevosErrores.email = 'El correo es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email.trim())) nuevosErrores.email = 'Ingrese un correo válido.';
    if (!editFormData.telefonoMovil.trim()) nuevosErrores.telefonoMovil = 'El teléfono es obligatorio.';
    if (!editFormData.direccion.trim()) nuevosErrores.direccion = 'La dirección es obligatoria.';
    if (cliente.tipoCliente === 'NATURAL') {
      if (!editFormData.nombres.trim()) nuevosErrores.nombres = 'Los nombres son obligatorios.';
      if (!editFormData.apellidos.trim()) nuevosErrores.apellidos = 'Los apellidos son obligatorios.';
    }
    if (cliente.tipoCliente === 'JURIDICO') {
      if (!editFormData.razonSocial.trim()) nuevosErrores.razonSocial = 'La razón social es obligatoria.';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setEditErrores(nuevosErrores);
      return;
    }

    setEditSubmitting(true);
    try {
      const clienteCompleto = await ClienteService.obtenerPorId(cliente.id);

      const updateData: any = {
        subtipoClienteId: clienteCompleto.subtipoClienteId,
        tipoCliente: clienteCompleto.tipoCliente,
        tipoIdentificacion: clienteCompleto.tipoIdentificacion,
        identificacion: clienteCompleto.identificacion,
        email: editFormData.email.trim(),
        telefonoMovil: editFormData.telefonoMovil.trim(),
        direccion: editFormData.direccion.trim(),
        latitud: clienteCompleto.latitud,
        longitud: clienteCompleto.longitud,
        activoPagosMasivos: clienteCompleto.activoPagosMasivos,
      };

      if (clienteCompleto.tipoCliente === 'NATURAL') {
        updateData.nombres = editFormData.nombres.trim();
        updateData.apellidos = editFormData.apellidos.trim();
        updateData.fechaNacimiento = clienteCompleto.fechaNacimiento;
      } else if (clienteCompleto.tipoCliente === 'JURIDICO') {
        updateData.razonSocial = editFormData.razonSocial.trim();
        updateData.fechaConstitucion = clienteCompleto.fechaConstitucion;
        updateData.representanteLegalId = clienteCompleto.representanteLegalId ? Number(clienteCompleto.representanteLegalId) : null;
      }

      const actualizado = await ClienteService.actualizar(cliente.id, updateData);
      setCliente(actualizado);
      setShowEditModal(false);
      setInfoTitle('Éxito');
      setInfoMessage('Datos del cliente actualizados correctamente.');
      setShowInfoDialog(true);
    } catch (err: any) {
      setInfoTitle('Error');
      setInfoMessage(err.message || 'Error al actualizar los datos del cliente.');
      setShowInfoDialog(true);
    } finally {
      setEditSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-[#F5F7FA] min-h-full flex items-center justify-center">
        <p className="text-gray-500">Cargando datos del cliente...</p>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="p-8 bg-[#F5F7FA] min-h-full">
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-800">
          ⚠️ {error || 'Cliente no encontrado'}
        </div>
        <button
          onClick={() => navigate('clientes')}
          className="mt-4 px-4 py-2 bg-[#0D1B4B] text-white rounded-lg"
        >
          Volver a Clientes
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Ficha de Cliente</h1>
        <p className="text-gray-600">Información detallada del cliente</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-[#0D1B4B]">{getNombreCompleto(cliente)}</CardTitle>
              <p className="text-gray-600 mt-1">
                {cliente.tipoCliente === 'NATURAL' ? 'C.I' : 'RUC'}: {cliente.identificacion}
              </p>
            </div>
            <div className="flex gap-3">
              <Badge variant="outline">{cliente.tipoCliente}</Badge>
              <Badge variant="outline">{cliente.tipoIdentificacion}</Badge>
              <Badge className={String(cliente.estado) === 'ACTIVO' ? 'bg-green-600' : 'bg-orange-600'}>
                {String(cliente.estado)}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="datos">
        <TabsList className="mb-6">
          <TabsTrigger value="datos">Datos Generales</TabsTrigger>
          <TabsTrigger value="cuentas">Cuentas ({cuentas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="datos">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0D1B4B]">Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Identificación</p>
                  <p className="font-medium">{cliente.identificacion}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tipo de Identificación</p>
                  <p className="font-medium">{cliente.tipoIdentificacion}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Correo Electrónico</p>
                  <p className="font-medium">{cliente.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                  <p className="font-medium">{cliente.telefonoMovil}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tipo de Cliente</p>
                  <p className="font-medium">{cliente.tipoCliente}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pagos Masivos</p>
                  <p className="font-medium">{cliente.activoPagosMasivos ? 'Habilitado' : 'Deshabilitado'}</p>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                {hasRole(['ADMIN_CORE']) && (
                  <button type="button" onClick={handleEditarDatos} className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b]">
                    Editar Datos
                  </button>
                )}
                <button type="button" onClick={handleCambiarEstadoClick} className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  Cambiar Estado
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cuentas">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#0D1B4B]">Cuentas del Cliente</CardTitle>
                <button
                  onClick={() => navigate('cuenta-nueva', clienteId || undefined)}
                  className="px-4 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b]"
                >
                  Nueva Cuenta
                </button>
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  value={busquedaCuenta}
                  onChange={(e) => setBusquedaCuenta(e.target.value)}
                  placeholder="Buscar por número de cuenta..."
                  className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D1B4B]/40"
                />
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const cuentasFiltradas = cuentas.filter(c =>
                  busquedaCuenta.trim() === '' || c.numeroCuenta.includes(busquedaCuenta.trim())
                );
                return cuentasFiltradas.length === 0 ? (
                  <p className="text-gray-500 py-4">
                    {cuentas.length === 0 ? 'Este cliente no tiene cuentas registradas' : 'No se encontraron cuentas con ese número'}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Número</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Saldo Contable</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Saldo Disponible</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cuentasFiltradas.map((cuenta) => (
                          <tr key={cuenta.numeroCuenta} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm font-medium">{cuenta.numeroCuenta}</td>
                            <td className="py-3 px-4 text-sm">
                              <Badge className={String(cuenta.estado) === 'ACTIVA' ? 'bg-green-600' : 'bg-orange-600'}>
                                {String(cuenta.estado)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm font-medium">
                              ${Number(cuenta.saldoContable).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-sm font-medium">
                              ${Number(cuenta.saldoDisponible).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <button
                                onClick={() => navigate('cuenta-ficha', cuenta.numeroCuenta)}
                                className="text-[#0D1B4B] hover:underline"
                              >
                                Ver detalle
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de Cambiar Estado */}
      <Dialog open={showConfirmStateChange} onOpenChange={setShowConfirmStateChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#0D1B4B]">Cambiar Estado del Cliente</DialogTitle>
            <DialogDescription>
              Estado actual: <strong>{cliente?.estado}</strong>. Selecciona el nuevo estado:
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <select
              value={nuevoEstadoSeleccionado}
              onChange={(e) => setNuevoEstadoSeleccionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D1B4B]/40"
            >
              {['ACTIVO', 'INACTIVO', 'SUSPENDIDO']
                .filter(e => e !== cliente?.estado)
                .map(e => (
                  <option key={e} value={e}>{e}</option>
                ))
              }
            </select>
          </div>
          <DialogFooter className="mt-2">
            <button
              onClick={() => setShowConfirmStateChange(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarCambioEstado}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Confirmar Cambio
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Edición de Datos */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#0D1B4B]">Editar Datos del Cliente</DialogTitle>
            <DialogDescription>
              Modifique los campos necesarios. La identificación no se puede cambiar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Identificación (No editable)</Label>
                <Input
                  value={cliente?.identificacion || ''}
                  disabled
                  className="mt-2 bg-gray-100"
                />
              </div>
              <div>
                <Label>Tipo de Cliente</Label>
                <Input
                  value={cliente?.tipoCliente || ''}
                  disabled
                  className="mt-2 bg-gray-100"
                />
              </div>
            </div>

            {cliente?.tipoCliente === 'NATURAL' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombres *</Label>
                  <Input
                    value={editFormData.nombres}
                    onChange={(e) => {
                      setEditFormData({ ...editFormData, nombres: e.target.value });
                      setEditErrores((prev) => ({ ...prev, nombres: '' }));
                    }}
                    className={`mt-2 ${editErrores.nombres ? 'border-red-400' : ''}`}
                  />
                  {editErrores.nombres && <p className="text-xs text-red-600 mt-1">{editErrores.nombres}</p>}
                </div>
                <div>
                  <Label>Apellidos *</Label>
                  <Input
                    value={editFormData.apellidos}
                    onChange={(e) => {
                      setEditFormData({ ...editFormData, apellidos: e.target.value });
                      setEditErrores((prev) => ({ ...prev, apellidos: '' }));
                    }}
                    className={`mt-2 ${editErrores.apellidos ? 'border-red-400' : ''}`}
                  />
                  {editErrores.apellidos && <p className="text-xs text-red-600 mt-1">{editErrores.apellidos}</p>}
                </div>
              </div>
            )}

            {cliente?.tipoCliente === 'JURIDICO' && (
              <div>
                <Label>Razón Social *</Label>
                <Input
                  value={editFormData.razonSocial}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, razonSocial: e.target.value });
                    setEditErrores((prev) => ({ ...prev, razonSocial: '' }));
                  }}
                  className={`mt-2 ${editErrores.razonSocial ? 'border-red-400' : ''}`}
                />
                {editErrores.razonSocial && <p className="text-xs text-red-600 mt-1">{editErrores.razonSocial}</p>}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Correo Electrónico *</Label>
                <Input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, email: e.target.value });
                    setEditErrores((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`mt-2 ${editErrores.email ? 'border-red-400' : ''}`}
                />
                {editErrores.email && <p className="text-xs text-red-600 mt-1">{editErrores.email}</p>}
              </div>
              <div>
                <Label>Teléfono Móvil *</Label>
                <Input
                  value={editFormData.telefonoMovil}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, telefonoMovil: e.target.value });
                    setEditErrores((prev) => ({ ...prev, telefonoMovil: '' }));
                  }}
                  className={`mt-2 ${editErrores.telefonoMovil ? 'border-red-400' : ''}`}
                />
                {editErrores.telefonoMovil && <p className="text-xs text-red-600 mt-1">{editErrores.telefonoMovil}</p>}
              </div>
            </div>
            <div>
              <Label>Dirección *</Label>
              <Input
                value={editFormData.direccion}
                onChange={(e) => {
                  setEditFormData({ ...editFormData, direccion: e.target.value });
                  setEditErrores((prev) => ({ ...prev, direccion: '' }));
                }}
                className={`mt-2 ${editErrores.direccion ? 'border-red-400' : ''}`}
              />
              {editErrores.direccion && <p className="text-xs text-red-600 mt-1">{editErrores.direccion}</p>}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <button
              onClick={() => setShowEditModal(false)}
              disabled={editSubmitting}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardarEdicion}
              disabled={editSubmitting}
              className="px-4 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] transition-colors disabled:opacity-50"
            >
              {editSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Información (Éxito o Alerta) */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={infoTitle === 'Error' ? 'text-red-600' : 'text-[#0D1B4B]'}>
              {infoTitle}
            </DialogTitle>
            <DialogDescription>
              {infoMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <button
              onClick={() => setShowInfoDialog(false)}
              className="px-4 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] transition-colors"
            >
              Cerrar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
