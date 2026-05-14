import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { config } from '../../config/env';

interface TransaccionCreditoProps {
  navigate: (screen: string) => void;
}

export default function TransaccionCredito({ navigate }: TransaccionCreditoProps) {
  const [idempotencyKey] = useState(`IDK-${Date.now()}-${Math.random().toString(36).substring(7)}`);

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Crédito Manual</h1>
        <p className="text-gray-600">Ejecutar un crédito en una cuenta</p>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#0D1B4B]">Datos de la Transacción</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-700 text-sm">
              <span className="font-medium">Idempotency-Key:</span> <span className="font-mono text-xs">{idempotencyKey}</span>
            </AlertDescription>
          </Alert>

          <form className="space-y-4">
            <div>
              <Label>Número de Cuenta *</Label>
              <Input placeholder="Ej: 1001234567" className="mt-2" />
            </div>

            <div>
              <Label>Subtipo de Transacción *</Label>
              <select className="w-full mt-2 px-3 py-2 border rounded-lg">
                <option value="">Seleccione...</option>
                <option value="deposito">Depósito</option>
                <option value="nomina">Nómina</option>
                <option value="transferencia">Transferencia Recibida</option>
                <option value="devolucion">Devolución</option>
              </select>
            </div>

            <div>
              <Label>Monto *</Label>
              <Input type="number" step="0.01" placeholder="0.00" className="mt-2" />
            </div>

            <div>
              <Label>Descripción</Label>
              <textarea
                className="w-full mt-2 px-3 py-2 border rounded-lg min-h-[80px]"
                placeholder="Descripción de la transacción..."
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Ejecutar Crédito
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 max-w-4xl p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 font-medium">Endpoint API:</p>
        <p className="text-xs text-blue-600 mt-1">POST {config.apiBaseUrl}/transacciones/credito</p>
        <p className="text-xs text-blue-600">Header: Idempotency-Key</p>
      </div>
    </div>
  );
}
