// Store de Zustand para gestionar el estado global de las finanzas
import { create } from "zustand";

import { supabase } from "../lib/supabaseClient";

import type { Movimiento, Totales } from "../types/finance";

import type { User } from "@supabase/supabase-js";

// Interface que define la estructura del estado de la store de finanzas
interface FinanceState {
  // Usuario actualmente autenticado
  usuario: User | null;
  
  // Lista de ingresos del usuario actual
  ingresos: Movimiento[];
  
  // Lista de gastos del usuario actual
  gastos: Movimiento[];
  
  // Indica si hay una operación en curso (agregar/eliminar/actualizar)
  cargando: boolean;
  
  // Indica si es la primera carga de datos (para mostrar skeleton)
  cargandoInicial: boolean;
  
  // Bandera para el sistema de caché
  datosCargados: boolean;

  // Función para actualizar el usuario actual en la store
  setUsuario: (user: User | null) => void;

  // Obtiene los movimientos desde Supabase
  obtenerDatos: (userId: string, forzarRefresco?: boolean) => Promise<void>;

  // Agrega un nuevo movimiento (ingreso o gasto) a la base de datos
  agregarMovimiento: (
    tipo: "ingresos" | "gastos",
    movimiento: Omit<Movimiento, "id">,
  ) => Promise<boolean>;

  // Calcula los totales de ingresos, gastos y balance
  obtenerTotales: () => Totales;

  // Elimina un movimiento de la base de datos
  eliminarMovimiento: (
    tipo: "ingresos" | "gastos",
    id: string,
    userId: string,
  ) => Promise<void>;

  // Actualiza un movimiento. Soporta cambio de tipo (mover entre tablas)
  actualizarMovimiento: (
    tipoOriginal: "ingresos" | "gastos",
    id: string,
    data: any,
    userId: string,
  ) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  // Estado inicial
  usuario: null,
  ingresos: [],
  gastos: [],
  cargando: false,
  cargandoInicial: true,
  datosCargados: false,

  setUsuario: (user) => set({ usuario: user }),

  // Obtiene los datos de ingresos y gastos con sistema de caché
  obtenerDatos: async (userId: string, forzarRefresco = false) => {
    // Si los datos ya existen y no se requiere un refresco forzado, evitamos la consulta
    if (get().datosCargados && !forzarRefresco) return;

    const estadoActual = get();
    
    // Solo mostramos cargandoInicial si no tenemos nada en memoria
    if (
      estadoActual.ingresos.length === 0 &&
      estadoActual.gastos.length === 0
    ) {
      set({ cargandoInicial: true });
    }

    try {
      // Ejecutamos ambas consultas en paralelo para mejorar el rendimiento
      const [{ data: inc }, { data: gas }] = await Promise.all([
        supabase
          .from("ingresos")
          .select("*")
          .eq("user_id", userId)
          .order("fecha", { ascending: false }),
        supabase
          .from("gastos")
          .select("*")
          .eq("user_id", userId)
          .order("fecha", { ascending: false }),
      ]);

      set({
        ingresos: inc || [],
        gastos: gas || [],
        cargandoInicial: false,
        datosCargados: true,
      });
    } catch (error) {
      console.error("Error al obtener datos:", error);
      set({ cargandoInicial: false });
    }
  },

  // Agrega un movimiento e invalida la caché para forzar refresco
  agregarMovimiento: async (tipo, payload) => {
    set({ cargando: true });
    const { error } = await supabase.from(tipo).insert(payload);

    if (!error) {
      // Refrescamos forzando la consulta a Supabase
      await get().obtenerDatos(payload.user_id, true);
      set({ cargando: false });
      return true;
    }

    set({ cargando: false });
    return false;
  },

  // Calcula totales basados en el estado actual de la store (memoria)
  obtenerTotales: () => {
    const { ingresos, gastos } = get();

    const totalIngresos = ingresos.reduce((acc, mov) => acc + mov.monto, 0);
    const totalGastos = gastos.reduce((acc, mov) => acc + mov.monto, 0);

    return {
      ingresos: totalIngresos,
      gastos: totalGastos,
      balance: totalIngresos - totalGastos,
    };
  },

  // Elimina un registro e invalida la caché
  eliminarMovimiento: async (tipo, id, userId) => {
    const { error } = await supabase.from(tipo).delete().eq("id", id);
    if (!error) {
      // Forzamos actualización para que el registro desaparezca del historial
      await get().obtenerDatos(userId, true);
    }
  },

  // Actualiza un movimiento. Si el tipo cambia, mueve el registro entre tablas
  actualizarMovimiento: async (tipoOriginal, id, data, userId) => {
    const { tipoNuevo, ...datosAActualizar } = data;

    try {
      // Caso 1: Cambio de tipo (ej. de Ingreso a Gasto)
      if (tipoNuevo && tipoNuevo !== tipoOriginal) {
        // Insertamos en la nueva tabla (mantenemos la fecha original)
        const { error: insError } = await supabase.from(tipoNuevo).insert({
          ...datosAActualizar,
          user_id: userId,
        });

        if (!insError) {
          // Si se insertó bien, lo borramos de la tabla anterior
          await supabase.from(tipoOriginal).delete().eq("id", id);
        }
      }
      // Caso 2: Actualización normal en la misma tabla
      else {
        await supabase.from(tipoOriginal).update(datosAActualizar).eq("id", id);
      }

      // Refrescamos datos para actualizar la UI
      await get().obtenerDatos(userId, true);
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  },
}));
