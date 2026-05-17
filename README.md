# 🏦 BanQuito — Core Bancario Frontend

> **Interfaz web del sistema Core de Cuentas del Banco BanQuito S.A.**  
> Proyecto académico universitario — Ingeniería de Software / Arquitectura de Software

---

## 📋 Descripción

Frontend React del **Core Bancario BanQuito**, conectado al backend Spring Boot (`CORE_BACK_BANQUITO_GRUPO2`). Permite la gestión integral del ciclo de vida de productos de depósito: clientes, cuentas, transacciones, feriados, parámetros y auditoría.

---

## 🚀 Tecnologías

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 18 | Framework UI |
| TypeScript | 5 | Tipado estático |
| Vite | 5 | Bundler y dev server |
| Tailwind CSS | 3 | Estilos utilitarios |
| Radix UI | Latest | Componentes accesibles (Dialog, Badge, etc.) |
| Lucide React | Latest | Íconos |

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── App.tsx                  # Raíz de la aplicación y enrutado
│   ├── config/
│   │   └── env.ts               # Variables de entorno centralizadas
│   ├── context/
│   │   └── AuthContext.tsx      # Autenticación y roles (JWT / mock)
│   ├── services/                # Capa de comunicación con la API
│   │   ├── apiClient.ts
│   │   ├── clienteService.ts
│   │   ├── cuentaService.ts
│   │   ├── transaccionService.ts
│   │   ├── usuarioCoreService.ts
│   │   ├── sucursalService.ts
│   │   ├── feriadoService.ts
│   │   └── ...
│   └── components/
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── modulo2/             # Usuarios Core
│       ├── modulo4/             # Sucursales
│       ├── modulo5/             # Clientes (Natural / Jurídico)
│       ├── modulo6/             # Cuentas
│       ├── modulo8/             # Transacciones
│       ├── modulo9/             # Cuentas Institucionales
│       ├── modulo10/            # Feriados
│       ├── modulo11/            # Parámetros Core
│       ├── modulo12/            # Auditoría / Bitácora
│       └── ui/                  # Componentes base reutilizables
```

---

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/CamilaParedes23/CORE_FRONT_BANQUITO_GRUPO2.git
cd CORE_FRONT_BANQUITO_GRUPO2
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea o edita el archivo `.env` en la raíz del proyecto:

```env
# URL del backend Spring Boot
VITE_API_BASE_URL=http://localhost:8081/api/v1/core

# Nombre de la aplicación
VITE_APP_NAME=BanQuito
VITE_APP_SUBTITLE=Core Bancario

# Autenticación mock (true = sin backend, false = con backend real)
VITE_MOCK_AUTH_ENABLED=true
VITE_DEFAULT_ADMIN_USER=admin

