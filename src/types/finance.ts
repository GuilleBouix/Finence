// Interface que representa un movimiento financiero (ingreso o gasto)
export interface Movimiento {
    id: string; // Identificador único del movimiento (generado por Supabase)
    monto: number; // Cantidad de dinero del movimiento
    descripcion: string; // Descripción o concepto del movimiento
    fecha: string; // Fecha del movimiento en formato ISO string
    user_id: string; // ID del usuario que creó el movimiento (relación con auth.users)
}

// Interface que representa los totales calculados de ingresos, gastos y balance
export interface Totales {
    ingresos: number; // Suma total de todos los ingresos
    gastos: number; // Suma total de todos los gastos
    balance: number; // Balance: ingresos menos gastos (positivo = ganancias, negativo = pérdidas)
}