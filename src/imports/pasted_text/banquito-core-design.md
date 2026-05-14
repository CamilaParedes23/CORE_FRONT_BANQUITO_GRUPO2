# Prompt: Diseño de Interfaces — Core Bancario BanQuito

## Contexto del sistema

Eres un diseñador/desarrollador UI senior. Debes crear las interfaces web del **Core Bancario de Banco BanQuito**, un sistema interno de gestión bancaria (back-office) que opera sobre una base de datos MariaDB. Este sistema es usado exclusivamente por operadores, supervisores, auditores y administradores internos del banco. No es un portal para clientes finales.

El Core es la **fuente única de verdad** de clientes, cuentas, saldos y transacciones. También expone una capa de integración con el Switch de Pagos Masivos (sistema separado).

---

## Stack y convenciones técnicas

- **Framework**: React (con TypeScript preferible) o cualquier SPA moderna.
- **Autenticación**: JWT. El token se obtiene en `/api/v1/core/auth/login`. Debe propagarse en el header `Authorization: Bearer {token}` en todas las llamadas.
- **Trazabilidad**: Todas las peticiones deben incluir el header `X-Correlation-Id` generado por el frontend.
- **Idempotencia**: Las operaciones monetarias (débito, crédito, transferencia) requieren el header `Idempotency-Key`.
- **Paginación estándar**: `?page=0&size=20&sort=campo,desc` en todos los listados.
- **Formato monetario**: Todos los valores monetarios son `NUMERIC(19,4)` en USD. Mostrar siempre con 2 decimales y símbolo `$`.
- **Base URL Core**: `/api/v1/core`
- **Respuestas**: JSON con estructura `{ data, meta, errors, correlationId }`.
- **Códigos de error relevantes**: 400 (validación), 401 (no autenticado), 403 (sin permiso), 404 (no encontrado), 409 (duplicidad/idempotencia), 422 (regla de negocio), 500 (error interno).

---

## Roles de usuario

| Rol | Acceso |
|-----|--------|
| `CAJERO` | Consultas de clientes, cuentas y movimientos |
| `OPERADOR` | Todo lo anterior + crear clientes, cuentas, ejecutar transacciones |
| `SUPERVISOR_AGENCIA` | Todo lo anterior + cambiar estados, gestionar bloqueos, habilitar pagos masivos |
| `ADMIN_CORE` | Acceso total incluyendo usuarios, parámetros, sucursales y auditoría |
| `AUDITOR` | Solo lectura: auditoría, historial de estados, movimientos institucionales |

El menú lateral y los botones de acción deben mostrarse u ocultarse según el rol del usuario autenticado (obtenido en `GET /api/v1/core/auth/me`).

---

## Módulos e interfaces requeridas

---

### MÓDULO 1 — Seguridad y Sesión

**Pantalla 1.1 — Login**
- Endpoint: `POST /api/v1/core/auth/login`
- Campos: usuario (texto), contraseña (password).
- Al autenticar, guardar JWT y datos del usuario en estado global.
- Mostrar error específico si credenciales incorrectas (401) o cuenta bloqueada (403).
- Redirigir al Dashboard tras login exitoso.

**Pantalla 1.2 — Header de sesión activa**
- Endpoint: `GET /api/v1/core/auth/me`
- Mostrar en el header: nombre completo, rol, sucursal (si aplica).
- Botón de cerrar sesión que llame a `POST /api/v1/core/auth/logout` y limpie el token.

---

### MÓDULO 2 — Usuarios Core (solo ADMIN_CORE)

**Pantalla 2.1 — Listado de usuarios internos**
- Endpoint: `GET /api/v1/core/usuarios-core`
- Tabla con columnas: ID, nombre, usuario, rol, sucursal, estado, último login.
- Filtros: por rol, sucursal, estado.
- Paginación estándar.
- Botón "Nuevo usuario" (abre modal).

**Pantalla 2.2 — Crear usuario interno (modal)**
- Endpoint: `POST /api/v1/core/usuarios-core`
- Campos: nombre completo, usuario, contraseña, rol (select: CAJERO / OPERADOR / SUPERVISOR_AGENCIA / ADMIN_CORE / AUDITOR), sucursal (select, obligatorio para roles de agencia).

**Pantalla 2.3 — Cambiar estado de usuario (modal inline)**
- Endpoint: `PATCH /api/v1/core/usuarios-core/{id}/estado`
- Opciones: ACTIVO, BLOQUEADO, INACTIVO.
- Pedir confirmación antes de ejecutar.

