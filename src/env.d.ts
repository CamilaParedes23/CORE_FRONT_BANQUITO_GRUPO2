/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base de la API del Core Bancario (ej: http://localhost:8081/api/v1/core) */
  readonly VITE_API_BASE_URL: string;

  /** Nombre de la aplicación (ej: BanQuito) */
  readonly VITE_APP_NAME: string;

  /** Subtítulo de la aplicación (ej: Core Bancario) */
  readonly VITE_APP_SUBTITLE: string;

  /** Habilitar autenticación mock: 'true' | 'false' */
  readonly VITE_MOCK_AUTH_ENABLED: string;

  /** Usuario que recibe rol ADMIN_CORE en modo mock (ej: admin) */
  readonly VITE_DEFAULT_ADMIN_USER: string;

  /** Entorno de ejecución: 'development' | 'staging' | 'production' */
  readonly VITE_ENVIRONMENT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
