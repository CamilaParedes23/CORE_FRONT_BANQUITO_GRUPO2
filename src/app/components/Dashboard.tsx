import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../context/AuthContext';
import { config } from '../config/env';
import { Badge } from './ui/badge';
import {
  TrendingUp, Users, CreditCard, Shield, Settings,
  ClipboardList, Search, UserCheck, Lock, AlertTriangle,
  CheckCircle2, XCircle, Clock,
} from 'lucide-react';
import { ClienteService } from '../services/clienteService';
import { CuentaService } from '../services/cuentaService';
import { AuditoriaService } from '../services/auditoriaService';
import type { AuditoriaEventoResponse } from '../services/auditoriaService';

interface DashboardProps {
  navigate: (screen: string, data?: any) => void;
}

const HISTORIAL_MOCK = [
  {
    id: 1,
    descripcion: "Usuario 'cajero.norte' inició sesión en Sucursal #1",
    tiempo: 'Hace 5 min',
    tipo: 'SESION',
    resultado: 'EXITOSO',
  },
  {
    id: 2,
    descripcion: "Cuenta 0010000000002 cambió estado a BLOQUEADA por Supervisor Sur",
    tiempo: 'Hace 12 min',
    tipo: 'CUENTA',
    resultado: 'EXITOSO',
  },
  {
    id: 3,
    descripcion: "Subtipo 'ABONO_NOMINA' activado por admin",
    tiempo: 'Hace 1 hora',
    tipo: 'PARAMETRO',
    resultado: 'EXITOSO',
  },
  {
    id: 4,
    descripcion: "Intento de acceso no autorizado bloqueado — IP 192.168.1.45",
    tiempo: 'Hace 1 hora',
    tipo: 'SEGURIDAD',
    resultado: 'FALLIDO',
  },
  {
    id: 5,
    descripcion: "Override aprobado por supervisor.sur para transacción #TXN-0091",
    tiempo: 'Hace 2 horas',
    tipo: 'OVERRIDE',
    resultado: 'EXITOSO',
  },
];

const TIPO_BADGE: Record<string, string> = {
  SESION:    'bg-blue-100 text-blue-700',
  CUENTA:    'bg-purple-100 text-purple-700',
  PARAMETRO: 'bg-yellow-100 text-yellow-800',
  SEGURIDAD: 'bg-red-100 text-red-700',
  OVERRIDE:  'bg-green-100 text-green-700',
};