---

### MÓDULO 3 — Credenciales Web Corporativas (OPERADOR / SUPERVISOR / ADMIN)

**Pantalla 3.1 — Ver credenciales de un cliente**
- Endpoint: `GET /api/v1/core/clientes/{clienteId}/credenciales-web`
- Listado de usuarios web del cliente jurídico: usuario, estado, último login.

**Pantalla 3.2 — Crear credencial web (modal)**
- Endpoint: `POST /api/v1/core/clientes/{clienteId}/credenciales-web`
- Solo para clientes de tipo JURÍDICO.
- Campos: usuario, contraseña temporal.

**Pantalla 3.3 — Cambiar estado de credencial (modal inline)**
- Endpoint: `PATCH /api/v1/core/credenciales-web/{id}/estado`
- Opciones: ACTIVO, BLOQUEADO, EXPIRADO, INACTIVO.
- Requerir confirmación.

---

### MÓDULO 4 — Sucursales (ADMIN_CORE)

**Pantalla 4.1 — Listado de sucursales**
- Endpoint: `GET /api/v1/core/sucursales`
- Tabla: código, nombre, ciudad, estado.
- Botón "Nueva sucursal".

**Pantalla 4.2 — Crear / Editar sucursal (modal)**
- Endpoints: `POST /api/v1/core/sucursales` | `PATCH /api/v1/core/sucursales/{id}`
- Campos: código, nombre, ciudad, dirección, estado.

---

### MÓDULO 5 — Clientes

**Pantalla 5.1 — Listado de clientes**
- Endpoint: `GET /api/v1/core/clientes`
- Tabla: identificación, tipo (NATURAL/JURÍDICO), nombre/razón social, segmento, estado, pagos masivos activo.
- Filtros: tipo de cliente, estado, pagos masivos, texto libre de identificación.
- Paginación. Botón "Nuevo cliente" con opción Natural o Jurídico.
- Clic en fila navega a ficha del cliente.

**Pantalla 5.2 — Búsqueda rápida de cliente por identificación**
- Endpoint: `GET /api/v1/core/clientes/identificacion/{tipo}/{numero}`
- Barra de búsqueda global en el header o dentro del módulo.
- Selector de tipo: CEDULA / RUC / PASAPORTE + campo de número.
- Si encuentra, redirige a la ficha. Si no, ofrece crear.

**Pantalla 5.3 — Ficha de cliente**
- Endpoint: `GET /api/v1/core/clientes/{id}`
- Vista de detalle: datos demográficos completos, segmento, estado, representante legal (si jurídico).
- Tabs: Datos Generales | Cuentas | Credenciales Web.
- Botones según rol: Editar datos, Cambiar estado, Habilitar/Deshabilitar pagos masivos.

**Pantalla 5.4 — Crear cliente persona natural (formulario)**
- Endpoint: `POST /api/v1/core/clientes/naturales`
- Campos: tipo identificación (CEDULA/PASAPORTE), número, nombres, apellidos, fecha de nacimiento, correo, teléfono, dirección, segmento.
- Validación de cédula ecuatoriana en frontend.

**Pantalla 5.5 — Crear cliente persona jurídica (formulario)**
- Endpoint: `POST /api/v1/core/clientes/juridicos`
- Campos: RUC (13 dígitos), razón social, fecha constitución, correo, teléfono, dirección, segmento.
- Campo representante legal: buscador que llama a `GET /api/v1/core/clientes/identificacion/{tipo}/{numero}` para localizar un cliente natural ya existente.

**Pantalla 5.6 — Editar datos del cliente (modal/drawer)**
- Endpoint: `PATCH /api/v1/core/clientes/{id}`
- Campos editables: dirección, teléfono, correo, representante legal (solo jurídicos).

**Pantalla 5.7 — Cambiar estado del cliente (modal)**
- Endpoint: `PATCH /api/v1/core/clientes/{id}/estado`
- Opciones: ACTIVO, INACTIVO, SUSPENDIDO. Requiere motivo y confirmación.

**Pantalla 5.8 — Habilitar/deshabilitar pagos masivos (modal)**
- Endpoint: `PATCH /api/v1/core/clientes/{id}/pagos-masivos`
- Solo disponible para clientes JURÍDICOS (verificar `tipoCliente` antes de mostrar).
- Toggle con confirmación. Mostrar advertencia si se deshabilita.

---

### MÓDULO 6 — Cuentas

