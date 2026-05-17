export type CustomerStatus = 'ACTIVO' | 'SUSPENDIDO' | 'BLOQUEADO';
export type AccountStatus = 'ACTIVA' | 'INACTIVA' | 'BLOQUEADA' | 'SUSPENDIDA';
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

export function validarCliente(customer: Customer): ValidationResult {
  if (customer.status === 'SUSPENDIDO' || customer.status === 'BLOQUEADO') {
    return {
      isValid: false,
      errorMessage: 'Transacción denegada. El titular de la cuenta se encuentra suspendido o bloqueado por auditoría.'
    };
  }
  return { isValid: true, errorMessage: '' };
}

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

export function validarCuentaDestino(account: Account): ValidationResult {
  if (account.status === 'ACTIVA') {
    return { isValid: true, errorMessage: '' };
  }
  
  if (account.status === 'INACTIVA') {
    return { isValid: true, errorMessage: '' };
  }
  
  if (account.status === 'BLOQUEADA') {
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

export function validarDebitoManual(
  customer: Customer,
  account: Account,
  amount: number
): ValidationResult {
  const clienteValido = validarCliente(customer);
  if (!clienteValido.isValid) {
    return clienteValido;
  }
  return validarCuentaOrigen(account, amount);
}

export function validarCreditoManual(
  customer: Customer,
  account: Account
): ValidationResult {
  const clienteValido = validarCliente(customer);
  if (!clienteValido.isValid) {
    return clienteValido;
  }
  return validarCuentaDestino(account);
}

export function validarTransferencia(
  customerOrigen: Customer,
  accountOrigen: Account,
  customerDestino: Customer,
  accountDestino: Account,
  amount: number
): ValidationResult {
  const clienteOrigenValido = validarCliente(customerOrigen);
  if (!clienteOrigenValido.isValid) {
    return clienteOrigenValido;
  }
  
  const clienteDestinoValido = validarCliente(customerDestino);
  if (!clienteDestinoValido.isValid) {
    return clienteDestinoValido;
  }
  
  const cuentaOrigenValida = validarCuentaOrigen(accountOrigen, amount);
  if (!cuentaOrigenValida.isValid) {
    return cuentaOrigenValida;
  }
  const cuentaDestinoValida = validarCuentaDestino(accountDestino);
  if (!cuentaDestinoValida.isValid) {
    return cuentaDestinoValida;
  }
  
  return { isValid: true, errorMessage: '' };
}

export function debeBloquearFormularioDebito(customer: Customer, account: Account): boolean {
  const clienteValido = validarCliente(customer);
  if (!clienteValido.isValid) return true;
  
  return account.status !== 'ACTIVA';
}

export function debeBloquearFormularioCredito(customer: Customer, account: Account): boolean {
  const clienteValido = validarCliente(customer);
  if (!clienteValido.isValid) return true;
  
  return account.status === 'SUSPENDIDA';
}

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
  
  const cuentaOrigenValida = validarCuentaOrigen(accountOrigen, 0);
  const cuentaDestinoValida = validarCuentaDestino(accountDestino);
  
  return !cuentaOrigenValida.isValid || !cuentaDestinoValida.isValid;
}

export function debeDeshabilitarCampoMonto(customer: Customer, account: Account, esOperacionDebito: boolean): boolean {
  const clienteValido = validarCliente(customer);
  if (!clienteValido.isValid) return true;
  
  if (esOperacionDebito) {
    return account.status !== 'ACTIVA';
  } else {
    return account.status === 'SUSPENDIDA';
  }
}

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

export function validateCreditManualForm(
  customer: Customer,
  account: Account
): CreditManualValidationResult {
  if (customer.status === 'SUSPENDIDO' || customer.status === 'BLOQUEADO') {
    return {
      isValid: false,
      isWarning: false,
      message: 'Depósito denegado. El titular de la cuenta destino se encuentra bajo auditoría o suspensión.'
    };
  }
  
  if (account.status === 'SUSPENDIDA') {
    return {
      isValid: false,
      isWarning: false,
      message: 'Operación inválida. La cuenta destino seleccionada está suspendida por irregularidades.'
    };
  }
  
  if (account.status === 'BLOQUEADA') {
    return {
      isValid: true,
      isWarning: true,
      message: 'La cuenta está bloqueada. Solo permite créditos.'
    };
  }
  
  if (account.status === 'INACTIVA') {
    return {
      isValid: true,
      isWarning: true,
      message: 'La cuenta está inactiva. Solo permite créditos.'
    };
  }
  
  return {
    isValid: true,
    isWarning: false,
    message: null
  };
}
