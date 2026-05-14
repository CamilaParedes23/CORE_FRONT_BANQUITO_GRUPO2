import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { config } from '../../config/env';

interface CuentaAperturaFormProps {
  navigate: (screen: string, id?: string) => void;
}

export default function CuentaAperturaForm({ navigate }: CuentaAperturaFormProps) {
  const [clienteId, setClienteId] = useState('');
  const [clienteFound, setClienteFound] = useState(false);

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">Apertura de Cuenta</h1>
        <p className="text-gray-600">Crear una nueva cuenta bancaria</p>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#0D1B4B]">Datos de la Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label>Cliente (Cédula/RUC) *</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  placeholder="Ingrese cédula o RUC del cliente..."
                />
                <button
                  type="button"
                  onClick={() => setClienteFound(true)}
                  className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] whitespace-nowrap"
                >
                  Buscar
                </button>
              </div>
              {clienteFound && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    Cliente: Juan Carlos Pérez González
                  </p>
                </div>
              )}
            </div>

            {clienteFound && (
              <>
                <div>
                  <Label>Sucursal *</Label>
                  <select className="w-full mt-2 px-3 py-2 border rounded-lg">
                    <option value="">Seleccione...</option>
                    <option value="SUC-001">Matriz Quito</option>
                    <option value="SUC-002">Norte Quito</option>
                  </select>
                </div>

                <div>
                  <Label>Subtipo de Cuenta *</Label>
                  <select className="w-full mt-2 px-3 py-2 border rounded-lg">
                    <option value="">Seleccione...</option>
                    <option value="ahorro-simple">Ahorro Simple</option>
                    <option value="ahorro-programado">Ahorro Programado</option>
                    <option value="cuenta-corriente">Cuenta Corriente</option>
                  </select>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => navigate('cuentas')}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('cuentas')}
                    className="px-6 py-2 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b]"
                  >
                    Abrir Cuenta
                  </button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 max-w-4xl p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 font-medium">Endpoint API:</p>
        <p className="text-xs text-blue-600 mt-1">POST {config.apiBaseUrl}/cuentas</p>
      </div>
    </div>
  );
}