**Pantalla 6.1 — Listado de cuentas**
- Endpoint: `GET /api/v1/core/cuentas`
- Filtros: número de cuenta, clienteId, sucursal, estado, tipo base.
- Tabla: número, titular, tipo/subtipo, saldo disponible, estado.
- Clic en fila navega a ficha de cuenta.

**Pantalla 6.2 — Ficha de cuenta**
- Endpoint: `GET /api/v1/core/cuentas/{numeroCuenta}`
- Sección superior: número, titular, subtipo, sucursal, fecha apertura, estado.
- Tabs: Saldo y Bloqueos | Movimientos | Historial de Estados.

**Pantalla 6.3 — Saldo en tiempo real**
- Endpoint: `GET /api/v1/core/cuentas/{numeroCuenta}/saldo`
- Dentro de la ficha: tarjeta con saldo contable, total bloqueado y saldo disponible.
- Botón de refresh. Actualización automática cada 30 segundos si la pantalla está activa.

**Pantalla 6.4 — Movimientos de cuenta**
- Endpoint: `GET /api/v1/core/cuentas/{numeroCuenta}/movimientos`
- Tabla: fecha, tipo (DÉBITO/CRÉDITO), subtipo, monto, saldo resultante, canal, referencia externa.
- Filtros: fecha desde/hasta, tipo movimiento, subtipo.
- Paginación. Exportar a CSV.

**Pantalla 6.5 — Apertura de cuenta (formulario)**
- Endpoint: `POST /api/v1/core/cuentas`
- Campos: clienteId (buscador de cliente), sucursal (select via `GET /api/v1/core/sucursales`), subtipo de cuenta (select via `GET /api/v1/core/subtipos-cuenta`).

**Pantalla 6.6 — Cambiar estado de cuenta (modal)**
- Endpoint: `PATCH /api/v1/core/cuentas/{numeroCuenta}/estado`
- Estados: ACTIVA, INACTIVA, BLOQUEADA, SUSPENDIDA.
- Requiere motivo. Rol mínimo: SUPERVISOR_AGENCIA.

**Pantalla 6.7 — Historial de estados de cuenta**
- Endpoint: `GET /api/v1/core/cuentas/{numeroCuenta}/historial-estados`
- Timeline vertical: estado anterior → estado nuevo, motivo, usuario, fecha/hora.

**Pantalla 6.8 — Gestión de cuenta favorita para pagos masivos**
- Endpoint: `PATCH /api/v1/core/cuentas/{numeroCuenta}/favorita-pagos`
- Switch/toggle dentro de la ficha de cuenta. Solo visible en cuentas de clientes JURÍDICOS con pagos masivos activos.
- Mostrar nota aclaratoria: "La cuenta favorita es referencial; en V1 el canal SFTP siempre usa la cuenta declarada en el archivo."

---

### MÓDULO 7 — Bloqueos de Fondos

**Pantalla 7.1 — Bloqueos activos de una cuenta**
- Se muestra dentro de la Pantalla 6.2 (Ficha de cuenta), tab "Saldo y Bloqueos".
- Listar bloqueos activos: monto bloqueado, motivo, autoridad ordenante, fecha, usuario que lo registró.
- Botón "Nuevo bloqueo" y botón "Liberar" por cada registro activo.

**Pantalla 7.2 — Crear bloqueo (modal)**
- Endpoint: `POST /api/v1/core/cuentas/{numeroCuenta}/bloqueos`
- Campos: monto, motivo (JUDICIAL / PREVIO_PAGO / GARANTIA), autoridad ordenante (texto), observaciones.
- Rol mínimo: SUPERVISOR_AGENCIA.

**Pantalla 7.3 — Liberar bloqueo (modal de confirmación)**
- Endpoint: `PATCH /api/v1/core/bloqueos/{id}/liberar`
- Mostrar monto a liberar. Pedir motivo de liberación y confirmación.

---

### MÓDULO 8 — Transacciones

**Pantalla 8.1 — Ejecutar débito manual (formulario)**
- Endpoint: `POST /api/v1/core/transacciones/debito`
- Header: `Idempotency-Key` (UUID generado automáticamente por el frontend, visible y copiable).
- Campos: número de cuenta, subtipo (select via `GET /api/v1/core/subtipos-transaccion`), monto, descripción.
- Confirmación explícita antes de ejecutar. Mostrar resultado con UUID de la transacción.

**Pantalla 8.2 — Ejecutar crédito manual (formulario)**
- Endpoint: `POST /api/v1/core/transacciones/credito`
- Misma estructura que débito.

