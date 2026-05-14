import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../context/AuthContext';
import { config } from '../config/env';
import { Badge } from './ui/badge';
import { TrendingUp, Users, CreditCard, ArrowRightLeft, AlertCircle } from 'lucide-react';
import { ClienteService } from '../services/clienteService';
import { CuentaService } from '../services/cuentaService';
import { AuditoriaService } from '../services/auditoriaService';
import type { AuditoriaEventoResponse } from '../services/auditoriaService';

interface DashboardProps {
  navigate: (screen: string, data?: any) => void;
}

export default function Dashboard({ navigate }: DashboardProps) {
  const { user } = useAuth();
  const [totalClientes, setTotalClientes] = useState<number | null>(null);
  const [totalCuentas, setTotalCuentas] = useState<number | null>(null);
  const [saldoTotal, setSaldoTotal] = useState<number | null>(null);
  const [actividadReciente, setActividadReciente] = useState<AuditoriaEventoResponse[]>([]);
  const [loadingMetricas, setLoadingMetricas] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      ClienteService.listar(),
      CuentaService.listar(),
      AuditoriaService.listar(),
    ]).then(([clientesResult, cuentasResult, auditoriaResult]) => {
      if (clientesResult.status === 'fulfilled') {
        setTotalClientes(clientesResult.value.length);
      }
      if (cuentasResult.status === 'fulfilled') {
        setTotalCuentas(cuentasResult.value.length);
        const total = cuentasResult.value.reduce(
          (acc, c) => acc + Number(c.saldoContable),
          0
        );
        setSaldoTotal(total);
      }
      if (auditoriaResult.status === 'fulfilled') {
        setActividadReciente(auditoriaResult.value.slice(0, 5));
      }
      setLoadingMetricas(false);
    });
  }, []);

  const formatSaldo = (val: number | null) => {
    if (val === null) return '...';
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
    return `$${val.toFixed(2)}`;
  };

  const metricas = [
    {
      label: 'Clientes Activos',
      valor: totalClientes !== null ? totalClientes.toLocaleString() : '...',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      label: 'Cuentas Abiertas',
      valor: totalCuentas !== null ? totalCuentas.toLocaleString() : '...',
      icon: CreditCard,
      color: 'text-green-600',
    },
    {
      label: 'Eventos de Auditoría',
      valor: actividadReciente.length > 0 ? actividadReciente.length.toString() + '+' : '...',
      icon: ArrowRightLeft,
      color: 'text-purple-600',
    },
    {
      label: 'Saldo Total Sistema',
      valor: formatSaldo(saldoTotal),
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-2">
          Bienvenido, {user?.nombreCompleto}
        </h1>
        <p className="text-gray-600">Dashboard del {config.appSubtitle} {config.appName}</p>
        <div className="flex gap-2 mt-3">
          <Badge className="bg-[#0D1B4B]">{user?.rol}</Badge>
          {user?.sucursal && <Badge variant="outline">{user.sucursal.nombre}</Badge>}
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {metricas.map((metrica, index) => {
          const Icon = metrica.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 ${metrica.color}`} />
                  {loadingMetricas && (
                    <span className="text-xs text-gray-400">cargando...</span>
                  )}
                </div>
                <div className="text-3xl font-bold text-[#0D1B4B] mb-2">{metrica.valor}</div>
                <div className="text-sm text-gray-600">{metrica.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Actividad Reciente desde auditoría */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#0D1B4B] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {actividadReciente.length === 0 ? (
              <p className="text-sm text-gray-500">
                {loadingMetricas ? 'Cargando...' : 'Sin actividad reciente'}
              </p>
            ) : (
              <div className="space-y-3">
                {actividadReciente.map((evento) => (
                  <div key={evento.id} className="pb-3 border-b last:border-b-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#0D1B4B]">{evento.accion}</span>
                      <Badge
                        className={`text-xs ${evento.resultado === 'EXITOSO' ? 'bg-green-600' : 'bg-red-600'}`}
                      >
                        {evento.resultado}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {evento.entidad} {evento.entidadId ? `#${evento.entidadId}` : ''}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Módulo: {evento.modulo} | {new Date(evento.fechaEvento).toLocaleString('es-EC')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estado del sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#0D1B4B]">Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-800">Backend Spring Boot</span>
                </div>
                <Badge className="bg-green-600 text-xs">Puerto 8081</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-800">Base de Datos</span>
                </div>
                <Badge className="bg-green-600 text-xs">MariaDB</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  <span className="text-sm font-medium text-blue-800">API Base</span>
                </div>
                <span className="text-xs text-blue-600 font-mono">{config.apiBaseUrl}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accesos Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0D1B4B]">Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => navigate('clientes-busqueda')}
              className="p-4 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] transition-colors"
            >
              <Users className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Buscar Cliente</p>
            </button>
            <button
              onClick={() => navigate('cuenta-nueva')}
              className="p-4 bg-[#C9A84C] text-[#0D1B4B] rounded-lg hover:bg-[#b89640] transition-colors"
            >
              <CreditCard className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Nueva Cuenta</p>
            </button>
            <button
              onClick={() => navigate('transaccion-transferencia')}
              className="p-4 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] transition-colors"
            >
              <ArrowRightLeft className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Transferencia</p>
            </button>
            <button
              onClick={() => navigate('transaccion-consulta')}
              className="p-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <TrendingUp className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Consultar Transacción</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
