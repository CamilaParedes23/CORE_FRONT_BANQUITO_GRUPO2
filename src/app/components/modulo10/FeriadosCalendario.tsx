import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FeriadoService } from '../../services/feriadoService';
import type { FeriadoResponse } from '../../services/feriadoService';

interface FeriadosCalendarioProps {
  navigate: (screen: string) => void;
}

export default function FeriadosCalendario({ navigate }: FeriadosCalendarioProps) {
  const [feriados, setFeriados] = useState<FeriadoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal agregar feriado
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [formData, setFormData] = useState({
    fechaFeriado: '',
    nombre: '',
    esFinSemana: false,
  });
  const [formErrores, setFormErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    FeriadoService.listar()
      .then(setFeriados)
      .catch(err => setError(err.message || 'Error al cargar feriados'))
      .finally(() => setLoading(false));
  }, []);

  const validarForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.fechaFeriado) errs.fechaFeriado = 'La fecha es obligatoria.';
    if (!formData.nombre.trim()) errs.nombre = 'El nombre es obligatorio.';
    setFormErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGuardar = () => {
    if (!validarForm()) return;
    // El backend no tiene endpoint POST /feriados en la versión actual.
    // Se muestra el modal informativo.
    setShowModal(false);
    setShowInfoModal(true);
  };

  const handleAbrirModal = () => {
    setFormData({ fechaFeriado: '', nombre: '', esFinSemana: false });
    setFormErrores({});
    setShowModal(true);
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Calendario de Feriados</h1>
        <p className="text-gray-600">Días no hábiles configurados en el sistema</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-800">
          ⚠️ {error}
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#0D1B4B]">
              Feriados Configurados {!loading && `(${feriados.length})`}
            </CardTitle>
            <button
              onClick={handleAbrirModal}
              className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] transition-colors text-sm font-medium"
            >
              + Agregar Feriado
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando feriados...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Fecha</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nombre</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Fin de Semana</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {feriados.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-500">
                        No hay feriados configurados
                      </td>
                    </tr>
                  ) : (
                    feriados.map((feriado) => (
                      <tr key={feriado.fechaFeriado} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium">{feriado.fechaFeriado}</td>
                        <td className="py-3 px-4 text-sm">{feriado.nombre}</td>
                        <td className="py-3 px-4 text-sm">
                          {feriado.esFinSemana ? '✓ Sí' : '— No'}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <Badge className={feriado.estado === 'ACTIVO' ? 'bg-green-600' : 'bg-gray-400'}>
                            {feriado.estado}
                          </Badge>
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

      {/* Modal Agregar Feriado */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#0D1B4B]">Agregar Feriado</DialogTitle>
            <DialogDescription>
              Complete los datos del nuevo día no hábil.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label>Fecha del Feriado *</Label>
              <Input
                type="date"
                value={formData.fechaFeriado}
                onChange={(e) => {
                  setFormData({ ...formData, fechaFeriado: e.target.value });
                  setFormErrores(prev => ({ ...prev, fechaFeriado: '' }));
                }}
                className={`mt-2 ${formErrores.fechaFeriado ? 'border-red-400' : ''}`}
              />
              {formErrores.fechaFeriado && (
                <p className="text-xs text-red-600 mt-1">{formErrores.fechaFeriado}</p>
              )}
            </div>

            <div>
              <Label>Nombre / Motivo *</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => {
                  setFormData({ ...formData, nombre: e.target.value });
                  setFormErrores(prev => ({ ...prev, nombre: '' }));
                }}
                placeholder="Ej: Día de la Independencia"
                className={`mt-2 ${formErrores.nombre ? 'border-red-400' : ''}`}
              />
              {formErrores.nombre && (
                <p className="text-xs text-red-600 mt-1">{formErrores.nombre}</p>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2">
              <input
                id="esFinSemana"
                type="checkbox"
                checked={formData.esFinSemana}
                onChange={(e) => setFormData({ ...formData, esFinSemana: e.target.checked })}
                className="w-4 h-4 accent-[#0D1B4B]"
              />
              <label htmlFor="esFinSemana" className="text-sm text-gray-700 cursor-pointer">
                Es fin de semana
              </label>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              className="px-4 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] transition-colors text-sm"
            >
              Guardar Feriado
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Info (backend sin endpoint POST) */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-amber-600">⚠️ Función no disponible</DialogTitle>
            <DialogDescription>
              El backend actual no expone un endpoint <code className="bg-gray-100 px-1 rounded">POST /feriados</code>. La creación de feriados debe realizarse directamente en la base de datos o habilitando el endpoint en el backend.
            </DialogDescription>
          </DialogHeader>
          <div className="my-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <p className="font-medium mb-1">Datos capturados correctamente:</p>
            <p>📅 Fecha: <strong>{formData.fechaFeriado}</strong></p>
            <p>📝 Nombre: <strong>{formData.nombre}</strong></p>
            <p>📌 Fin de semana: <strong>{formData.esFinSemana ? 'Sí' : 'No'}</strong></p>
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
