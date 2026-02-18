// Interface que representa un movimiento financiero
export interface Movimiento {
  // Identificador único del movimiento (generado por Supabase)
  id: string;
  // Cantidad de dinero del movimiento
  monto: number;
  // Descripción o concepto del movimiento
  descripcion: string;
  // Fecha del movimiento en formato ISO string
  fecha: string;
  // ID del usuario que creó el movimiento
  user_id: string;
}

// Interface que representa los totales calculados de ingresos, gastos y balance
export interface Totales {
  // Suma total de todos los ingresos
  ingresos: number;
  // Suma total de todos los gastos
  gastos: number;
  // Balance: ingresos menos gastos (positivo = ganancias, negativo = pérdidas)
  balance: number;
}

// Tipo para la función de agregar movimiento. Se usa en el formulario de transacciones
export type FuncionAgregarMovimiento = (
  // Tipo de movimiento: "ingresos" o "gastos"
  tipo: "ingresos" | "gastos",
  // Monto del movimiento como string (se convertirá a número)
  monto: string,
  // Descripción del movimiento
  descripcion: string,
) => Promise<boolean>;
