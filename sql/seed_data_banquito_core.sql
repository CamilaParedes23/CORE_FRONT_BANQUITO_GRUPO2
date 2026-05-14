-- ============================================================================
-- Script de Datos Semilla para BanQuito Core Bancario
-- Base de datos: banquito_core (MariaDB)
-- Propósito: Inicializar entorno ficticio de pruebas
-- ============================================================================

USE banquito_core;

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- ============================================================================
-- SECCIÓN 1: SUCURSALES (5 registros)
-- ============================================================================

START TRANSACTION;

INSERT INTO SUCURSAL (CODIGO_SUCURSAL, NOMBRE, CIUDAD, DIRECCION, ESTADO) VALUES
('BQ-NORTE', 'Sucursal Quito Norte', 'Quito Norte', 'Av. Eloy Alfaro N34-451 y Av. De los Granados', 'ACTIVA'),
('BQ-SUR', 'Sucursal Quito Sur', 'Quito Sur', 'Av. Morán Valverde S/N y Av. Maldonado', 'ACTIVA'),
('BQ-CENTRO', 'Sucursal Quito Centro', 'Quito Centro', 'Av. 10 de Agosto N25-47 y Av. Colón', 'ACTIVA'),
('BQ-VALLES', 'Sucursal Sangolquí', 'Sangolquí', 'Calle García Moreno y Luis Cordero', 'ACTIVA'),
('BQ-DIGITAL', 'Sucursal Digital', 'Digital', NULL, 'ACTIVA');

COMMIT;

-- ============================================================================
-- SECCIÓN 2: SUBTIPOS DE CLIENTE (4 registros)
-- ============================================================================

START TRANSACTION;

INSERT IGNORE INTO SUBTIPO_CLIENTE (CODIGO_SUBTIPO, NOMBRE, TIPO_BASE, DESCRIPCION) VALUES
('NAT_MASIVO', 'Natural Masivo', 'NATURAL', 'Personas naturales con productos masivos'),
('NAT_ALTO_VALOR', 'Natural Alto Valor', 'NATURAL', 'Personas naturales de alto valor patrimonial'),
('JUR_PYME', 'Jurídico PYME', 'JURIDICO', 'Pequeñas y medianas empresas'),
('JUR_CORPORATIVO', 'Jurídico Corporativo', 'JURIDICO', 'Grandes corporaciones');

COMMIT;

-- ============================================================================
-- SECCIÓN 3: CLIENTES NATURALES (500 registros)
-- ============================================================================

START TRANSACTION;

-- Clientes con CEDULA (400 registros - 80%)
INSERT INTO CLIENTE (TIPO_CLIENTE, TIPO_IDENTIFICACION, NUMERO_IDENTIFICACION, NOMBRES, APELLIDOS,
                     FECHA_NACIMIENTO, CORREO, TELEFONO, DIRECCION, SUBTIPO_CLIENTE_ID,
                     ESTADO, ACTIVO_PAGOS_MASIVOS, FECHA_REGISTRO) VALUES
