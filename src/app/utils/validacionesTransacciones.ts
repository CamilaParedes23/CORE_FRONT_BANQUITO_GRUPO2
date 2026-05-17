// ============================================================================
// Utilidades de Validación para Transacciones
// ============================================================================

// Tipos de estados
export type CustomerStatus = 'ACTIVO' | 'SUSPENDIDO' | 'BLOQUEADO';
export type AccountStatus = 'ACTIVA' | 'INACTIVA' | 'BLOQUEADA' | 'SUSPENDIDA';

// Interfaces
export interface Customer {
  status: CustomerStatus;
}

export interface Account {
  status: AccountStatus;
  available_balance: number;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

export interface CreditManualValidationResult {
  isValid: boolean;
  isWarning: boolean;
  message: string | null;
}

// ============================================================================
// Funciones de Validación Base
// ============================================================================

/**
 * Valida si un cliente puede realizar cualquier operación
 */
export function validarCliente(customer: Customer): ValidationResult {
  if (customer.status === 'SUSPENDIDO' || customer.status === 'BLOQUEADO') {
    return {
      isValid: false,
      errorMessage: 'Transacción denegada. El titular de la cuenta se encuentra suspendido o bloqueado por auditoría.'
    };
  }
  return { isValid: true, errorMessage: '' };
}

/**
 * Valida si una cuenta puede ser ORIGEN para débito
 */
export function validarCuentaOrigen(account: Account, amount: number): ValidationResult {
  if (account.status === 'ACTIVA') {
    if (amount > account.available_balance) {
      return {
        isValid: false,
        errorMessage: `Fondos insuficientes. El saldo disponible es de $${account.available_balance.toFixed(2)}.`
      };
    }
    return { isValid: true, errorMessage: '' };
  }
  
  if (account.status === 'INACTIVA') {
    return {
      isValid: false,
      errorMessage: 'Retiro denegado. La cuenta está INACTIVA (en reposo).'
    };
  }
  
  if (account.status === 'BLOQUEADA') {
    return {
      isValid: false,
      errorMessage: 'Retiro no permitido. La cuenta origen se encuentra BLOQUEADA.'
    };
  }
  
  if (account.status === 'SUSPENDIDA') {
    return {
      isValid: false,
      errorMessage: 'Operación inválida. La cuenta seleccionada tiene una restricción total por estado SUSPENDIDA.'
    };
  }
  
  return { isValid: false, errorMessage: 'Estado de cuenta desconocido.' };
}

/**
 * Valida si una cuenta puede ser DESTINO para crédito
 */
export function validarCuentaDestino(account: Account): ValidationResult {
  if (account.status === 'ACTIVA') {
    return { isValid: true, errorMessage: '' };
  }
  
  if (account.status === 'INACTIVA') {
    // Permite crédito en cuentas inactivas
    return { isValid: true, errorMessage: '' };
  }
  
  if (account.status === 'BLOQUEADA') {
    // Permite crédito en cuentas bloqueadas
    return { isValid: true, errorMessage: '' };
  }
  
  if (account.status === 'SUSPENDIDA') {
    return {
      isValid: false,
      errorMessage: 'Operación inválida. La cuenta seleccionada tiene una restricción total por estado SUSPENDIDA.'
    };
  }
  
  return { isValid: false, errorMessage: 'Estado de cuenta desconocido.' };
}

// ============================================================================
// Validaciones por Tipo de Operación
// ============================================================================

/**
 * Validación para Débito Manual (Retiros/Salidas)
 * Solo usa cuenta ORIGEN
 */
export function validarDebitoManual(
  customer: Customer,
  account: Account,
  amount: number
): ValidationResult {
  // Validar cliente primero
  const clienteValido = validarCliente(customer);
  if (!clienteValido.isValid) {
    return clienteValido;
  }
  
  // Validar cuenta origen
  return validarCuentaOrigen(account, amount);
}

/**
 * Validación para Crédito Manual (Depósitos/Entradas)
 * Solo usa cuenta DESTINO
 */
export function validarCreditoManual(
  customer: Customer,
  account: Account
): ValidationResult {
  // Validar cliente primero
  const clienteValido = validarCliente(customer);
  if (!clienteValido.isValid) {
    return clienteValido;
  }
  
  // Validar cuenta destino
  return validarCuentaDestino(account);
}

/**
 * Validación para Transferencia (Origen y Destino)
 */
export function validarTransferencia(
  customerOrigen: Customer,
  accountOrigen: Account,
  customerDestino: Customer,
  accountDestino: Account,
  amount: number
): ValidationResult {
  // Validar cliente origen
  const clienteOrigenValido = validarCliente(customerOrigen);
  if (!clienteOrigenValido.isValid) {
    return clienteOrigenValido;
  }
  
  // Validar cliente destino
  const clienteDestinoValido = validarCliente(customerDestino);
  if (!clienteDestinoValido.isValid) {
    return clienteDestinoValido;
  }
  
  // Validar cuenta origen (con verificación de saldo)
  const cuentaOrigenValida = validarCuentaOrigen(accountOrigen, amount);
  if (!cuentaOrigenValida.isValid) {
    return cuentaOrigenValida;
  }
  
  // Validar cuenta destino
  const cuentaDestinoValida = validarCuentaDestino(accountDestino);
  if (!cuentaDestinoValida.isValid) {
    return cuentaDestinoValida;
  }
  
  return { isValid: true, errorMessage: '' };
}

// ============================================================================
// Utilidades de UI para Control de Formularios
// ============================================================================

/**
 * Determina si el formulario de Débito Manual debe estar completamente bloqueado
 */
export function debeBloquearFormularioDebito(customer: Customer, account: Account): boolean {
  const clienteValido = validarCliente(customer);
  if (!clienteValido.isValid) return true;
  
  // Bloquear si cuenta no permite débito (INACTIVA, BLOQUEADA, SUSPENDIDA)
  return account.status !== 'ACTIVA';
}

/**
 * Determina si el formulario de Crédito Manual debe estar completamente bloqueado
 */
export function debeBloquearFormularioCredito(customer: Customer, account: Account): boolean {
  const clienteValido = validarCliente(customer);
  if (!clienteValido.isValid) return true;
  
  // Bloquear solo si cuenta está suspendida
  return account.status === 'SUSPENDIDA';
}

/**
 * Determina si el formulario de Transferencia debe estar completamente bloqueado
 */
export function debeBloquearFormularioTransferencia(
  customerOrigen: Customer,
  accountOrigen: Account,
  customerDestino: Customer,
  accountDestino: Account
): boolean {
  const clienteOrigenValido = validarCliente(customerOrigen);
  if (!clienteOrigenValido.isValid) return true;
  
  const clienteDestinoValido = validarCliente(customerDestino);
  if (!clienteDestinoValido.isValid) return true;
  
  // Bloquear si cuenta origen no permite débito o cuenta destino suspendida
  const cuentaOrigenValida = validarCuentaOrigen(accountOrigen, 0);
  const cuentaDestinoValida = validarCuentaDestino(accountDestino);
  
  return !cuentaOrigenValida.isValid || !cuentaDestinoValida.isValid;
}

/**
 * Determina si el campo de monto debe estar deshabilitado
 * (para evitar que el usuario escriba en cuentas inválidas)
 */
export function debeDeshabilitarCampoMonto(customer: Customer, account: Account, esOperacionDebito: boolean): boolean {
  const clienteValido = validarCliente(customer);
  if (!clienteValido.isValid) return true;
  
  if (esOperacionDebito) {
    // Para débito, deshabilitar si cuenta no es ACTIVA
    return account.status !== 'ACTIVA';
  } else {
    // Para crédito, deshabilitar solo si cuenta está SUSPENDIDA
    return account.status === 'SUSPENDIDA';
  }
}

/**
 * Obtiene el mensaje de advertencia a mostrar en el formulario
 */
export function obtenerMensajeAdvertencia(customer: Customer, account: Account, esOperacionDebito: boolean): string | null {
  const clienteValido = validarCliente(customer);
  if (!clienteValido.isValid) {
    return clienteValido.errorMessage;
  }
  
  if (esOperacionDebito) {
    if (account.status === 'INACTIVA') {
      return 'La cuenta está inactiva. No permite débitos.';
    }
    if (account.status === 'BLOQUEADA') {
      return 'La cuenta está bloqueada. No permite débitos.';
    }
    if (account.status === 'SUSPENDIDA') {
      return 'La cuenta está suspendida. No permite débitos ni créditos.';
    }
  } else {
    if (account.status === 'SUSPENDIDA') {
      return 'La cuenta está suspendida. No permite créditos.';
    }
    if (account.status === 'INACTIVA') {
      return 'La cuenta está inactiva. Solo permite créditos.';
    }
    if (account.status === 'BLOQUEADA') {
      return 'La cuenta está bloqueada. Solo permite créditos.';
    }
  }
  
  return null;
}

// ============================================================================
// Validación Pura para Crédito Manual (Canal Retail Aislado)
// ============================================================================

/**
 * Función pura de validación para el formulario de Crédito Manual (Depósitos).
 * 
 * Esta función está completamente aislada del canal corporativo de Pagos Masivos.
 * Solo evalúa el estado del cliente y de la cuenta destino según las reglas del Core.
 * 
 * @param customer - Objeto cliente con status ('ACTIVO' | 'SUSPENDIDO' | 'BLOQUEADO')
 * @param account - Objeto cuenta con status ('ACTIVA' | 'INACTIVA' | 'BLOQUEADA' | 'SUSPENDIDA')
 * @returns Objeto con:
 *   - isValid: true si la transacción puede proceder, false si debe bloquearse
 *   - isWarning: true si es solo una advertencia informativa (permite continuar)
 *   - message: Mensaje de error o advertencia, null si no hay mensaje
 * 
 * @example
 * const result = validateCreditManualForm(customer, account);
 * if (!result.isValid) {
 *   // Mostrar error en rojo, deshabilitar botón
 * } else if (result.isWarning) {
 *   // Mostrar advertencia en naranja, mantener botón habilitado
 * } else {
 *   // Todo está bien, permitir operación
 * }
 */
export function validateCreditManualForm(
  customer: Customer,
  account: Account
): CreditManualValidationResult {
  // 1. Validación del Cliente (Prioridad #1)
  if (customer.status === 'SUSPENDIDO' || customer.status === 'BLOQUEADO') {
    return {
      isValid: false,
      isWarning: false,
      message: 'Depósito denegado. El titular de la cuenta destino se encuentra bajo auditoría o suspensión.'
    };
  }
  
  // 2. Validación de la Cuenta (Prioridad #2)
  if (account.status === 'SUSPENDIDA') {
    return {
      isValid: false,
      isWarning: false,
      message: 'Operación inválida. La cuenta destino seleccionada está suspendida por irregularidades.'
    };
  }
  
  if (account.status === 'BLOQUEADA') {
    // Cuenta bloqueada: PERMITE créditos (solo restringe salidas)
    return {
      isValid: true,
      isWarning: true,
      message: 'La cuenta está bloqueada. Solo permite créditos.'
    };
  }
  
  if (account.status === 'INACTIVA') {
    // Cuenta inactiva: PERMITE créditos (para reactivar)
    return {
      isValid: true,
      isWarning: true,
      message: 'La cuenta está inactiva. Solo permite créditos.'
    };
  }
  
  // Cuenta ACTIVA: Todo está bien
  return {
    isValid: true,
    isWarning: false,
    message: null
  };
}
