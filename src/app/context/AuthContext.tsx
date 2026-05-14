import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { config } from '../config/env';

export type UserRole = 'CAJERO' | 'OPERADOR' | 'SUPERVISOR_AGENCIA' | 'ADMIN_CORE' | 'AUDITOR';

interface User {
  id: string;
  nombreCompleto: string;
  usuario: string;
  rol: UserRole;
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
    const storedToken = localStorage.getItem('banquito_token');
    const storedUser = localStorage.getItem('banquito_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (usuario: string, password: string) => {
    if (config.mockAuthEnabled) {
      // Autenticación mock - controlada por VITE_MOCK_AUTH_ENABLED
      const mockToken = `jwt_mock_${Date.now()}`;
      const mockUser: User = {
        id: '1',
        nombreCompleto: 'Juan Pérez López',
        usuario: usuario,
        rol: usuario === config.defaultAdminUser ? 'ADMIN_CORE' : 'OPERADOR',
        sucursal: {
          id: 'SUC-001',
          nombre: 'Matriz Quito'
        }
      };

      localStorage.setItem('banquito_token', mockToken);
      localStorage.setItem('banquito_user', JSON.stringify(mockUser));

      setToken(mockToken);
      setUser(mockUser);
    } else {
      // Autenticación real contra la API
      const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();

      localStorage.setItem('banquito_token', data.token);
      localStorage.setItem('banquito_user', JSON.stringify(data.usuario));

      setToken(data.token);
      setUser(data.usuario);
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