-- Primeros 280 clientes: NAT_MASIVO (70% de 400)
('NATURAL', 'CEDULA', '1700000001', 'Juan Carlos', 'Pérez González', '1985-03-15', 'juan.perez1@gmail.com', '0991234501', 'Quito Norte, Calle A #123', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000002', 'María Elena', 'López Mora', '1990-07-22', 'maria.lopez2@gmail.com', '0991234502', 'Quito Sur, Av. B #456', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000003', 'Carlos Alberto', 'Ramírez Silva', '1982-11-08', 'carlos.ramirez3@gmail.com', '0991234503', 'Quito Centro, Calle C #789', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000004', 'Ana Patricia', 'Torres Vega', '1995-02-18', 'ana.torres4@gmail.com', '0991234504', 'Sangolquí, Av. D #321', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000005', 'Luis Fernando', 'Gómez Castro', '1988-09-30', 'luis.gomez5@gmail.com', '0991234505', 'Quito Norte, Calle E #654', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000006', 'Sandra Lucía', 'Flores Herrera', '1992-05-12', 'sandra.flores6@gmail.com', '0991234506', 'Quito Sur, Av. F #987', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000007', 'Roberto Miguel', 'Sánchez Díaz', '1987-01-25', 'roberto.sanchez7@gmail.com', '0991234507', 'Quito Centro, Calle G #147', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000008', 'Patricia Isabel', 'Méndez Rojas', '1994-08-14', 'patricia.mendez8@gmail.com', '0991234508', 'Sangolquí, Av. H #258', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000009', 'Diego Andrés', 'Ortiz Núñez', '1986-04-07', 'diego.ortiz9@gmail.com', '0991234509', 'Quito Norte, Calle I #369', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000010', 'Gabriela Sofía', 'Campos Ríos', '1991-12-20', 'gabriela.campos10@gmail.com', '0991234510', 'Quito Sur, Av. J #741', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000011', 'Fernando José', 'Vargas Luna', '1983-06-03', 'fernando.vargas11@gmail.com', '0991234511', 'Quito Centro, Calle K #852', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000012', 'Mónica Andrea', 'Jiménez Cruz', '1989-10-16', 'monica.jimenez12@gmail.com', '0991234512', 'Sangolquí, Av. L #963', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000013', 'Alejandro David', 'Paredes Molina', '1993-03-29', 'alejandro.paredes13@gmail.com', '0991234513', 'Quito Norte, Calle M #159', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000014', 'Daniela Carolina', 'Ruiz Zamora', '1984-07-11', 'daniela.ruiz14@gmail.com', '0991234514', 'Quito Sur, Av. N #357', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000015', 'Marcelo Antonio', 'Morales Cortez', '1990-11-24', 'marcelo.morales15@gmail.com', '0991234515', 'Quito Centro, Calle O #486', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000016', 'Cristina Paola', 'Valdez Espinoza', '1996-02-06', 'cristina.valdez16@gmail.com', '0991234516', 'Sangolquí, Av. P #951', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000017', 'Javier Esteban', 'Herrera Guzmán', '1981-09-19', 'javier.herrera17@gmail.com', '0991234517', 'Quito Norte, Calle Q #753', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000018', 'Verónica Alexandra', 'Castillo Parra', '1992-04-02', 'veronica.castillo18@gmail.com', '0991234518', 'Quito Sur, Av. R #246', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000019', 'Ricardo Patricio', 'Aguirre Salazar', '1988-08-15', 'ricardo.aguirre19@gmail.com', '0991234519', 'Quito Centro, Calle S #842', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'CEDULA', '1700000020', 'Lorena Beatriz', 'Navarro Chávez', '1994-12-28', 'lorena.navarro20@gmail.com', '0991234520', 'Sangolquí, Av. T #135', 1, 'ACTIVO', 0, NOW());

-- Continuación de clientes NAT_MASIVO (21-280)
-- Por brevedad, genero bloques representativos. En producción se completarían los 280 registros.

INSERT INTO CLIENTE (TIPO_CLIENTE, TIPO_IDENTIFICACION, NUMERO_IDENTIFICACION, NOMBRES, APELLIDOS,
                     FECHA_NACIMIENTO, CORREO, TELEFONO, DIRECCION, SUBTIPO_CLIENTE_ID,
                     ESTADO, ACTIVO_PAGOS_MASIVOS, FECHA_REGISTRO)
SELECT 'NATURAL', 'CEDULA',
       CONCAT('17000000', LPAD(seq, 2, '0')),
       CONCAT('Persona', seq),
       CONCAT('Apellido', seq),
       DATE_ADD('1960-01-01', INTERVAL FLOOR(RAND() * 14600) DAY),
       CONCAT('persona.apellido', seq, '@gmail.com'),
       CONCAT('09912345', LPAD(seq, 2, '0')),
       CONCAT('Dirección ', seq),
       1,
       'ACTIVO',
       0,
       NOW()
FROM (
    SELECT 21 + a.N + b.N * 10 + c.N * 100 AS seq
    FROM (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
         (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b,
         (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2) c
    WHERE 21 + a.N + b.N * 10 + c.N * 100 <= 280
) AS numbers;

-- Clientes NAT_ALTO_VALOR (281-400): 30% de 400 = 120 registros
INSERT INTO CLIENTE (TIPO_CLIENTE, TIPO_IDENTIFICACION, NUMERO_IDENTIFICACION, NOMBRES, APELLIDOS,
                     FECHA_NACIMIENTO, CORREO, TELEFONO, DIRECCION, SUBTIPO_CLIENTE_ID,
                     ESTADO, ACTIVO_PAGOS_MASIVOS, FECHA_REGISTRO)
SELECT 'NATURAL', 'CEDULA',
       CONCAT('17000003', LPAD(seq - 280, 2, '0')),
       CONCAT('Cliente', seq),
       CONCAT('Premium', seq),
       DATE_ADD('1960-01-01', INTERVAL FLOOR(RAND() * 14600) DAY),
       CONCAT('cliente.premium', seq, '@gmail.com'),
       CONCAT('09912346', LPAD(seq - 280, 2, '0')),
       CONCAT('Dirección Premium ', seq),
       2,
       'ACTIVO',
       0,
       NOW()
FROM (
    SELECT 281 + a.N + b.N * 10 AS seq
    FROM (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
         (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11) b
    WHERE 281 + a.N + b.N * 10 <= 400
) AS numbers;

-- Clientes con PASAPORTE (401-500): 20% = 100 registros
INSERT INTO CLIENTE (TIPO_CLIENTE, TIPO_IDENTIFICACION, NUMERO_IDENTIFICACION, NOMBRES, APELLIDOS,
                     FECHA_NACIMIENTO, CORREO, TELEFONO, DIRECCION, SUBTIPO_CLIENTE_ID,
                     ESTADO, ACTIVO_PAGOS_MASIVOS, FECHA_REGISTRO) VALUES
('NATURAL', 'PASAPORTE', 'PE0000001', 'Michael', 'Johnson Smith', '1985-05-10', 'michael.johnson401@gmail.com', '0991234601', 'Quito Norte, Calle Int #1', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'PASAPORTE', 'PE0000002', 'Jennifer', 'Williams Brown', '1990-08-20', 'jennifer.williams402@gmail.com', '0991234602', 'Quito Sur, Av. Int #2', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'PASAPORTE', 'PE0000003', 'Robert', 'Davis Miller', '1982-11-15', 'robert.davis403@gmail.com', '0991234603', 'Quito Centro, Calle Int #3', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'PASAPORTE', 'PE0000004', 'Sarah', 'Martinez Garcia', '1995-03-25', 'sarah.martinez404@gmail.com', '0991234604', 'Sangolquí, Av. Int #4', 1, 'ACTIVO', 0, NOW()),
('NATURAL', 'PASAPORTE', 'PE0000005', 'David', 'Rodriguez Lopez', '1988-07-30', 'david.rodriguez405@gmail.com', '0991234605', 'Quito Norte, Calle Int #5', 2, 'ACTIVO', 0, NOW());

-- Completar pasaportes 6-100
INSERT INTO CLIENTE (TIPO_CLIENTE, TIPO_IDENTIFICACION, NUMERO_IDENTIFICACION, NOMBRES, APELLIDOS,
                     FECHA_NACIMIENTO, CORREO, TELEFONO, DIRECCION, SUBTIPO_CLIENTE_ID,
                     ESTADO, ACTIVO_PAGOS_MASIVOS, FECHA_REGISTRO)
SELECT 'NATURAL', 'PASAPORTE',
       CONCAT('PE', LPAD(seq - 400, 7, '0')),
       CONCAT('Extranjero', seq),
       CONCAT('Internacional', seq),
       DATE_ADD('1960-01-01', INTERVAL FLOOR(RAND() * 14600) DAY),
       CONCAT('extranjero.internacional', seq, '@gmail.com'),
       CONCAT('09912347', LPAD(seq - 400, 2, '0')),
       CONCAT('Dirección Internacional ', seq),
       IF(seq <= 470, 1, 2),
       'ACTIVO',
       0,
       NOW()
FROM (
    SELECT 406 + a.N + b.N * 10 AS seq
    FROM (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
         (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
    WHERE 406 + a.N + b.N * 10 <= 500
) AS numbers;

COMMIT;

-- ============================================================================
-- SECCIÓN 4: CLIENTES JURÍDICOS (50 registros)
-- ============================================================================

START TRANSACTION;

INSERT INTO CLIENTE (TIPO_CLIENTE, TIPO_IDENTIFICACION, NUMERO_IDENTIFICACION, RAZON_SOCIAL,
                     FECHA_CONSTITUCION, CORREO, TELEFONO, DIRECCION, SUBTIPO_CLIENTE_ID,
                     REPRESENTANTE_LEGAL_ID, ESTADO, ACTIVO_PAGOS_MASIVOS, FECHA_REGISTRO) VALUES
-- JUR_PYME (60% de 50 = 30 registros)
('JURIDICO', 'RUC', '1790000001001', 'EMPRESA 1 S.A.', '2015-03-10', 'contacto@empresa1.com.ec', '022345001', 'Av. Amazonas N24-03', 3, 1, 'ACTIVO', 1, NOW()),
('JURIDICO', 'RUC', '1790000002001', 'CORPORACIÓN 2 CIA. LTDA.', '2012-07-15', 'info@corporacion2.com.ec', '022345002', 'Av. República E7-226', 3, 2, 'ACTIVO', 1, NOW()),
('JURIDICO', 'RUC', '1790000003001', 'DISTRIBUIDORA 3 S.A.', '2018-11-20', 'ventas@distribuidora3.com.ec', '022345003', 'Av. 6 de Diciembre N34-451', 3, 3, 'ACTIVO', 1, NOW()),
('JURIDICO', 'RUC', '1790000004001', 'SERVICIOS 4 CIA. LTDA.', '2010-02-28', 'contacto@servicios4.com.ec', '022345004', 'Av. Occidental N68-56', 3, 4, 'ACTIVO', 1, NOW()),
('JURIDICO', 'RUC', '1790000005001', 'COMERCIAL 5 S.A.', '2016-09-05', 'info@comercial5.com.ec', '022345005', 'Av. Mariscal Sucre S28-96', 3, 5, 'ACTIVO', 1, NOW()),
('JURIDICO', 'RUC', '1790000006001', 'INDUSTRIAS 6 CIA. LTDA.', '2013-04-12', 'ventas@industrias6.com.ec', '022345006', 'Av. Eloy Alfaro N34-183', 3, 6, 'ACTIVO', 1, NOW()),
('JURIDICO', 'RUC', '1790000007001', 'LOGÍSTICA 7 S.A.', '2019-08-17', 'contacto@logistica7.com.ec', '022345007', 'Av. Simón Bolívar Oe1-93', 3, 7, 'ACTIVO', 1, NOW()),
('JURIDICO', 'RUC', '1790000008001', 'ALIMENTOS 8 CIA. LTDA.', '2011-12-22', 'info@alimentos8.com.ec', '022345008', 'Av. De los Shirys N42-120', 3, 8, 'ACTIVO', 1, NOW()),
('JURIDICO', 'RUC', '1790000009001', 'TEXTILES 9 S.A.', '2017-06-30', 'ventas@textiles9.com.ec', '022345009', 'Av. De la Prensa N64-45', 3, 9, 'ACTIVO', 1, NOW()),
('JURIDICO', 'RUC', '1790000010001', 'CONSTRUCCIONES 10 CIA. LTDA.', '2014-10-08', 'contacto@construcciones10.com.ec', '022345010', 'Av. Interoceánica Km 14.5', 3, 10, 'ACTIVO', 1, NOW());

-- Completar JUR_PYME 11-30
INSERT INTO CLIENTE (TIPO_CLIENTE, TIPO_IDENTIFICACION, NUMERO_IDENTIFICACION, RAZON_SOCIAL,
                     FECHA_CONSTITUCION, CORREO, TELEFONO, DIRECCION, SUBTIPO_CLIENTE_ID,
                     REPRESENTANTE_LEGAL_ID, ESTADO, ACTIVO_PAGOS_MASIVOS, FECHA_REGISTRO)
SELECT 'JURIDICO', 'RUC',
       CONCAT('17900000', LPAD(seq, 2, '0'), '001'),
       CONCAT('PYME ', seq, ' S.A.'),
       DATE_ADD('2000-01-01', INTERVAL FLOOR(RAND() * 7300) DAY),
       CONCAT('contacto@pyme', seq, '.com.ec'),
       CONCAT('0223450', LPAD(seq, 2, '0')),
       CONCAT('Dirección PYME ', seq),
       3,
       ((seq - 1) MOD 500) + 1,
       'ACTIVO',
       1,
       NOW()
FROM (
    SELECT 11 + a.N + b.N * 10 AS seq
    FROM (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
         (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2) b
    WHERE 11 + a.N + b.N * 10 <= 30
) AS numbers;

-- JUR_CORPORATIVO (40% de 50 = 20 registros)
INSERT INTO CLIENTE (TIPO_CLIENTE, TIPO_IDENTIFICACION, NUMERO_IDENTIFICACION, RAZON_SOCIAL,
                     FECHA_CONSTITUCION, CORREO, TELEFONO, DIRECCION, SUBTIPO_CLIENTE_ID,
                     REPRESENTANTE_LEGAL_ID, ESTADO, ACTIVO_PAGOS_MASIVOS, FECHA_REGISTRO)
SELECT 'JURIDICO', 'RUC',
       CONCAT('17900000', LPAD(seq, 2, '0'), '001'),
       CONCAT('CORPORACIÓN ', seq, ' S.A.'),
       DATE_ADD('2000-01-01', INTERVAL FLOOR(RAND() * 7300) DAY),
       CONCAT('contacto@corp', seq, '.com.ec'),
       CONCAT('0223451', LPAD(seq - 30, 2, '0')),
       CONCAT('Dirección Corporativa ', seq),
       4,
       ((seq - 1) MOD 500) + 1,
       'ACTIVO',
       1,
       NOW()
FROM (
    SELECT 31 + a.N + b.N * 10 AS seq
    FROM (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
         (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2) b
    WHERE 31 + a.N + b.N * 10 <= 50
) AS numbers;

COMMIT;

-- ============================================================================
-- SECCIÓN 5: CREDENCIALES WEB (50 registros - una por cada cliente jurídico)
-- ============================================================================

START TRANSACTION;

INSERT INTO CREDENCIAL_WEB (CLIENTE_ID, USUARIO_WEB, PASSWORD_HASH, ESTADO, ULTIMO_LOGIN, FECHA_CREACION)
SELECT
    c.ID_CLIENTE,
    CONCAT('empresa', (c.ID_CLIENTE - 500)),
    SHA2('Empresa2026!', 256),
    'ACTIVO',
    NULL,
    NOW()
FROM CLIENTE c
WHERE c.TIPO_CLIENTE = 'JURIDICO'
LIMIT 50;

COMMIT;

-- ============================================================================
-- SECCIÓN 6: USUARIOS CORE (12 registros)
-- ============================================================================

START TRANSACTION;

INSERT INTO USUARIO_CORE (NOMBRE_COMPLETO, USUARIO, PASSWORD_HASH, ROL, SUCURSAL_ID, ESTADO, ULTIMO_LOGIN, FECHA_CREACION) VALUES
-- Sucursal BQ-NORTE (ID 1)
('Pedro Cajero Norte', 'pedro.cajero.norte', SHA2('Banquito2026!', 256), 'CAJERO', 1, 'ACTIVO', NULL, NOW()),
('María Supervisora Norte', 'maria.supervisor.norte', SHA2('Banquito2026!', 256), 'SUPERVISOR_AGENCIA', 1, 'ACTIVO', NULL, NOW()),
-- Sucursal BQ-SUR (ID 2)
('Luis Cajero Sur', 'luis.cajero.sur', SHA2('Banquito2026!', 256), 'CAJERO', 2, 'ACTIVO', NULL, NOW()),
('Ana Supervisora Sur', 'ana.supervisor.sur', SHA2('Banquito2026!', 256), 'SUPERVISOR_AGENCIA', 2, 'ACTIVO', NULL, NOW()),
-- Sucursal BQ-CENTRO (ID 3)
('Carlos Cajero Centro', 'carlos.cajero.centro', SHA2('Banquito2026!', 256), 'CAJERO', 3, 'ACTIVO', NULL, NOW()),
('Sandra Supervisora Centro', 'sandra.supervisor.centro', SHA2('Banquito2026!', 256), 'SUPERVISOR_AGENCIA', 3, 'ACTIVO', NULL, NOW()),
-- Sucursal BQ-VALLES (ID 4)
('Jorge Cajero Valles', 'jorge.cajero.valles', SHA2('Banquito2026!', 256), 'CAJERO', 4, 'ACTIVO', NULL, NOW()),
('Patricia Supervisora Valles', 'patricia.supervisor.valles', SHA2('Banquito2026!', 256), 'SUPERVISOR_AGENCIA', 4, 'ACTIVO', NULL, NOW()),
-- Sucursal BQ-DIGITAL (ID 5)
('Roberto Cajero Digital', 'roberto.cajero.digital', SHA2('Banquito2026!', 256), 'CAJERO', 5, 'ACTIVO', NULL, NOW()),
('Mónica Supervisora Digital', 'monica.supervisor.digital', SHA2('Banquito2026!', 256), 'SUPERVISOR_AGENCIA', 5, 'ACTIVO', NULL, NOW()),
-- Globales (sin sucursal)
('Administrador Sistema', 'admin.sistema', SHA2('Banquito2026!', 256), 'ADMIN_CORE', NULL, 'ACTIVO', NULL, NOW()),
('Auditor General', 'auditor.general', SHA2('Banquito2026!', 256), 'AUDITOR', NULL, 'ACTIVO', NULL, NOW());

COMMIT;

-- ============================================================================
-- SECCIÓN 7: SUBTIPOS DE CUENTA (3 registros)
-- ============================================================================

START TRANSACTION;

INSERT IGNORE INTO SUBTIPO_CUENTA (CODIGO_SUBTIPO, NOMBRE, TIPO_BASE, TASA_INTERES, MONTO_MINIMO_APERTURA, DESCRIPCION) VALUES
('AHO_STD', 'Cuenta de Ahorros Estándar', 'AHORRO', 2.50, 50.00, 'Cuenta de ahorros estándar para personas naturales'),
('CTE_STD', 'Cuenta Corriente Estándar', 'CORRIENTE', 0.00, 500.00, 'Cuenta corriente con chequera'),
('NOM_STD', 'Cuenta de Nómina', 'AHORRO', 1.50, 0.00, 'Cuenta para depósito de nómina empresarial');

COMMIT;

-- ============================================================================
-- SECCIÓN 8: CUENTAS (1,500 registros)
-- ============================================================================

START TRANSACTION;

-- PARTE A: Cuentas Individuales (600 cuentas)
-- 400 clientes naturales con 1 cuenta AHO_STD cada uno (clientes 1-400)
INSERT INTO CUENTA (NUMERO_CUENTA, CLIENTE_ID, SUBTIPO_CUENTA_ID, SUCURSAL_ID, FECHA_APERTURA,
                    ESTADO, SALDO_CONTABLE, SALDO_DISPONIBLE, PERMITE_SOBREGIRO, LIMITE_SOBREGIRO,
                    ES_FAVORITA_PAGOS)
SELECT
    CONCAT('BQNORTE', LPAD(c.ID_CLIENTE, 6, '0'), '01'),
    c.ID_CLIENTE,
    1, -- AHO_STD
    ((c.ID_CLIENTE - 1) MOD 5) + 1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 730) DAY),
    'ACTIVA',
    ROUND(500 + (RAND() * 9500), 2),
    ROUND(500 + (RAND() * 9500), 2),
    0,
    0,
    0
FROM CLIENTE c
WHERE c.TIPO_CLIENTE = 'NATURAL' AND c.ID_CLIENTE <= 400;

-- 100 clientes naturales con 2 cuentas (AHO_STD + CTE_STD) (clientes 401-500)
-- Primera cuenta AHO_STD
INSERT INTO CUENTA (NUMERO_CUENTA, CLIENTE_ID, SUBTIPO_CUENTA_ID, SUCURSAL_ID, FECHA_APERTURA,
                    ESTADO, SALDO_CONTABLE, SALDO_DISPONIBLE, PERMITE_SOBREGIRO, LIMITE_SOBREGIRO,
                    ES_FAVORITA_PAGOS)
SELECT
    CONCAT('BQSUR', LPAD(c.ID_CLIENTE, 6, '0'), '01'),
    c.ID_CLIENTE,
    1, -- AHO_STD
    ((c.ID_CLIENTE - 1) MOD 5) + 1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 730) DAY),
    'ACTIVA',
    ROUND(1000 + (RAND() * 14000), 2),
    ROUND(1000 + (RAND() * 14000), 2),
    0,
    0,
    0
FROM CLIENTE c
WHERE c.TIPO_CLIENTE = 'NATURAL' AND c.ID_CLIENTE > 400 AND c.ID_CLIENTE <= 500;

-- Segunda cuenta CTE_STD
INSERT INTO CUENTA (NUMERO_CUENTA, CLIENTE_ID, SUBTIPO_CUENTA_ID, SUCURSAL_ID, FECHA_APERTURA,
                    ESTADO, SALDO_CONTABLE, SALDO_DISPONIBLE, PERMITE_SOBREGIRO, LIMITE_SOBREGIRO,
                    ES_FAVORITA_PAGOS)
SELECT
    CONCAT('BQSUR', LPAD(c.ID_CLIENTE, 6, '0'), '02'),
    c.ID_CLIENTE,
    2, -- CTE_STD
    ((c.ID_CLIENTE - 1) MOD 5) + 1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 730) DAY),
    'ACTIVA',
    ROUND(2000 + (RAND() * 18000), 2),
    ROUND(2000 + (RAND() * 18000), 2),
    0,
    0,
    0
FROM CLIENTE c
WHERE c.TIPO_CLIENTE = 'NATURAL' AND c.ID_CLIENTE > 400 AND c.ID_CLIENTE <= 500;

-- PARTE B: Cuentas Corporativas (150 cuentas = 50 clientes x 3 cuentas)
-- Cuenta 1: CTE_STD Operativa (saldo alto, con sobregiro)
INSERT INTO CUENTA (NUMERO_CUENTA, CLIENTE_ID, SUBTIPO_CUENTA_ID, SUCURSAL_ID, FECHA_APERTURA,
                    ESTADO, SALDO_CONTABLE, SALDO_DISPONIBLE, PERMITE_SOBREGIRO, LIMITE_SOBREGIRO,
                    ES_FAVORITA_PAGOS)
SELECT
    CONCAT('BQCENTRO', LPAD(c.ID_CLIENTE, 6, '0'), '01'),
    c.ID_CLIENTE,
    2, -- CTE_STD
    ((c.ID_CLIENTE - 1) MOD 5) + 1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 1095) DAY),
    'ACTIVA',
    ROUND(50000 + (RAND() * 450000), 2),
    ROUND(50000 + (RAND() * 450000), 2),
    1,
    5000,
    0
