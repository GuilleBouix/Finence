import { useState } from "react";

import { supabase } from "../lib/supabaseClient";

import { useNavigate } from "react-router-dom";

import { useFinanceStore } from "../store/useFinanceStore";

import { toastService, mensajes } from "../services/toastService";

// Función para iniciar sesión con email y contraseña
const loginWithEmail = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message === "Invalid login credentials") {
      toastService.error(mensajes.auth.credencialesIncorrectas);
    } else {
      toastService.error(error.message);
    }
    return false;
  }

  return true;
};

// Función para iniciar sesión con Google OAuth
const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + "/",
    },
  });

  if (error) {
    toastService.error(mensajes.auth.errorGoogle + ": " + error.message);
    return false;
  }

  return true;
};

// Hook personalizado para manejar la autenticación
export const useAuth = () => {
  const navigate = useNavigate();
  const setUsuario = useFinanceStore((state) => state.setUsuario);

  // Estado para indicar si está procesando
  const [cargando, setCargando] = useState(false);

  // Inicia sesión con email y contraseña
  const login = async (email: string, password: string) => {
    setCargando(true);
    const exito = await loginWithEmail(email, password);
    if (exito) {
      navigate("/");
    }
    setCargando(false);
  };

  // Inicia sesión con Google
  const loginGoogle = async () => {
    setCargando(true);
    await loginWithGoogle();
    setCargando(false);
  };

  // Cierra la sesión actual
  const cerrarSesion = async () => {
    setUsuario(null);
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return {
    cargando,
    login,
    loginGoogle,
    cerrarSesion,
  };
};
