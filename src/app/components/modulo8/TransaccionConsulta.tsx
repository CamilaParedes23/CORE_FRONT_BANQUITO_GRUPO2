import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Search } from 'lucide-react';
import { config } from '../../config/env';

interface TransaccionConsultaProps {
  navigate: (screen: string) => void;
}

export default function TransaccionConsulta({ navigate }: TransaccionConsultaProps) {
  const [uuid, setUuid] = useState('');
  const [resultado, setResultado] = useState<any>(null);

  const handleBuscar = () => {
    setResultado({
      uuid: 'TXN-123456-2026',
      tipo: 'CREDITO',
      monto: '$500.00',
      cuenta: '1001234567',
      estado: 'EXITOSA',
      canal: 'CORE',
      fecha: '2026-05-01 14:25:30',
      saldoResultante: '$5,740.50',
      descripcion: 'Depósito en efectivo'
    });
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Consultar Transacción</h1>
        <p className="text-gray-600">Busque una transacción por su UUID</p>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#0D1B4B] flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Transacción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>UUID de Transacción</Label>
              <Input
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
                placeholder="Ej: TXN-123456-2026"
                className="mt-2"
              />
            </div>

            <button
              onClick={handleBuscar}
              disabled={!uuid}
              className="w-full py-3 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] disabled:opacity-50"
            >
              Buscar Transacción
            </button>

            {resultado && (
              <Card className="mt-6 bg-gray-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-[#0D1B4B]">Transacción Encontrada</CardTitle>
                    <Badge className="bg-green-600">{resultado.estado}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">UUID</p>
                      <p className="font-medium">{resultado.uuid}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tipo</p>
                      <p className={`font-medium ${resultado.tipo === 'DEBITO' ? 'text-red-600' : 'text-green-600'}`}>
                        {resultado.tipo}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Monto</p>
                      <p className="font-medium text-xl">{resultado.monto}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Cuenta</p>
                      <p className="font-medium">{resultado.cuenta}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Canal</p>
                      <p className="font-medium">{resultado.canal}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Fecha</p>
                      <p className="font-medium">{resultado.fecha}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Saldo Resultante</p>
                      <p className="font-medium">{resultado.saldoResultante}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Descripción</p>
                      <p className="font-medium">{resultado.descripcion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 max-w-4xl p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 font-medium">Endpoint API:</p>
        <p className="text-xs text-blue-600 mt-1">GET {config.apiBaseUrl}/transacciones/{uuid}</p>
      </div>
    </div>
  );
}