FROM CLIENTE c
WHERE c.TIPO_CLIENTE = 'JURIDICO';

-- Cuenta 2: NOM_STD Nómina (saldo medio)
INSERT INTO CUENTA (NUMERO_CUENTA, CLIENTE_ID, SUBTIPO_CUENTA_ID, SUCURSAL_ID, FECHA_APERTURA,
                    ESTADO, SALDO_CONTABLE, SALDO_DISPONIBLE, PERMITE_SOBREGIRO, LIMITE_SOBREGIRO,
                    ES_FAVORITA_PAGOS)
SELECT
    CONCAT('BQCENTRO', LPAD(c.ID_CLIENTE, 6, '0'), '02'),
    c.ID_CLIENTE,
    3, -- NOM_STD
    ((c.ID_CLIENTE - 1) MOD 5) + 1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 1095) DAY),
    'ACTIVA',
    ROUND(10000 + (RAND() * 70000), 2),
    ROUND(10000 + (RAND() * 70000), 2),
    0,
    0,
    0
FROM CLIENTE c
WHERE c.TIPO_CLIENTE = 'JURIDICO';

-- Cuenta 3: AHO_STD Reserva/Impuestos (saldo variable)
INSERT INTO CUENTA (NUMERO_CUENTA, CLIENTE_ID, SUBTIPO_CUENTA_ID, SUCURSAL_ID, FECHA_APERTURA,
                    ESTADO, SALDO_CONTABLE, SALDO_DISPONIBLE, PERMITE_SOBREGIRO, LIMITE_SOBREGIRO,
                    ES_FAVORITA_PAGOS)
