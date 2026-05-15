import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CuentaInstitucionalService } from '../../services/cuentaInstitucionalService';
import type { CuentaInstitucionalResponse } from '../../services/cuentaInstitucionalService';

interface CuentasInstitucionalesListProps {
  navigate: (screen: string) => void;
}

export default function CuentasInstitucionalesList({ navigate }: CuentasInstitucionalesListProps) {
  const [cuentas, setCuentas] = useState<CuentaInstitucionalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    CuentaInstitucionalService.listar()
      .then(setCuentas)
      .catch(err => setError(err.message || 'Error al cargar cuentas institucionales'))
      .finally(() => setLoading(false));
  }, []);

  const tipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'INGRESO': return 'bg-green-600';
      case 'PASIVO': return 'bg-blue-600';
      case 'IMPUESTO': return 'bg-orange-600';
      case 'OPERATIVA': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Cuentas Institucionales</h1>
        <p className="text-gray-600">Cuentas contables del sistema</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-800">
          ⚠️ {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-[#0D1B4B]">
            Listado de Cuentas Institucionales {!loading && `(${cuentas.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando cuentas institucionales...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Número de cuenta</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nombre</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tipo</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Saldo Contable</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {cuentas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">
                        No hay cuentas institucionales registradas
                      </td>
                    </tr>
                  ) : (
                    cuentas.map((cuenta) => (
                      <tr key={cuenta.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium">{cuenta.numeroCuenta}</td>
                        <td className="py-3 px-4 text-sm">{cuenta.nombre}</td>
                        <td className="py-3 px-4 text-sm">
                          <Badge className={tipoBadgeColor(cuenta.tipoCuenta)}>
                            {cuenta.tipoCuenta}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          ${Number(cuenta.saldoContable).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <Badge className={cuenta.estado === 'ACTIVA' ? 'bg-green-600' : 'bg-gray-400'}>
                            {cuenta.estado}
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
    </div>
  );
}