export default function Dashboard({ navigate }: DashboardProps) {
  const { user, hasRole } = useAuth();
  const [totalClientes, setTotalClientes] = useState<number | null>(null);
  const [totalCuentas, setTotalCuentas] = useState<number | null>(null);
  const [saldoTotal, setSaldoTotal] = useState<number | null>(null);
  const [actividadReal, setActividadReal] = useState<AuditoriaEventoResponse[]>([]);
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
        setActividadReal(auditoriaResult.value.slice(0, 5));
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

  const totalAuditoria = actividadReal.length > 0 ? `${actividadReal.length}+` : '...';

  const metricas = [
    {
      label: 'Clientes Activos',
      valor: totalClientes !== null ? totalClientes.toLocaleString() : '...',
      icon: Users,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Cuentas Abiertas',
      valor: totalCuentas !== null ? totalCuentas.toLocaleString() : '...',
      icon: CreditCard,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      label: 'Eventos de Auditoría',
      valor: loadingMetricas ? '...' : totalAuditoria,
      icon: Shield,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      label: 'Saldo Total Sistema',
      valor: formatSaldo(saldoTotal),
      icon: TrendingUp,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200',
    },
  ];

  const accesoRapido = [
    ...(hasRole(['ADMIN_CORE']) ? [{
      label: 'Gestionar Usuarios Core',
      screen: 'usuarios-core',
      icon: UserCheck,
      bg: 'bg-[#0D1B4B]',
      text: 'text-white',
      hover: 'hover:bg-[#1a2d6b]',
    }] : []),
    ...(hasRole(['ADMIN_CORE']) ? [{
      label: 'Parametrizar Subtipos',
      screen: 'parametros',
      icon: Settings,
      bg: 'bg-[#C9A84C]',
      text: 'text-[#0D1B4B]',
      hover: 'hover:bg-[#b89640]',
    }] : []),
    ...(hasRole(['ADMIN_CORE', 'AUDITOR']) ? [{
      label: 'Logs de Auditoría',
      screen: 'auditoria',
      icon: ClipboardList,
      bg: 'bg-[#0D1B4B]',
      text: 'text-white',
      hover: 'hover:bg-[#1a2d6b]',
    }] : []),
    ...(hasRole(['CAJERO', 'SUPERVISOR_AGENCIA', 'ADMIN_CORE', 'AUDITOR']) ? [{
      label: 'Consultar Transacción',
      screen: 'transaccion-consulta',
      icon: Search,
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      hover: 'hover:bg-slate-200',
    }] : []),
  ];

  return (
    <div className="p-8 bg-[#F5F7FA] min-h-full">

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0D1B4B] mb-1">
          Bienvenido, {user?.nombreCompleto}
        </h1>
        <p className="text-gray-500 text-sm">Panel de Control Operativo — {config.appName} {config.appSubtitle}</p>
        <div className="flex gap-2 mt-3">
          <Badge className="bg-[#0D1B4B] text-white">{user?.rol}</Badge>
          {user?.sucursal && <Badge variant="outline">{user.sucursal.nombre}</Badge>}
        </div>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {metricas.map((m, i) => {
          const Icon = m.icon;
          return (
            <Card key={i} className={`border ${m.borderColor} hover:shadow-md transition-shadow`}>
              <CardContent className="pt-5 pb-5">
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${m.bgColor} mb-4`}>
                  <Icon className={`w-6 h-6 ${m.iconColor}`} />
                </div>
                <div className="text-3xl font-bold text-[#0D1B4B] mb-1">
                  {loadingMetricas && m.valor === '...' ? (
                    <span className="text-gray-300 animate-pulse">—</span>
                  ) : m.valor}
                </div>
                <div className="text-sm text-gray-500">{m.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Columnas principales */}
      <div className="grid grid-cols-2 gap-6 mb-8">

        {/* Historial de Auditoría Administrativa */}
        <Card className="border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#0D1B4B] flex items-center gap-2 text-base">
              <Clock className="w-4 h-4 text-blue-500" />
              Historial de Auditoría Administrativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {HISTORIAL_MOCK.map((item) => (
                <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                  <div className="mt-0.5 flex-shrink-0">
                    {item.resultado === 'EXITOSO'
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      : <XCircle className="w-4 h-4 text-red-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0D1B4B] leading-snug">{item.descripcion}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TIPO_BADGE[item.tipo]}`}>
                        {item.tipo}
                      </span>
                      <span className="text-xs text-gray-400">{item.tiempo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumen de Control de Seguridad */}
        <Card className="border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#0D1B4B] flex items-center gap-2 text-base">
              <Shield className="w-4 h-4 text-purple-500" />
              Resumen de Control de Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0D1B4B]">Sesiones de Cajeros Activas</p>
                    <p className="text-xs text-gray-500">En este momento</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-700">14</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0D1B4B]">Bloqueos por Intento de Fraude</p>
                    <p className="text-xs text-gray-500">Cuentas bloqueadas hoy</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-red-600">2</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0D1B4B]">Solicitudes de Override Pendientes</p>
                    <p className="text-xs text-gray-500">Requieren aprobación</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-amber-600">3</span>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accesos Rápidos Administrativos */}
      <Card className="border border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#0D1B4B] text-base">Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {accesoRapido.map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.screen}
                  onClick={() => navigate(btn.screen)}
                  className={`flex flex-col items-center justify-center gap-2 p-5 rounded-xl ${btn.bg} ${btn.text} ${btn.hover} transition-all hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium text-center leading-tight">{btn.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
