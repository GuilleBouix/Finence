// Hook de usuario
// Maneja el usuario actual y la carga de datos de finanzas
import { useEffect, useState } from "react";

import { supabase } from "../lib/supabaseClient";

import { useFinanceStore } from "../store/useFinanceStore";

import type { User } from "@supabase/supabase-js";

export const useUsuario = () => {
  // Obtenemos el usuario de la store (actualizado por App.tsx)
  const usuario = useFinanceStore((state) => state.usuario);
  
  // Obtenemos la función para cargar datos
  const obtenerDatos = useFinanceStore((state) => state.obtenerDatos);

  // Estado local para saber si el usuario está listo (disponible y con datos cargados)
  const [usuarioListo, setUsuarioListo] = useState(false);

  // Efecto para cargar los datos cuando el usuario esté disponible
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      if (usuario) {
        // Cargamos los datos con refresco forzado para asegurar datos frescos
        await obtenerDatos(usuario.id, true);
        setUsuarioListo(true);
      } else {
        setUsuarioListo(false);
      }
    };

    cargarDatosUsuario();
  }, [usuario, obtenerDatos]);

  // Función para obtener el usuario directamente (para casos donde se necesita inmediatamente)
  const obtenerUsuarioDirecto = async (): Promise<User | null> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  };

  return {
    usuario,
    usuarioListo,
    obtenerUsuarioDirecto,
  };
};
