import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Pencil, AlertTriangle, Plus } from 'lucide-react';
import { ParametroService } from '../../services/parametroService';
import type { ParametroCoreResponse, ParametroCoreRequest } from '../../services/parametroService';
import { useAuth } from '../../context/AuthContext';

interface ParametrosListProps {
  navigate: (screen: string) => void;
}

export default function ParametrosList({ navigate }: ParametrosListProps) {
  const { hasRole } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedParam, setSelectedParam] = useState<ParametroCoreResponse | null>(null);
  const [editValue, setEditValue] = useState('');
  const [parametros, setParametros] = useState<ParametroCoreResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createFormData, setCreateFormData] = useState<ParametroCoreRequest>({
    codigo: '',
    nombre: '',
    valor: '',
    tipoDato: 'CADENA',
    descripcion: '',
  });

  useEffect(() => {
    ParametroService.listar()
      .then(setParametros)
      .catch(err => setError(err.message || 'Error al cargar parámetros'))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (param: ParametroCoreResponse) => {
    setSelectedParam(param);
    setEditValue(param.valorTexto);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!selectedParam) return;

    setSubmitting(true);
    try {
      const updateData: ParametroCoreRequest = {
        codigo: selectedParam.codigo,
        nombre: selectedParam.nombre,
        valor: editValue,
        tipoDato: selectedParam.tipoDato,
        descripcion: selectedParam.descripcion,
      };
      const actualizado = await ParametroService.actualizar(selectedParam.codigo, updateData);
      setParametros(prev => prev.map(p => p.codigo === selectedParam.codigo ? actualizado : p));
      setShowEditModal(false);
      setSelectedParam(null);
      setEditValue('');
      setError(null);
    } catch (err: any) {
      alert(`Error al actualizar parámetro: ${err.message || 'Error desconocido'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreate = async () => {
    if (!createFormData.codigo || !createFormData.nombre || !createFormData.valor) {
      alert('Los campos Código, Nombre y Valor son obligatorios.');
      return;
    }

    setSubmitting(true);
    try {
      const nuevo = await ParametroService.crear(createFormData);
      setParametros(prev => [...prev, nuevo]);
      setShowCreateModal(false);
      setCreateFormData({
        codigo: '',
        nombre: '',
        valor: '',
        tipoDato: 'CADENA',
        descripcion: '',
      });
      setError(null);
    } catch (err: any) {
      alert(`Error al crear parámetro: ${err.message || 'Error desconocido'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAbrirCrear = () => {
    setCreateFormData({
      codigo: '',
      nombre: '',
      valor: '',
      tipoDato: 'CADENA',
      descripcion: '',
    });
    setShowCreateModal(true);
  };

  const renderEditField = () => {
    if (!selectedParam) return null;
    switch (selectedParam.tipoDato) {
      case 'NUMERICO':
        return (
          <Input
            type="number"
            step="0.01"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="mt-2"
          />
        );
      case 'HORA':
        return (
          <Input
            type="time"
            step="1"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="mt-2"
          />
        );
      case 'BOOLEANO':
        return (
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditValue(editValue === 'true' ? 'false' : 'true')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                editValue === 'true' ? 'bg-[#0D1B4B]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  editValue === 'true' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm font-medium">
              {editValue === 'true' ? 'Habilitado' : 'Deshabilitado'}
            </span>
          </div>
        );
      case 'FECHA':
        return (
          <Input
            type="date"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="mt-2"
          />
        );
      default:
        return (
          <Input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="mt-2"
          />
        );
    }
  };

  return (
    <div className="p-8 bg-[#F8F9FC] min-h-full">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Parámetros del Sistema</h1>
            <p className="text-gray-600">Configuración global del Core Bancario</p>
          </div>
          <Badge className="bg-[#C9A84C] text-[#0D1B4B] px-4 py-2 text-sm font-medium">
            ADMIN_CORE
          </Badge>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-800">
          ⚠️ {error}
        </div>
      )}

      <Card className="shadow-lg">
        <CardHeader className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#0D1B4B]">
              Listado de Parámetros {!loading && `(${parametros.length})`}
            </CardTitle>
            {hasRole(['ADMIN_CORE']) && (
              <button
                onClick={handleAbrirCrear}
                className="px-4 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Nuevo Parámetro
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando parámetros...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Valor Actual</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Tipo de Dato</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Descripción</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {parametros.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">
                        No hay parámetros configurados
                      </td>
                    </tr>
                  ) : (
                    parametros.map((param, index) => (
                      <tr
                        key={param.codigo}
                        className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">{param.nombre}</td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-semibold text-[#0D1B4B]">{param.valorTexto}</span>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className="text-xs font-medium border-[#C9A84C] text-[#C9A84C]">
                            {param.tipoDato}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 max-w-xs">{param.descripcion}</td>
                        <td className="py-4 px-6">
                          {hasRole(['ADMIN_CORE']) && (
                            <button
                              onClick={() => handleEdit(param)}
                              className="p-2 hover:bg-[#0D1B4B] hover:text-white rounded-lg transition-colors group"
                              title="Editar parámetro"
                            >
                              <Pencil className="w-4 h-4 text-[#0D1B4B] group-hover:text-white" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0D1B4B]">Editar Parámetro</DialogTitle>
          </DialogHeader>
          {selectedParam && (
            <div className="space-y-6 py-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Código</Label>
                <Input value={selectedParam.codigo} disabled className="mt-2 bg-gray-100 text-gray-600 font-mono text-sm" />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                <Input value={selectedParam.nombre} disabled className="mt-2 bg-gray-100 text-gray-600" />
              </div>
              {selectedParam.descripcion && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Descripción</Label>
                  <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {selectedParam.descripcion}
                  </p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium text-gray-700">Tipo de Dato</Label>
                <div className="mt-2">
                  <Badge variant="outline" className="border-[#C9A84C] text-[#C9A84C]">
                    {selectedParam.tipoDato}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Valor *</Label>
                {renderEditField()}
              </div>
              <Alert className="bg-yellow-50 border-2 border-yellow-400">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <AlertDescription className="ml-2 text-yellow-800 font-medium">
                  Cambiar este parámetro puede afectar el comportamiento del sistema en producción.
                </AlertDescription>
              </Alert>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] font-medium"
                  disabled={submitting}
                >
                  {submitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Crear Parámetro */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0D1B4B]">Nuevo Parámetro</DialogTitle>
            <DialogDescription className="text-gray-500">
              Complete los datos para registrar un nuevo parámetro del sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Código *</Label>
              <Input
                placeholder="Ej: LIMITE_TRANSFERENCIA"
                className="mt-2"
                value={createFormData.codigo}
                onChange={(e) => setCreateFormData({ ...createFormData, codigo: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <Label>Nombre *</Label>
              <Input
                placeholder="Ej: Límite de Transferencia"
                className="mt-2"
                value={createFormData.nombre}
                onChange={(e) => setCreateFormData({ ...createFormData, nombre: e.target.value })}
              />
            </div>
            <div>
              <Label>Tipo de Dato *</Label>
              <select
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={createFormData.tipoDato}
                onChange={(e) => setCreateFormData({ ...createFormData, tipoDato: e.target.value as any })}
              >
                <option value="CADENA">Cadena</option>
                <option value="NUMERICO">Numérico</option>
                <option value="HORA">Hora</option>
                <option value="BOOLEANO">Booleano</option>
                <option value="FECHA">Fecha</option>
              </select>
            </div>
            <div>
              <Label>Valor *</Label>
              {createFormData.tipoDato === 'NUMERICO' && (
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Ej: 1000.00"
                  className="mt-2"
                  value={createFormData.valor}
                  onChange={(e) => setCreateFormData({ ...createFormData, valor: e.target.value })}
                />
              )}
              {createFormData.tipoDato === 'HORA' && (
                <Input
                  type="time"
                  step="1"
                  className="mt-2"
                  value={createFormData.valor}
                  onChange={(e) => setCreateFormData({ ...createFormData, valor: e.target.value })}
                />
              )}
              {createFormData.tipoDato === 'BOOLEANO' && (
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCreateFormData({ ...createFormData, valor: createFormData.valor === 'true' ? 'false' : 'true' })}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      createFormData.valor === 'true' ? 'bg-[#0D1B4B]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        createFormData.valor === 'true' ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium">
                    {createFormData.valor === 'true' ? 'Habilitado' : 'Deshabilitado'}
                  </span>
                </div>
              )}
              {createFormData.tipoDato === 'FECHA' && (
                <Input
                  type="date"
                  className="mt-2"
                  value={createFormData.valor}
                  onChange={(e) => setCreateFormData({ ...createFormData, valor: e.target.value })}
                />
              )}
              {createFormData.tipoDato === 'CADENA' && (
                <Input
                  type="text"
                  placeholder="Ej: Valor del parámetro"
                  className="mt-2"
                  value={createFormData.valor}
                  onChange={(e) => setCreateFormData({ ...createFormData, valor: e.target.value })}
                />
              )}
            </div>
            <div>
              <Label>Descripción</Label>
              <Input
                placeholder="Descripción del parámetro"
                className="mt-2"
                value={createFormData.descripcion}
                onChange={(e) => setCreateFormData({ ...createFormData, descripcion: e.target.value })}
              />
            </div>
            <Alert className="bg-yellow-50 border-2 border-yellow-400">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <AlertDescription className="ml-2 text-yellow-800 font-medium">
                Este parámetro afectará el comportamiento del sistema. Verifique el valor antes de crearlo.
              </AlertDescription>
            </Alert>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-6 py-3 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] font-medium"
                disabled={submitting}
              >
                {submitting ? 'Creando...' : 'Crear Parámetro'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
