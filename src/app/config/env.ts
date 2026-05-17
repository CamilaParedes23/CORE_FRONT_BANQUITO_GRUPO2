// ============================================================================
// Configuración centralizada del sistema - Lee variables de entorno VITE_
// ============================================================================

export const config = {
  // --- API ---
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://34.27.240.236:8081/api/v1/core',

  // --- Aplicación ---
  appName: import.meta.env.VITE_APP_NAME || 'BanQuito',
  appSubtitle: import.meta.env.VITE_APP_SUBTITLE || 'Core Bancario',

  // --- Autenticación ---
  mockAuthEnabled: import.meta.env.VITE_MOCK_AUTH_ENABLED === 'true',
  defaultAdminUser: import.meta.env.VITE_DEFAULT_ADMIN_USER || 'admin',

  // --- Entorno ---
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;
