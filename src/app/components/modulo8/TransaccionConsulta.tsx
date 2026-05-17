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
  const [resultados, setResultados] = useState<MovimientoCuentaResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleBuscar = async () => {
    if (!uuid.trim()) return;
    setBuscando(true);
    setError(null);
    setResultados([]);

    try {
      const txn = await TransaccionService.consultarPorUuid(uuid.trim());
      
      // Validar que la respuesta sea un arreglo con elementos
      if (Array.isArray(txn) && txn.length > 0) {
        setResultados(txn);
      } else {
        setError('No se encontró una transacción con ese número de comprobante.');
      }
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
                  setResultados([]);
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

            {resultados.length > 0 && (
              <Card className="mt-6 bg-gray-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-[#0D1B4B]">
                      {resultados.length > 1 ? 'Transferencia Encontrada' : 'Transacción Encontrada'}
                    </CardTitle>
                    <Badge
                      className={resultados[0].tipoMovimiento === 'DEBITO'
                        ? 'bg-red-600'
                        : 'bg-green-600'}
                    >
                      {resultados.length > 1 ? 'TRANSFERENCIA' : resultados[0].tipoMovimiento}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Monto</p>
                      <p className="font-medium text-xl">${Number(resultados[0].monto || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Fecha</p>
                      <p className="font-medium">{resultados[0].fechaTransaccion || '—'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Descripción</p>
                      <p className="font-medium">{resultados[0].descripcion || '—'}</p>
                    </div>
                  </div>

                  {resultados.length > 1 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-4">Detalle de Movimientos</p>
                      <div className="space-y-4">
                        {resultados.map((movimiento, index) => (
                          <div key={movimiento.uuidTransaccion} className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-3">
                              <Badge
                                className={movimiento.tipoMovimiento === 'DEBITO'
                                  ? 'bg-red-600'
                                  : 'bg-green-600'}
                              >
                                {movimiento.tipoMovimiento}
                              </Badge>
                              <div className="text-right">
                                <span className="text-xs text-gray-500 block">
                                  {movimiento.tipoMovimiento === 'DEBITO' ? 'Cuenta Origen' : 'Cuenta Destino'}
                                </span>
                                {movimiento.numeroCuenta && (
                                  <span className="text-sm font-mono text-gray-700">
                                    {movimiento.numeroCuenta}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-gray-600 mb-1">UUID</p>
                                <p className="font-mono text-xs break-all">{movimiento.uuidTransaccion}</p>
                              </div>
                              <div>
                                <p className="text-gray-600 mb-1">Saldo Resultante</p>
                                <p className="font-medium">${Number(movimiento.saldoResultante || 0).toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resultados.length === 1 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">UUID Transacción</p>
                          <p className="font-mono text-xs break-all">{resultados[0].uuidTransaccion}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Cuenta</p>
                          <p className="font-mono text-xs">{resultados[0].numeroCuenta || '—'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Saldo Resultante</p>
                          <p className="font-medium">${Number(resultados[0].saldoResultante || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
