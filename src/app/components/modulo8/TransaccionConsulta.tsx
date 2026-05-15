import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Search } from 'lucide-react';
import { TransaccionService } from '../../services/transaccionService';
import type { MovimientoCuentaResponse } from '../../services/transaccionService';

interface TransaccionConsultaProps {
  navigate: (screen: string) => void;
}

export default function TransaccionConsulta({ navigate }: TransaccionConsultaProps) {
  const [uuid, setUuid] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultado, setResultado] = useState<MovimientoCuentaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBuscar = async () => {
    if (!uuid.trim()) return;
    setBuscando(true);
    setError(null);
    setResultado(null);

    try {
      const txn = await TransaccionService.consultarPorUuid(uuid.trim());
      setResultado(txn);
    } catch (err: any) {
      if (err?.status === 404) {
        setError('No se encontró una transacción con ese número de comprobante.');
      } else {
        setError(err?.message || 'Error al consultar la transacción.');
      }
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Consultar Transacción</h1>
        <p className="text-gray-600">Busque una transacción por su número de comprobante</p>
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
              <Label>Número de Comprobante</Label>
              <Input
                value={uuid}
                onChange={(e) => {
                  setUuid(e.target.value);
                  setError(null);
                  setResultado(null);
                }}
                placeholder="Ej: TRF-A7F2C9E1"
                className="mt-2 font-mono text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleBuscar}
              disabled={!uuid.trim() || buscando}
              className="w-full py-3 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] disabled:opacity-50"
            >
              {buscando ? 'Buscando...' : 'Buscar Transacción'}
            </button>

            {resultado && (
              <Card className="mt-6 bg-gray-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-[#0D1B4B]">Transacción Encontrada</CardTitle>
                    <Badge
                      className={resultado.tipoMovimiento === 'DEBITO'
                        ? 'bg-red-600'
                        : 'bg-green-600'}
                    >
                      {resultado.tipoMovimiento}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">UUID Transacción</p>
                      <p className="font-mono text-xs break-all">{resultado.uuidTransaccion}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tipo Movimiento</p>
                      <p className={`font-medium ${resultado.tipoMovimiento === 'DEBITO' ? 'text-red-600' : 'text-green-600'}`}>
                        {resultado.tipoMovimiento}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Monto</p>
                      <p className="font-medium text-xl">${Number(resultado.monto).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Saldo Resultante</p>
                      <p className="font-medium">${Number(resultado.saldoResultante).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Fecha</p>
                      <p className="font-medium">{resultado.fechaTransaccion}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Descripción</p>
                      <p className="font-medium">{resultado.descripcion || '—'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
