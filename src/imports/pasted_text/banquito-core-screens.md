# PROMPT FIGMA — INTERFACES CORE BANCARIO · BanQuito

---

## CONTEXTO DEL SISTEMA

Diseña un conjunto de pantallas para el **Back-Office del Core Bancario de BanQuito**, un sistema financiero interno utilizado por operadores bancarios y agentes de sucursal. El sistema gestiona clientes, cuentas bancarias y transacciones.

**Estilo visual:**
- Design system: limpio, corporativo, confiable
- Paleta principal: azul oscuro `#1F3864` (encabezados/sidebar), azul medio `#2E75B6` (botones primarios), blanco y gris claro `#F5F7FA` (fondos de contenido)
- Tipografía: Inter o Roboto, jerarquía clara entre títulos, etiquetas y valores de datos
- Componentes: sidebar de navegación, cards de información, tablas de datos con paginación, formularios con validaciones visibles, badges de estado (ACTIVA · INACTIVA · BLOQUEADA · SUSPENDIDA)
- Tono: profesional, denso en información pero ordenado; no es una app de consumo sino una herramienta interna

**Flujo de usuario principal:** Operador de sucursal → Registra cliente → Abre cuenta → Ejecuta transacciones → Consulta historial

---

## PANTALLAS A DISEÑAR

Diseña las siguientes **11 pantallas** en Figma como frames de escritorio (1440 × 900 px). Incluye en cada pantalla una anotación lateral o footer que diga: **"Servicio REST:"** seguido del endpoint que consume.

---

### PANTALLA 1 — Dashboard Principal del Core

**Descripción:** Panel de bienvenida con accesos rápidos y métricas del día.

**Elementos UI:**
- Sidebar izquierdo con ítems: Clientes · Cuentas · Transacciones · Catálogos
- Header con nombre del operador y sucursal activa
- Cards de resumen: Total clientes registrados hoy · Cuentas abiertas hoy · Transacciones procesadas · Alertas de cuentas bloqueadas
- Tabla de últimas transacciones (5 filas) con columnas: UUID · Cuenta · Tipo · Monto · Estado
- Acceso rápido: botones "Nuevo Cliente", "Abrir Cuenta", "Nueva Transacción"

**Servicios REST que consume:**
```
GET  /api/v1/catalogos/sucursales         → para mostrar la sucursal activa del operador
GET  /api/v1/cuentas/{numero}/saldos      → resumen de saldos en cards
```

---

### PANTALLA 2 — Registro de Nuevo Cliente

**Descripción:** Formulario de creación de cliente con dos variantes: Persona Natural y Persona Jurídica.

**Elementos UI:**
- Selector tipo de cliente: toggle "Natural / Jurídico" que cambia los campos dinámicamente
- **Campos Persona Natural:** Cédula · Nombres · Apellidos · Fecha de nacimiento · Teléfono · Email · Dirección
- **Campos Persona Jurídica:** RUC · Razón Social · Nombre comercial · ID Representante Legal (buscador inline) · Email corporativo · Dirección fiscal
- Botones: "Cancelar" (gris) · "Guardar Cliente" (azul primario)
- Estado de validación visible en cada campo (verde = válido, rojo = error con mensaje)
- Al guardar exitosamente: modal de confirmación con el ID del cliente creado

**Servicios REST que consume:**
```
POST /api/v1/clientes                     → envía el formulario completo al guardar
```

---

### PANTALLA 3 — Perfil del Cliente

**Descripción:** Vista de detalle de un cliente existente con sus cuentas asociadas.

**Elementos UI:**
- Header de perfil: nombre/razón social · tipo de cliente (badge) · estado (badge ACTIVO/INACTIVO) · identificación
- Tabs: "Datos Personales" | "Cuentas" | "Historial de Cambios"
- **Tab Datos Personales:** muestra todos los campos registrados en modo lectura + botón "Editar Datos"
- **Tab Cuentas:** tabla con columnas: Número de Cuenta · Subtipo · Estado · Saldo Disponible · Fecha Apertura · Acciones (Ver detalle)
- **Tab Historial:** lista de cambios anteriores con fecha, usuario y campo modificado
- Botón flotante: "Abrir Nueva Cuenta" vinculado a Pantalla 5

**Servicios REST que consume:**
```
GET  /api/v1/clientes/{identificacion}            → datos demográficos del cliente
GET  /api/v1/clientes/{identificacion}/cuentas    → tabla de cuentas del cliente
```

---

### PANTALLA 4 — Editar Datos del Cliente

**Descripción:** Formulario de actualización parcial de datos del cliente, pre-poblado con los valores actuales.

**Elementos UI:**
- Campos editables: Dirección · Teléfono · Email · (si jurídico) ID Representante Legal con buscador
- Campos no editables (en gris): Identificación · Tipo de cliente
- Banner informativo: "Solo se pueden editar datos de contacto. Para cambios de identificación contacte a Cumplimiento."
- Botones: "Cancelar" · "Guardar Cambios" (azul)
- Al guardar: toast de éxito con mensaje "Datos actualizados correctamente"

