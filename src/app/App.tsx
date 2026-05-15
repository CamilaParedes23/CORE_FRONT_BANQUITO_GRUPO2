import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { config } from './config/env';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { LogOut } from 'lucide-react';

// Módulo 2: Usuarios Core
import UsuariosCoreList from './components/modulo2/UsuariosCoreList';

// Módulo 4: Sucursales
import SucursalesList from './components/modulo4/SucursalesList';

// Módulo 5: Clientes
import ClientesList from './components/modulo5/ClientesList';
import ClientesBusqueda from './components/modulo5/ClientesBusqueda';
import ClienteFicha from './components/modulo5/ClienteFicha';
import ClienteNaturalForm from './components/modulo5/ClienteNaturalForm';
import ClienteJuridicoForm from './components/modulo5/ClienteJuridicoForm';

// Módulo 6: Cuentas
import CuentasList from './components/modulo6/CuentasList';
import CuentaFicha from './components/modulo6/CuentaFicha';
import CuentaAperturaForm from './components/modulo6/CuentaAperturaForm';

// Módulo 8: Transacciones
import TransaccionDebito from './components/modulo8/TransaccionDebito';
import TransaccionCredito from './components/modulo8/TransaccionCredito';
import TransaccionTransferencia from './components/modulo8/TransaccionTransferencia';
import TransaccionConsulta from './components/modulo8/TransaccionConsulta';

// Módulo 9: Cuentas Institucionales
import CuentasInstitucionalesList from './components/modulo9/CuentasInstitucionalesList';

// Módulo 10: Feriados
import FeriadosCalendario from './components/modulo10/FeriadosCalendario';

// Módulo 11: Parámetros
import ParametrosList from './components/modulo11/ParametrosList';

// Módulo 12: Auditoría
import AuditoriaBitacora from './components/modulo12/AuditoriaBitacora';

