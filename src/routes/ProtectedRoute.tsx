// Componente de protección de rutas
// Verifica si el usuario está autenticado antes de mostrar el contenido
import { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";

import { supabase } from "../lib/supabaseClient";

import type { Session } from "@supabase/supabase-js";

export default function ProtectedRoute({
  children,
}: {
  children: React.JSX.Element;
}) {
  // Estado para almacenar la sesión del usuario
  const [sesion, setSesion] = useState<Session | null>(null);
  
  // Estado para indicar si estamos verificando la sesión
  const [cargando, setCargando] = useState(true);

  // Verifica la sesión actual y escucha cambios en la autenticación
  useEffect(() => {
    // Verificar la sesión actual al cargar el componente
    // Obtiene la sesión guardada en localStorage por Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Guardamos la sesión en el estado
      setSesion(session);
      
      // Terminamos la carga
      setCargando(false);
    });

    // Escuchar cambios en el estado de autenticación
    // Detecta cuando el usuario inicia o cierra sesión en otra pestaña
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, session) => {
      // Actualizamos la sesión cuando cambia
      setSesion(session);
    });

    // Cleanup: nos desuscribimos cuando el componente se desmonta
    // Evita fugas de memoria y suscripciones
    return () => subscription.unsubscribe();
  }, []);

  // Mientras verificamos la sesión, mostramos un mensaje de carga
  if (cargando) return <p>Cargando...</p>;

  // Si no hay sesión (usuario no autenticado) redirigimos a la página de login
  if (!sesion) {
    return <Navigate replace to="/auth" />;
  }

  // Si hay sesión activa, renderizamos el componente hijo (Home, History, etc.)
  return children;
}
