import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import Login from "./pages/Login";
import Home from "./pages/Home";
import History from "./pages/History";
import Options from "./pages/Options";
import ProtectedRoute from "./routes/ProtectedRoute";
import { TitleUpdater } from "./components/TitleUpdater";
import { useFinanceStore } from "./store/useFinanceStore";
import { Toaster } from "react-hot-toast";

// Componente principal de la aplicación
function App() {
  // Extraemos la acción de la store para actualizar el usuario
  const setUsuario = useFinanceStore((state) => state.setUsuario);

  useEffect(() => {
    // Verificar si ya hay una sesión activa al cargar la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null);
    });

    // Suscribirse a cambios (Login, Logout, Token renovado)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUsuario]);

  return (
    <>
      {/* Configuración global de Toast (notificaciones) */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #222",
            fontSize: "14px",
          },
        }}
      />

      {/* BrowserRouter envuelve toda la aplicación para habilitar el sistema de rutas */}
      <BrowserRouter>
        {/* TitleUpdater se ejecuta en cada cambio de ruta para actualizar el título */}
        <TitleUpdater />

        <Routes>
          {/* Ruta pública de autenticación */}
          <Route path="/auth" element={<Login />} />

          {/* Ruta protegida: Home (Dashboard) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Ruta protegida: Historial */}
          <Route
            path="/historial"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          {/* Ruta protegida: Opciones */}
          <Route
            path="/opciones"
            element={
              <ProtectedRoute>
                <Options />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
