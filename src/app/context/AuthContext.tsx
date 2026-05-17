import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { config } from '../config/env';

export type UserRole = 'CAJERO' | 'SUPERVISOR_AGENCIA' | 'ADMIN_CORE' | 'AUDITOR' | 'EMPRESA';

interface User {
  id: string;
  nombreCompleto: string;
  usuario: string;
  rol: UserRole;
  clienteId?: number;
  identificacion?: string;
  sucursal?: {
    id: string;
    nombre: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (usuario: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    localStorage.removeItem('banquito_token');
    localStorage.removeItem('banquito_user');
  }, []);

  const login = async (usuario: string, password: string) => {
    if (config.mockAuthEnabled) {
      const MOCK_USERS: Record<string, { nombreCompleto: string; rol: UserRole; sucursal: { id: string; nombre: string } }> = {
        'admin':          { nombreCompleto: 'Administrador General Core BanQuito', rol: 'ADMIN_CORE',         sucursal: { id: '1', nombre: 'Sucursal Quito Norte' } },
        'cajero.norte':   { nombreCompleto: 'Carolina Andrade - Cajera Norte',     rol: 'CAJERO',             sucursal: { id: '1', nombre: 'Sucursal Quito Norte' } },
        'supervisor.sur': { nombreCompleto: 'Miguel Cevallos - Supervisor Sur',    rol: 'SUPERVISOR_AGENCIA', sucursal: { id: '2', nombre: 'Sucursal Quito Sur' } },
        'auditor.core':   { nombreCompleto: 'Valeria Morales - Auditoria Core',    rol: 'AUDITOR',            sucursal: { id: '1', nombre: 'Sucursal Quito Norte' } },
      };

      const key = usuario.toLowerCase().trim();
      const mockData = MOCK_USERS[key];

      if (!mockData) {
        throw new Error(`Usuario no reconocido en modo demo. Use: ${Object.keys(MOCK_USERS).join(', ')}`);
      }

      const mockToken = `jwt_mock_${Date.now()}`;
      const mockUser: User = {
        id: String(Object.keys(MOCK_USERS).indexOf(key) + 1),
        nombreCompleto: mockData.nombreCompleto,
        usuario: key,
        rol: mockData.rol,
        sucursal: mockData.sucursal,
      };

      localStorage.setItem('banquito_token', mockToken);
      localStorage.setItem('banquito_user', JSON.stringify(mockUser));
      setToken(mockToken);
      setUser(mockUser);
    } else {
      const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena: password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      const loginData = data.data || data;

      let userRole: UserRole = loginData.rol as UserRole;

      if (loginData.tipoCredencial === 'CREDENCIAL_WEB' || loginData.clienteId) {
        userRole = 'EMPRESA';
      }

      const mockToken = `jwt_real_${Date.now()}`;
      const mockUser: User = {
        id: String(loginData.usuarioCoreId || loginData.id),
        nombreCompleto: loginData.nombre || loginData.razonSocial || usuario,
        usuario: loginData.usuario || usuario,
        rol: userRole,
        clienteId: loginData.clienteId,
        identificacion: loginData.identificacion,
        sucursal: undefined,
      };

      localStorage.setItem('banquito_token', mockToken);
      localStorage.setItem('banquito_user', JSON.stringify(mockUser));

      setToken(mockToken);
      setUser(mockUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('banquito_token');
    localStorage.removeItem('banquito_user');
    setToken(null);
    setUser(null);
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.rol);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token && !!user,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
