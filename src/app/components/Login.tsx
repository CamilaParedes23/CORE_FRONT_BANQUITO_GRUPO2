import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { config } from '../config/env';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ usuario: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.usuario || !formData.password) {
        throw new Error('Usuario y contraseña son requeridos');
      }

      await login(formData.usuario, formData.password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D1B4B] to-[#1a2d6b]">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-[#C9A84C] rounded-full flex items-center justify-center">
          <span className="text-3xl font-bold text-[#0D1B4B]">{config.appName.substring(0, 2).toUpperCase()}</span>
          </div>
          <CardTitle className="text-3xl font-bold text-[#0D1B4B]">{config.appName}</CardTitle>
          <p className="text-sm text-gray-600">Sistema {config.appSubtitle}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-600 text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="usuario">Usuario</Label>
              <Input
                id="usuario"
                type="text"
                value={formData.usuario}
                onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                placeholder="Ingrese su usuario"
                className="mt-2"
                autoComplete="username"
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Ingrese su contraseña"
                className="mt-2"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0D1B4B] text-white rounded-lg hover:bg-[#1a2d6b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
