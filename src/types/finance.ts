// Interface que representa un movimiento financiero (ingreso o gasto)
export interface Movimiento {
  // Identificador único del movimiento (generado por Supabase)
  id: string;
  
  // Cantidad de dinero del movimiento
  monto: number;
  
  // Descripción o concepto del movimiento
  descripcion: string;
  
  // Fecha del movimiento en formato ISO string
  fecha: string;
  
  // ID del usuario que creó el movimiento (relación con auth.users)
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