function AppContent() {
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const navigate = (screen: string, id?: string) => {
    setCurrentScreen(screen);
    if (id) setSelectedId(id);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', roles: ['CAJERO', 'OPERADOR', 'SUPERVISOR_AGENCIA', 'ADMIN_CORE', 'AUDITOR'] },

    { divider: true, label: 'ADMINISTRACIÓN', roles: ['ADMIN_CORE'] },
    { key: 'usuarios-core', label: 'Usuarios Core', roles: ['ADMIN_CORE'] },
    { key: 'sucursales', label: 'Sucursales', roles: ['ADMIN_CORE'] },
    { key: 'parametros', label: 'Parámetros', roles: ['ADMIN_CORE'] },
    { key: 'feriados', label: 'Feriados', roles: ['ADMIN_CORE'] },

    { divider: true, label: 'OPERACIONES', roles: ['CAJERO', 'OPERADOR', 'SUPERVISOR_AGENCIA', 'ADMIN_CORE'] },
    { key: 'clientes-busqueda', label: 'Buscar Cliente', roles: ['CAJERO', 'OPERADOR', 'SUPERVISOR_AGENCIA', 'ADMIN_CORE'] },
    { key: 'clientes', label: 'Clientes', roles: ['OPERADOR', 'SUPERVISOR_AGENCIA', 'ADMIN_CORE'] },
    { key: 'cuentas', label: 'Cuentas', roles: ['CAJERO', 'OPERADOR', 'SUPERVISOR_AGENCIA', 'ADMIN_CORE'] },

    { divider: true, label: 'TRANSACCIONES', roles: ['OPERADOR', 'SUPERVISOR_AGENCIA', 'ADMIN_CORE'] },
    { key: 'transaccion-debito', label: 'Débito Manual', roles: ['OPERADOR', 'SUPERVISOR_AGENCIA', 'ADMIN_CORE'] },
    { key: 'transaccion-credito', label: 'Crédito Manual', roles: ['OPERADOR', 'SUPERVISOR_AGENCIA', 'ADMIN_CORE'] },
    { key: 'transaccion-transferencia', label: 'Transferencia', roles: ['OPERADOR', 'SUPERVISOR_AGENCIA', 'ADMIN_CORE'] },
    { key: 'transaccion-consulta', label: 'Consultar Transacción', roles: ['CAJERO', 'OPERADOR', 'SUPERVISOR_AGENCIA', 'ADMIN_CORE', 'AUDITOR'] },

    { divider: true, label: 'CONTABILIDAD', roles: ['AUDITOR', 'ADMIN_CORE'] },
    { key: 'cuentas-institucionales', label: 'Cuentas Institucionales', roles: ['AUDITOR', 'ADMIN_CORE'] },

    { divider: true, label: 'AUDITORÍA', roles: ['AUDITOR', 'ADMIN_CORE'] },
    { key: 'auditoria', label: 'Bitácora de Eventos', roles: ['AUDITOR', 'ADMIN_CORE'] },
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard': return <Dashboard navigate={navigate} />;

      case 'usuarios-core': return <UsuariosCoreList navigate={navigate} />;

      case 'sucursales': return <SucursalesList navigate={navigate} />;

      case 'clientes-busqueda': return <ClientesBusqueda navigate={navigate} />;
      case 'clientes': return <ClientesList navigate={navigate} />;
      case 'cliente-ficha': return <ClienteFicha navigate={navigate} clienteId={selectedId} />;
      case 'cliente-natural-nuevo': return <ClienteNaturalForm navigate={navigate} />;
      case 'cliente-juridico-nuevo': return <ClienteJuridicoForm navigate={navigate} />;

      case 'cuentas': return <CuentasList navigate={navigate} />;
      case 'cuenta-ficha': return <CuentaFicha navigate={navigate} numeroCuenta={selectedId} />;
      case 'cuenta-nueva': return <CuentaAperturaForm navigate={navigate} clienteId={selectedId || undefined} />;

      case 'transaccion-debito': return <TransaccionDebito navigate={navigate} />;
      case 'transaccion-credito': return <TransaccionCredito navigate={navigate} />;
      case 'transaccion-transferencia': return <TransaccionTransferencia navigate={navigate} />;
      case 'transaccion-consulta': return <TransaccionConsulta navigate={navigate} />;

      case 'cuentas-institucionales': return <CuentasInstitucionalesList navigate={navigate} />;

      case 'feriados': return <FeriadosCalendario navigate={navigate} />;

      case 'parametros': return <ParametrosList navigate={navigate} />;

      case 'auditoria': return <AuditoriaBitacora navigate={navigate} />;

      default: return <Dashboard navigate={navigate} />;
    }
  };

  return (
    <div className="size-full flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D1B4B] text-white flex flex-col flex-shrink-0" style={{ minHeight: '100vh' }}>
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#C9A84C] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-[#0D1B4B]">{config.appName.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">{config.appName}</h1>
              <p className="text-xs text-white/70">{config.appSubtitle}</p>
            </div>
          </div>
        </div>

        <nav
          className="flex-1 p-4 overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(201,168,76,0.4) transparent',
          }}
        >
          {menuItems.map((item, index) => {
            if ('divider' in item && item.divider) {
              if (!hasRole(item.roles as any)) return null;
              return (
                <div key={index} className="mt-6 mb-2 px-2">
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">{item.label}</p>
                </div>
              );
            }

            if (!hasRole(item.roles as any)) return null;

            return (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors text-sm ${
                  currentScreen === item.key ? 'bg-[#C9A84C] text-[#0D1B4B] font-semibold' : 'hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <div className="text-sm mb-3">
            <p className="font-medium">{user?.nombreCompleto}</p>
            <p className="text-white/70 text-xs mt-1">{user?.rol}</p>
            {user?.sucursal && <p className="text-white/60 text-xs">{user.sucursal.nombre}</p>}
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {renderScreen()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