**Servicios REST que consume:**
```
PUT  /api/v1/clientes/{identificacion}            → envía los campos modificados
GET  /api/v1/clientes/{identificacion}            → pre-carga el formulario con datos actuales
```

---

### PANTALLA 5 — Apertura de Cuenta

**Descripción:** Formulario para crear una cuenta bancaria vinculada a un cliente existente.

**Elementos UI:**
- Buscador de cliente en la parte superior (por cédula/RUC) con preview del nombre al encontrarlo
- Dropdown "Subtipo de Cuenta" (se carga dinámicamente)
- Dropdown "Sucursal" (se carga dinámicamente)
- Card resumen: "Monto mínimo de apertura: $X" (aparece al seleccionar subtipo)
- Sección "Resumen antes de confirmar": cliente · subtipo · sucursal · monto apertura
- Botones: "Cancelar" · "Abrir Cuenta"
- Modal de éxito: muestra número de cuenta generado con opción "Ir al detalle de la cuenta"

**Servicios REST que consume:**
```
GET  /api/v1/clientes/{identificacion}            → valida que el cliente exista
GET  /api/v1/catalogos/subtipos-cuenta            → carga las opciones del dropdown de subtipo
GET  /api/v1/catalogos/sucursales                 → carga las opciones del dropdown de sucursal
POST /api/v1/cuentas                              → crea la cuenta al confirmar
```

---

### PANTALLA 6 — Detalle de Cuenta y Saldos

**Descripción:** Vista completa de una cuenta con su ficha y estado financiero en tiempo real.

**Elementos UI:**
- Header: número de cuenta · badge de estado · nombre del titular
- Dos cards superiores: "Saldo Contable" (monto en grande) y "Saldo Disponible" (con leyenda "Contable − Bloqueos")
- Sección "Ficha de la Cuenta": Subtipo · Sucursal · Fecha de apertura · Titular
- Sección "Bloqueos Activos": tabla con columnas ID bloqueo · Motivo · Monto · Fecha + botón "Liberar" por fila + botón "Agregar Bloqueo"
- Accesos rápidos: "Ver Movimientos" · "Cambiar Estado" · "Nueva Transacción"

**Servicios REST que consume:**
```
GET    /api/v1/cuentas/{numero}                   → ficha de la cuenta (tipo, sucursal, fechas)
GET    /api/v1/cuentas/{numero}/saldos            → saldo contable y disponible en tiempo real
POST   /api/v1/cuentas/{numero}/bloqueos          → formulario modal "Agregar Bloqueo"
DELETE /api/v1/cuentas/{numero}/bloqueos/{id}     → botón "Liberar" en cada fila de bloqueo
```

---

### PANTALLA 7 — Cambio de Estado de Cuenta

**Descripción:** Modal o pantalla de flujo para cambiar el estado operativo de una cuenta.

**Elementos UI:**
- Estado actual resaltado con badge de color
- Selector de nuevo estado: radio buttons con opciones disponibles según estado actual (ACTIVA → INACTIVA / BLOQUEADA / SUSPENDIDA)
- Campo de texto obligatorio: "Motivo del cambio"
- Campo: "Usuario autorizador" (puede ser auto-rellenado con el operador en sesión)
- Alerta contextual: para BLOQUEADA mostrar advertencia en amarillo "Esta acción impedirá todos los movimientos en la cuenta"
- Botones: "Cancelar" · "Confirmar Cambio de Estado"
- Historial de cambios de estado debajo (tabla: fecha · estado anterior · estado nuevo · motivo · usuario)

**Servicios REST que consume:**
```
PATCH /api/v1/cuentas/{numero}/estado             → aplica el cambio al confirmar
GET   /api/v1/cuentas/{numero}                    → muestra el estado actual antes del cambio
```

---

### PANTALLA 8 — Registro de Transacción

**Descripción:** Formulario para procesar un débito o crédito sobre una cuenta.

**Elementos UI:**
- Selector Tipo de Movimiento: toggle "DÉBITO / CRÉDITO" con color diferenciado (rojo / verde)
- Campo: Número de cuenta (con validación en línea que muestra titular y saldo disponible al tabular)
- Campo: Monto (con formato numérico automático y validación de saldo disponible para débitos)
- Dropdown: Subtipo de transacción (Nómina · Proveedores · Retiro · Depósito · Transferencia)
- Campo: UUID de transacción (auto-generado con opción de editar)
- Sección "Vista previa": resumen antes de confirmar con monto final y tipo
- Botones: "Cancelar" · "Procesar Transacción"
- Modal resultado: UUID de transacción procesada · estado (EXITOSA/RECHAZADA) · hora de procesamiento

**Servicios REST que consume:**
```
GET  /api/v1/cuentas/{numero}/saldos              → valida saldo antes de permitir débito
POST /api/v1/transacciones                        → envía la transacción al confirmar
```

---

### PANTALLA 9 — Historial de Movimientos de Cuenta

**Descripción:** Consulta paginada de transacciones de una cuenta con filtros.

