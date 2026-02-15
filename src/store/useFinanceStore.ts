import { create } from 'zustand'
import { supabase } from '../services/supabaseClient'
import type { Movimiento, Totales } from '../types/finance'

// Interface que define la estructura del estado de la store de finanzas
interface FinanceState {
    ingresos: Movimiento[] // Lista de ingresos del usuario actual
    gastos: Movimiento[] // Lista de gastos del usuario actual
    cargando: boolean // Indica si hay una operación en curso (agregar/eliminar/actualizar)
    cargandoInicial: boolean // Indica si es la primera carga de datos (para mostrar skeleton)
    
    // Obtiene los movimientos de ingresos y gastos desde Supabase para un usuario
    obtenerDatos: (userId: string) => Promise<void>
    
    // Agrega un nuevo movimiento (ingreso o gasto) a la base de datos
    agregarMovimiento: (tipo: 'ingresos' | 'gastos', movimiento: Omit<Movimiento, 'id'>) => Promise<boolean>
    
    // Calcula los totales de ingresos, gastos y balance
    obtenerTotales: () => Totales

    // Elimina un movimiento de la base de datos
    eliminarMovimiento: (tipo: 'ingresos' | 'gastos', id: string, userId: string) => Promise<void>
    
    // Actualiza un movimiento existente en la base de datos
    actualizarMovimiento: (tipo: 'ingresos' | 'gastos', id: string, data: Partial<Movimiento>, userId: string) => Promise<void>
}

// Store de Zustand para gestionar el estado de las finanzas personales. Esta store es accesible desde cualquier componente de la aplicación
export const useFinanceStore = create<FinanceState>((set, get) => ({
    // Estado inicial: arrays vacíos y indicadores de carga
    ingresos: [],
    gastos: [],
    cargando: false,
    cargandoInicial: true,

    /**
     * Obtiene los datos de ingresos y gastos desde Supabase
     * @param userId - ID del usuario actual (de Supabase Auth)
     */
    obtenerDatos: async (userId: string) => {
        // Obtenemos el estado actual
        const estadoActual = get()
        
        // Si es la primera carga (sin datos), mostramos el skeleton
        if (estadoActual.ingresos.length === 0 && estadoActual.gastos.length === 0) {
            set({ cargandoInicial: true })
        }

        // Consultamos la tabla de ingresos para este usuario (Ordenamos por más recientes primero)
        const { data: datosIngresos } = await supabase
            .from('ingresos')
            .select('*')
            .eq('user_id', userId)
            .order('fecha', { ascending: false })

        // Consultamos la tabla de gastos para este usuario
        const { data: datosGastos } = await supabase
            .from('gastos')
            .select('*')
            .eq('user_id', userId)
            .order('fecha', { ascending: false })

        // Actualizamos el estado con los datos obtenidos
        set({ 
            ingresos: datosIngresos || [], 
            gastos: datosGastos || [], 
            cargandoInicial: false 
        })
    },

    /**
     * Agrega un nuevo movimiento (ingreso o gasto) a la base de datos
     * @param tipo - 'ingresos' o 'gastos'
     * @param movimiento - Objeto con monto, descripcion, user_id
     * @returns true si se agregó correctamente, false si hubo error
     */
    agregarMovimiento: async (tipo, payload) => {
        // Activamos el indicador de carga para mostrar feedback al usuario
        set({ cargando: true })
        
        // Insertamos el nuevo movimiento en la tabla correspondiente
        const { error } = await supabase.from(tipo).insert(payload)
        
        // Si no hay error, refrescamos los datos y retornamos éxito
        if (!error) {
            // Refrescamos los datos de la store para mantener sincronía
            await get().obtenerDatos(payload.user_id)
            set({ cargando: false })
            
            return true
        }
        
        // Si hay error, desactivamos la carga y retornamos fracaso
        set({ cargando: false })
        
        return false
    },

    /**
     * Calcula los totales de ingresos, gastos y balance
     * @returns Objeto con ingresos totales, gastos totales y balance
     */
    obtenerTotales: () => {
        // Obtenemos el estado actual de la store
        const { ingresos, gastos } = get()
        
        // Sumamos todos los montos de ingresos usando reduce
        const totalIngresos = ingresos.reduce((acumulador, movimientoActual) => {
            return acumulador + movimientoActual.monto
        }, 0)
        
        // Sumamos todos los montos de gastos usando reduce
        const totalGastos = gastos.reduce((acumulador, movimientoActual) => {
            return acumulador + movimientoActual.monto
        }, 0)
        
        // Retornamos los totales calculados
        return {
            ingresos: totalIngresos,
            gastos: totalGastos,
            balance: totalIngresos - totalGastos
        }
    },

    /**
     * Elimina un movimiento de la base de datos
     * @param tipo - 'ingresos' o 'gastos'
     * @param id - ID del movimiento a eliminar
     * @param userId - ID del usuario (para refrescar datos)
     */
    eliminarMovimiento: async (tipo, id, userId) => {
        // Eliminamos el registro con el ID especificado
        const { error } = await supabase.from(tipo).delete().eq('id', id)
        
        // Si no hay error, refrescamos los datos
        if (!error) await get().obtenerDatos(userId)
    },

    /**
     * Actualiza un movimiento existente en la base de datos
     * @param tipo - 'ingresos' o 'gastos'
     * @param id - ID del movimiento a actualizar
     * @param data - Datos a actualizar (parcial de Movimiento)
     * @param userId - ID del usuario (para refrescar datos)
     */
    actualizarMovimiento: async (tipo, id, data, userId) => {
        // Actualizamos el registro con los nuevos datos
        const { error } = await supabase.from(tipo).update(data).eq('id', id)
        
        // Si no hay error, refrescamos los datos
        if (!error) await get().obtenerDatos(userId)
    }
}))