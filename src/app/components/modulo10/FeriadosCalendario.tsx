import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FeriadoService } from '../../services/feriadoService';
import type { FeriadoResponse, FeriadoRequest } from '../../services/feriadoService';
import { useAuth } from '../../context/AuthContext';

interface FeriadosCalendarioProps {
  navigate: (screen: string) => void;
}

export default function FeriadosCalendario({ navigate }: FeriadosCalendarioProps) {
  const { hasRole } = useAuth();
  const [feriados, setFeriados] = useState<FeriadoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal agregar feriado
  const [showModal, setShowModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({
    mes: '',
    dia: '',
    nombre: '',
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
    if (!formData.mes) errs.mes = 'El mes es obligatorio.';
    if (!formData.dia) errs.dia = 'El día es obligatorio.';
    if (!formData.nombre.trim()) errs.nombre = 'El nombre es obligatorio.';
    setFormErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGuardar = async () => {
    if (!validarForm()) return;
    
    setGuardando(true);
    try {
      const añoActual = new Date().getFullYear();
      const fechaCompleta = `${añoActual}-${formData.mes.padStart(2, '0')}-${formData.dia.padStart(2, '0')}`;
      
      const request: FeriadoRequest = {
        fecha: fechaCompleta,
        nombre: formData.nombre.trim(),
        estado: 'ACTIVO',
      };
      
      const nuevoFeriado = await FeriadoService.crear(request);
      setFeriados([...feriados, nuevoFeriado]);
      setShowModal(false);
      setFormData({ mes: '', dia: '', nombre: '' });
    } catch (err: any) {
      setError(err.message || 'Error al crear el feriado');
    } finally {
      setGuardando(false);
    }
  };

  const handleAbrirModal = () => {
    setFormData({ mes: '', dia: '', nombre: '' });
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
            {hasRole(['ADMIN_CORE']) && (
              <button
                onClick={handleAbrirModal}
                className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] transition-colors text-sm font-medium"
              >
                + Agregar Feriado
              </button>
            )}
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
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Mes *</Label>
                <select
                  value={formData.mes}
                  onChange={(e) => {
                    setFormData({ ...formData, mes: e.target.value });
                    setFormErrores(prev => ({ ...prev, mes: '' }));
                  }}
                  className={`mt-2 w-full px-3 py-2 border rounded-lg ${formErrores.mes ? 'border-red-400' : ''}`}
                >
                  <option value="">Seleccione mes</option>
                  <option value="01">Enero</option>
                  <option value="02">Febrero</option>
                  <option value="03">Marzo</option>
                  <option value="04">Abril</option>
                  <option value="05">Mayo</option>
                  <option value="06">Junio</option>
                  <option value="07">Julio</option>
                  <option value="08">Agosto</option>
                  <option value="09">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
                {formErrores.mes && (
                  <p className="text-xs text-red-600 mt-1">{formErrores.mes}</p>
                )}
              </div>

              <div className="flex-1">
                <Label>Día *</Label>
                <select
                  value={formData.dia}
                  onChange={(e) => {
                    setFormData({ ...formData, dia: e.target.value });
                    setFormErrores(prev => ({ ...prev, dia: '' }));
                  }}
                  className={`mt-2 w-full px-3 py-2 border rounded-lg ${formErrores.dia ? 'border-red-400' : ''}`}
                >
                  <option value="">Seleccione día</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                {formErrores.dia && (
                  <p className="text-xs text-red-600 mt-1">{formErrores.dia}</p>
                )}
              </div>
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
              disabled={guardando}
              className="px-4 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] transition-colors text-sm disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : 'Guardar Feriado'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