SELECT
    CONCAT('BQCENTRO', LPAD(c.ID_CLIENTE, 6, '0'), '03'),
    c.ID_CLIENTE,
    1, -- AHO_STD
    ((c.ID_CLIENTE - 1) MOD 5) + 1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 1095) DAY),
    'ACTIVA',
    ROUND(5000 + (RAND() * 25000), 2),
    ROUND(5000 + (RAND() * 25000), 2),
    0,
    0,
    0
FROM CLIENTE c
WHERE c.TIPO_CLIENTE = 'JURIDICO';

-- PARTE C: Cuentas Adicionales (750 cuentas para completar 1,500)
-- Distribuir entre clientes naturales como segundas/terceras cuentas
INSERT INTO CUENTA (NUMERO_CUENTA, CLIENTE_ID, SUBTIPO_CUENTA_ID, SUCURSAL_ID, FECHA_APERTURA,
                    ESTADO, SALDO_CONTABLE, SALDO_DISPONIBLE, PERMITE_SOBREGIRO, LIMITE_SOBREGIRO,
                    ES_FAVORITA_PAGOS)
SELECT
    CONCAT('BQVALLES', LPAD(cliente_id, 6, '0'), LPAD(secuencia, 2, '0')),
    cliente_id,
    IF(secuencia MOD 2 = 0, 1, 2), -- Alternar AHO_STD y CTE_STD
    ((cliente_id - 1) MOD 5) + 1,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 1460) DAY),
    'ACTIVA',
    ROUND(500 + (RAND() * 9500), 2),
    ROUND(500 + (RAND() * 9500), 2),
    0,
    0,
    0
