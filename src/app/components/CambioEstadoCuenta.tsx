import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';

interface CambioEstadoCuentaProps {
  navigate: (screen: string, data?: any) => void;
  cuentaNumero: string | null;
}

export default function CambioEstadoCuenta({ navigate, cuentaNumero }: CambioEstadoCuentaProps) {
  const [estadoActual] = useState('ACTIVA');
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [motivo, setMotivo] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const historialCambios = [
    {
      fecha: '2025-03-10 15:30',
      estadoAnterior: 'SUSPENDIDA',
      estadoNuevo: 'ACTIVA',
      motivo: 'Documentación completada',
      usuario: 'admin.operaciones',
    },
    {
      fecha: '2025-02-05 11:20',
      estadoAnterior: 'ACTIVA',
      estadoNuevo: 'SUSPENDIDA',
      motivo: 'Revisión de documentación',
      usuario: 'cumplimiento.principal',
    },
    {
      fecha: '2024-01-15 09:00',
      estadoAnterior: 'NUEVA',
      estadoNuevo: 'ACTIVA',
      motivo: 'Apertura inicial',
      usuario: 'operador.matriz',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoEstado && motivo) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('detalle-cuenta', { cuentaNumero });
      }, 2000);
    }
  };

  const estadosDisponibles = [
    { value: 'ACTIVA', label: 'ACTIVA', disponible: estadoActual !== 'ACTIVA' },
    { value: 'INACTIVA', label: 'INACTIVA', disponible: true },
    { value: 'BLOQUEADA', label: 'BLOQUEADA', disponible: true },
    { value: 'SUSPENDIDA', label: 'SUSPENDIDA', disponible: true },
  ].filter(e => e.disponible);

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1F3864] mb-2">Cambio de Estado de Cuenta</h1>
        <p className="text-gray-600">Modifique el estado operativo de la cuenta</p>
      </div>

      {showSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-600 font-medium">
            El estado de la cuenta ha sido actualizado correctamente
          </AlertDescription>
        </Alert>
      )}

      <Card className="max-w-4xl mb-6">
        <CardHeader>
          <CardTitle className="text-[#1F3864]">Cambiar Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Estado Actual */}
            <div className="mb-6 pb-6 border-b">
              <Label className="mb-2 block">Estado Actual</Label>
              <Badge className="px-6 py-3 text-base bg-green-600">
                {estadoActual}
              </Badge>
            </div>

            {/* Nuevo Estado */}
            <div className="mb-6">
              <Label className="mb-3 block">Seleccione Nuevo Estado *</Label>
              <div className="space-y-3">
                {estadosDisponibles.map((estado) => (
                  <label
                    key={estado.value}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      nuevoEstado === estado.value
                        ? 'border-[#2E75B6] bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="estado"
                      value={estado.value}
                      checked={nuevoEstado === estado.value}
                      onChange={(e) => setNuevoEstado(e.target.value)}
                      className="mr-3 w-4 h-4"
                    />
                    <span className="font-medium">{estado.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Alerta para BLOQUEADA */}
            {nuevoEstado === 'BLOQUEADA' && (
              <Alert className="mb-6 bg-yellow-50 border-yellow-300">
                <AlertDescription className="text-yellow-700 font-medium">
                  ⚠️ Esta acción impedirá todos los movimientos en la cuenta
                </AlertDescription>
              </Alert>
            )}

            {/* Motivo */}
            <div className="mb-6">
              <Label htmlFor="motivo">Motivo del Cambio *</Label>
              <textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E75B6] min-h-[100px]"
                placeholder="Describa el motivo del cambio de estado..."
              />
            </div>

            {/* Usuario Autorizador */}
            <div className="mb-6">
              <Label htmlFor="usuario">Usuario Autorizador</Label>
              <input
                id="usuario"
                type="text"
                value="Juan Pérez (Operador)"
                disabled
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('detalle-cuenta', { cuentaNumero })}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!nuevoEstado || !motivo}
                className="px-6 py-2 bg-[#2E75B6] text-white rounded-lg hover:bg-[#245a92] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Cambio de Estado
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Historial de Cambios */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#1F3864]">Historial de Cambios de Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado Anterior</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado Nuevo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Motivo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {historialCambios.map((cambio, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{cambio.fecha}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant="outline" className="text-xs">{cambio.estadoAnterior}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant="outline" className="text-xs">{cambio.estadoNuevo}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{cambio.motivo}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{cambio.usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Servicios REST */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-4xl">
        <p className="text-sm text-red-600 font-medium">Servicio REST:</p>
        <ul className="text-xs text-red-600 mt-2 space-y-1">
          <li>GET /api/v1/cuentas/&#123;numero&#125;</li>
          <li>PATCH /api/v1/cuentas/&#123;numero&#125;/estado</li>
        </ul>
      </div>
    </div>
  );
}