**Pantalla 8.3 — Ejecutar transferencia (formulario)**
- Endpoint: `POST /api/v1/core/transacciones/transferencia`
- Header: `Idempotency-Key`.
- Campos: cuenta origen, cuenta destino, subtipo, monto, descripción, UUID de grupo (generado automáticamente).
- Mostrar saldo disponible de cuenta origen antes de confirmar.

**Pantalla 8.4 — Consultar transacción por UUID**
- Endpoint: `GET /api/v1/core/transacciones/{uuid}`
- Buscador por UUID. Mostrar: tipo, monto, cuenta(s) afectada(s), estado, canal, fecha, saldo resultante.

---

### MÓDULO 9 — Cuentas Institucionales (AUDITOR / ADMIN)

**Pantalla 9.1 — Listado de cuentas institucionales**
- Endpoint: `GET /api/v1/core/cuentas-institucionales`
- Tabla: código, nombre, tipo (INGRESO/PASIVO/IMPUESTO/OPERATIVA), saldo contable.

**Pantalla 9.2 — Movimientos de cuenta institucional**
- Endpoint: `GET /api/v1/core/cuentas-institucionales/{codigo}/movimientos`
- Misma estructura que movimientos de cuenta cliente.

---

### MÓDULO 10 — Feriados (ADMIN_CORE)

**Pantalla 10.1 — Calendario de feriados**
- Endpoint: `GET /api/v1/core/feriados`
- Vista calendario + tabla. Columnas: fecha, nombre, es fin de semana, estado.
- Indicar visualmente qué fechas son feriados configurados vs fines de semana.
- Botón para agregar feriado (formulario simple: fecha, nombre).

---

### MÓDULO 11 — Parámetros del Sistema (ADMIN_CORE)

**Pantalla 11.1 — Listado de parámetros**
- Endpoint: `GET /api/v1/core/parametros`
- Tabla: código, nombre, valor, tipo de dato, descripción, última modificación.
- Botón editar por fila.

**Pantalla 11.2 — Editar parámetro (modal)**
- Endpoint: `PATCH /api/v1/core/parametros/{codigo}`
- Campo de valor con validación según tipo de dato (NUMERICO / CADENA / FECHA / HORA / BOOLEANO).
- Advertencia: "Cambiar este parámetro puede afectar el comportamiento del sistema en producción."

---

### MÓDULO 12 — Auditoría (AUDITOR / ADMIN_CORE)

**Pantalla 12.1 — Bitácora de eventos**
- Endpoint: `GET /api/v1/core/auditoria`
- Tabla: fecha, módulo, acción, entidad, ID entidad, resultado, canal, usuario, IP.
- Filtros: fecha desde/hasta, módulo, resultado (EXITOSO/FALLIDO/RECHAZADO), usuario.
- Solo lectura. Exportar a CSV.

---

### MÓDULO 13 — Observabilidad

**Pantalla 13.1 — Estado del sistema (disponible para todos los roles)**
- Endpoint: `GET /api/v1/core/health`
- Tarjeta simple: estado del servicio Core y conexión MariaDB (OPERATIVO / DEGRADADO / CAÍDO).
- Mostrar en el footer o como panel accesible desde el menú.

---

## Requisitos de UX transversales

- **Tono visual**: Profesional y sobrio. Paleta: azul marino oscuro (`#0D1B4B`) como color institucional de BanQuito, con acentos dorados (`#C9A84C`). Fondo claro para interfaces de trabajo.
- **Navegación**: Menú lateral colapsable con agrupación por módulos. Breadcrumb en todas las pantallas internas.
- **Estados de carga**: Spinner o skeleton en cada llamada API. Nunca dejar la interfaz sin feedback visual.
- **Manejo de errores**: Toast/notificación por cada error de API. Para errores 422 mostrar el mensaje de regla de negocio directamente. Para errores 409 mostrar "Esta operación ya fue procesada anteriormente" con el UUID existente.
- **Confirmaciones**: Cualquier operación que afecte saldos, estados o bloqueos debe pedir confirmación explícita con un modal que repita los datos clave antes de ejecutar.
- **Responsive mínimo**: Las pantallas de listado y ficha deben funcionar en pantallas de 1280px de ancho mínimo. No es necesario diseño mobile.
- **Seguridad visual**: Marcar claramente los campos sensibles (montos, contraseñas, datos de identificación) y enmascarar contraseñas.
- **Roles**: Si el usuario no tiene permiso para una acción, el botón no debe mostrarse (no simplemente deshabilitarse). Nunca mostrar datos de módulos a los que el rol no tiene acceso.