**Elementos UI:**
- Barra de filtros: Fecha Desde · Fecha Hasta · Subtipo de Transacción · Estado (todos/exitosas/rechazadas)
- Botón "Aplicar Filtros"
- Tabla de resultados: columnas → Fecha · UUID · Subtipo · Tipo (débito/crédito con color) · Monto · Saldo después · Estado
- Paginación inferior: navegación por páginas + selector de registros por página (10/25/50)
- Fila clickeable → abre Pantalla 10 (Detalle de transacción)
- Botón "Exportar CSV"

**Servicios REST que consume:**
```
GET  /api/v1/cuentas/{numero}/movimientos         → carga la tabla con filtros y paginación
```

---

### PANTALLA 10 — Detalle y Reverso de Transacción

**Descripción:** Vista de detalle de una transacción individual con opción de reverso si aplica.

**Elementos UI:**
- Header: UUID de la transacción · badge de estado (verde EXITOSA / rojo RECHAZADA)
- Card de datos: Cuenta · Tipo de movimiento · Monto · Subtipo · Fecha y hora · Saldo resultante
- Sección "Transacción relacionada" (aparece si es un reverso): link al UUID original
- Botón "Aplicar Reverso" (visible solo si estado = EXITOSA y el operador tiene permisos); al clickear abre modal de confirmación con campo "Motivo" y "Usuario autorizador"
- Resultado del reverso: nuevo UUID generado · enlace a la transacción compensatoria

**Servicios REST que consume:**
```
GET  /api/v1/transacciones/{uuidTransaccion}              → carga el detalle de la transacción
POST /api/v1/transacciones/{uuidTransaccion}/reverso      → ejecuta el reverso al confirmar
```

---

### PANTALLA 11 — Catálogo de Sucursales y Subtipos

**Descripción:** Pantalla de consulta de catálogos para el equipo de operaciones.

**Elementos UI:**
- Tabs: "Sucursales" | "Subtipos de Cuenta"
- **Tab Sucursales:** tabla con Código · Nombre · Ciudad · Estado; barra de búsqueda por nombre o ciudad
- **Tab Subtipos de Cuenta:** tabla con ID · Nombre · Tipo Base (Ahorro/Corriente) · Monto mínimo apertura · Estado

**Servicios REST que consume:**
```
GET  /api/v1/catalogos/sucursales                 → data del tab Sucursales
GET  /api/v1/catalogos/subtipos-cuenta            → data del tab Subtipos de Cuenta
```

---

## ENTREGABLES ESPERADOS EN FIGMA

1. **11 frames de 1440 × 900 px**, uno por pantalla, organizados en un único page llamado `Core Bancario`
2. Sidebar de navegación consistente en todas las pantallas (puede ser un componente maestro)
3. En cada frame, incluir una **anotación** (texto en color `#E74C3C`, fuera del frame o en una capa de notas) con el listado de los servicios REST que esa pantalla consume, con su método HTTP y ruta completa
4. Usar **Auto Layout** en formularios y tablas para facilitar el redimensionamiento
5. Estados de componentes: formularios deben mostrar al menos el estado vacío y el estado con error de validación

---

## RELACIÓN COMPLETA INTERFACES → SERVICIOS REST

| Pantalla | Servicio REST consumido |
|---|---|
| 1. Dashboard | `GET /api/v1/catalogos/sucursales` · `GET /api/v1/cuentas/{numero}/saldos` |
| 2. Registro de Cliente | `POST /api/v1/clientes` |
| 3. Perfil del Cliente | `GET /api/v1/clientes/{identificacion}` · `GET /api/v1/clientes/{identificacion}/cuentas` |
| 4. Editar Cliente | `GET /api/v1/clientes/{identificacion}` · `PUT /api/v1/clientes/{identificacion}` |
| 5. Apertura de Cuenta | `GET /api/v1/clientes/{identificacion}` · `GET /api/v1/catalogos/subtipos-cuenta` · `GET /api/v1/catalogos/sucursales` · `POST /api/v1/cuentas` |
| 6. Detalle de Cuenta | `GET /api/v1/cuentas/{numero}` · `GET /api/v1/cuentas/{numero}/saldos` · `POST /api/v1/cuentas/{numero}/bloqueos` · `DELETE /api/v1/cuentas/{numero}/bloqueos/{id}` |
| 7. Cambio de Estado | `GET /api/v1/cuentas/{numero}` · `PATCH /api/v1/cuentas/{numero}/estado` |
| 8. Registro de Transacción | `GET /api/v1/cuentas/{numero}/saldos` · `POST /api/v1/transacciones` |
| 9. Historial de Movimientos | `GET /api/v1/cuentas/{numero}/movimientos` |
| 10. Detalle y Reverso | `GET /api/v1/transacciones/{uuidTransaccion}` · `POST /api/v1/transacciones/{uuidTransaccion}/reverso` |
| 11. Catálogos | `GET /api/v1/catalogos/sucursales` · `GET /api/v1/catalogos/subtipos-cuenta` |
