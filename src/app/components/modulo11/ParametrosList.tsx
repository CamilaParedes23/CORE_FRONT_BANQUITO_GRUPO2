import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Pencil, AlertTriangle } from 'lucide-react';
import { ParametroService } from '../../services/parametroService';
import type { ParametroCoreResponse } from '../../services/parametroService';

interface ParametrosListProps {
  navigate: (screen: string) => void;
}

export default function ParametrosList({ navigate }: ParametrosListProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedParam, setSelectedParam] = useState<ParametroCoreResponse | null>(null);
  const [editValue, setEditValue] = useState('');
  const [parametros, setParametros] = useState<ParametroCoreResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleSave = () => {
    console.log('Guardando parámetro:', selectedParam?.codigo, 'con valor:', editValue);
    setShowEditModal(false);
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
          <CardTitle className="text-[#0D1B4B]">
            Listado de Parámetros {!loading && `(${parametros.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando parámetros...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Código</th>
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
                      <td colSpan={6} className="text-center py-6 text-gray-500">
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
                        <td className="py-4 px-6">
                          <span className="font-mono text-xs font-medium text-[#0D1B4B] bg-blue-50 px-2 py-1 rounded">
                            {param.codigo}
                          </span>
                        </td>
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
                          <button
                            onClick={() => handleEdit(param)}
                            className="p-2 hover:bg-[#0D1B4B] hover:text-white rounded-lg transition-colors group"
                            title="Editar parámetro"
                          >
                            <Pencil className="w-4 h-4 text-[#0D1B4B] group-hover:text-white" />
                          </button>
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
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] font-medium"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