# Entorno
VITE_ENVIRONMENT=development
```

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

---

## 🔐 Roles y Usuarios de Prueba

Con `VITE_MOCK_AUTH_ENABLED=true` puedes usar los siguientes usuarios (contraseña: cualquier texto):

| Usuario | Rol | Acceso |
|---------|-----|--------|
| `admin` | `ADMIN_CORE` | Panel completo: usuarios, sucursales, parámetros, feriados, clientes, cuentas, transacciones, auditoría |
| `operador` | `OPERADOR` | Clientes, cuentas, transacciones (débito, crédito, transferencia, consulta) |
| `cajero` | `CAJERO` | Cuentas, consulta de transacciones, búsqueda de clientes |
| `supervisor` | `SUPERVISOR_AGENCIA` | Clientes, cuentas, transacciones |
| `auditor` | `AUDITOR` | Cuentas institucionales, bitácora de auditoría, consulta de transacciones |

> Para usar autenticación real, cambiar `VITE_MOCK_AUTH_ENABLED=false` y asegurarse de que el backend esté corriendo.

---

## 🧩 Módulos del Sistema

### � Dashboard Principal
- Panel administrativo con métricas generales del sistema
- Accesos rápidos a módulos según rol del usuario
- Historial de actividad reciente

### � Módulo 5 — Clientes
- Listado con filtros (tipo, estado, pagos masivos), búsqueda y paginación
- Registro de cliente **Persona Natural** (Cédula / Pasaporte con validación `XX1234567`)
- Registro de cliente **Persona Jurídica** (RUC)
- Ficha del cliente: datos, cambio de estado (ACTIVO / INACTIVO / SUSPENDIDO), listado de cuentas con búsqueda

### 🏦 Módulo 6 — Cuentas
- Listado con buscador por número de cuenta, filtro de estado y paginación
- Apertura de nueva cuenta
- Ficha de cuenta: información detallada, saldos (contable, disponible, bloqueado), historial de movimientos, cambio de estado con motivos predefinidos, gestión de bloqueos

### 💸 Módulo 8 — Transacciones
- **Débito Manual**: retiro/débito entre cuentas activas
- **Crédito Manual**: depósito/crédito entre cuentas activas
- **Transferencia**: transferencia interna entre cuentas BanQuito
- **Consultar Transacción**: búsqueda por UUID de movimiento

### 🔑 Módulo 2 — Usuarios Core
- Búsqueda por username
- Formulario de creación de usuario (pendiente endpoint `POST` en backend)

### 🏢 Módulo 4 — Sucursales
- Listado de sucursales activas

### 📅 Módulo 10 — Feriados
- Calendario de días no hábiles
- Formulario de agregar feriado (pendiente endpoint `POST` en backend)

### ⚙️ Módulo 11 — Parámetros Core
- Configuración de parámetros del sistema (IVA, hora de corte, etc.)

### 📊 Módulo 12 — Auditoría
- Bitácora de eventos del sistema con paginación
- Filtros por módulo y resultado
- Ordenamiento cronológico descendente (más reciente primero)
- Vista de roles para eventos de usuarios

---

## 🔗 Backend Requerido

Este frontend se conecta a: [`CORE_BACK_BANQUITO_GRUPO2`](https://github.com/CamilaParedes23/CORE_BACK_BANQUITO_GRUPO2)

- **Puerto por defecto del backend:** `8081`
- **Base de datos:** MariaDB con esquema `banquito_core`
- **Script de inicialización:** `modeloFisicoBD_Core_v4_mariadb.sql`

### Subtipos de transacción válidos en BD

| Código | Tipo | Descripción |
|--------|------|-------------|
| `DEPOSITO_VENTANILLA` | CRÉDITO | Depósito por ventanilla |
| `ABONO_NOMINA` | CRÉDITO | Abono de nómina |
| `TRANSFERENCIA_RECIBIDA` | CRÉDITO | Transferencia recibida |
| `INGRESO_SERVICIO_MASIVO` | CRÉDITO | Ingreso servicio masivo |
| `RETIRO_CAJERO` | DÉBITO | Retiro por cajero |
| `PAGO_MASIVO` | DÉBITO | Pago masivo |
| `COMPRA_COMERCIO` | DÉBITO | Compra en comercio |
| `COBRO_COMISION` | DÉBITO | Cobro de comisión |
| `PAGO_IMPUESTO` | DÉBITO | Pago de impuesto |
| `TRANSFERENCIA_SALIDA` | DÉBITO | Transferencia salida |

---

## 📦 Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo (Vite)
npm run build     # Compilar para producción
npm run preview   # Vista previa del build de producción
npm run lint      # Análisis de código con ESLint
```

---

## 👥 Equipo — Grupo 2

Proyecto académico — Banco BanQuito S.A.  
**Re-ingeniería Core V1 — Fase 1**  
Fecha: Abril / Mayo 2026

---

## 📄 Licencia

Propiedad Intelectual — Banco BanQuito S.A.  
Uso académico exclusivo.