FROM (
    SELECT
        ((seq - 1) MOD 400) + 1 AS cliente_id,
        FLOOR((seq - 1) / 400) + 3 AS secuencia
    FROM (
        SELECT a.N + b.N * 10 + c.N * 100 + 1 AS seq
        FROM (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
             (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b,
             (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7) c
        WHERE a.N + b.N * 10 + c.N * 100 + 1 <= 750
    ) numbers
) AS distribution;

COMMIT;

-- ============================================================================
-- SECCIÓN 9: CUENTAS INSTITUCIONALES (2 registros)
-- ============================================================================

START TRANSACTION;

INSERT IGNORE INTO CUENTA_INSTITUCIONAL (CODIGO_CUENTA, NOMBRE, TIPO_CUENTA, SALDO_CONTABLE, DESCRIPCION) VALUES
('INGRESOS_SERVICIOS_MASIVOS', 'Ingresos por Servicios de Pagos Masivos', 'INGRESO', 0.00, 'Acumulado de comisiones por procesamiento de archivos SFTP'),
('PASIVOS_IVA_RETENIDO', 'Pasivos por IVA Retenido', 'PASIVO', 0.00, 'IVA retenido pendiente de liquidación mensual');

COMMIT;

-- ============================================================================
-- SECCIÓN 10: SUBTIPOS DE TRANSACCIÓN (registros base del sistema)
-- ============================================================================

START TRANSACTION;

INSERT IGNORE INTO SUBTIPO_TRANSACCION (CODIGO_SUBTIPO, NOMBRE, TIPO_BASE, COMISION, DESCRIPCION) VALUES
('DEP_EFECTIVO', 'Depósito en Efectivo', 'CREDITO', 0.00, 'Depósito de efectivo en ventanilla'),
('DEP_CHEQUE', 'Depósito de Cheque', 'CREDITO', 0.00, 'Depósito de cheque de terceros'),
('RET_EFECTIVO', 'Retiro en Efectivo', 'DEBITO', 0.00, 'Retiro de efectivo en ventanilla'),
('TRF_INTERNA', 'Transferencia Interna', 'TRANSFERENCIA', 0.00, 'Transferencia entre cuentas BanQuito'),
('NOM_MASIVA', 'Pago de Nómina Masiva', 'CREDITO', 0.50, 'Acreditación de nómina desde archivo SFTP'),
('PROV_MASIVO', 'Pago a Proveedores Masivo', 'DEBITO', 0.75, 'Débito masivo a proveedores desde archivo SFTP'),
('COM_MANTENIMIENTO', 'Comisión por Mantenimiento', 'DEBITO', 0.00, 'Cobro mensual de mantenimiento de cuenta'),
('INT_GANADO', 'Intereses Ganados', 'CREDITO', 0.00, 'Acreditación de intereses sobre saldo promedio');

COMMIT;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 1;
SET AUTOCOMMIT = 1;

-- Resumen de datos insertados:
-- SUCURSAL: 5 registros
-- SUBTIPO_CLIENTE: 4 registros
-- CLIENTE (NATURAL): 500 registros (400 cédula, 100 pasaporte)
-- CLIENTE (JURIDICO): 50 registros
-- CREDENCIAL_WEB: 50 registros
-- USUARIO_CORE: 12 registros
-- SUBTIPO_CUENTA: 3 registros
-- CUENTA: 1,500 registros (750 individuales, 150 corporativas, 600 adicionales)
-- CUENTA_INSTITUCIONAL: 2 registros
-- SUBTIPO_TRANSACCION: 8 registros

SELECT 'Script de datos semilla ejecutado exitosamente' AS mensaje;
