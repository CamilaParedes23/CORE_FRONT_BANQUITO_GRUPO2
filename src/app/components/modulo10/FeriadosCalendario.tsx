import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { FeriadoService } from '../../services/feriadoService';
import type { FeriadoResponse } from '../../services/feriadoService';

interface FeriadosCalendarioProps {
  navigate: (screen: string) => void;
}

export default function FeriadosCalendario({ navigate }: FeriadosCalendarioProps) {
  const [feriados, setFeriados] = useState<FeriadoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    FeriadoService.listar()
      .then(setFeriados)
      .catch(err => setError(err.message || 'Error al cargar feriados'))
      .finally(() => setLoading(false));
  }, []);

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
            <button className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b]">
              Agregar Feriado
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {feriados.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">
                        No hay feriados configurados
                      </td>
                    </tr>
                  ) : (
                    feriados.map((feriado) => (
                      <tr key={feriado.fechaFeriado} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium">{feriado.fechaFeriado}</td>
                        <td className="py-3 px-4 text-sm">{feriado.nombre}</td>
                        <td className="py-3 px-4 text-sm">
                          {feriado.esFinSemana ? 'Sí' : 'No'}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <Badge className={feriado.estado === 'ACTIVO' ? 'bg-green-600' : 'bg-gray-400'}>
                            {feriado.estado}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <button className="text-[#0D1B4B] hover:underline">Editar</button>
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
    </div>
  );
}
