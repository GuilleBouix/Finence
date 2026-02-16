import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import Login from './pages/Login'
import Home from './pages/Home'
import History from './pages/History'
import Options from './pages/Options'
import ProtectedRoute from './routes/ProtectedRoute'
import { TitleUpdater } from './components/TitleUpdater'
import { useFinanceStore } from './store/useFinanceStore'; // Importa tu store

// Componente principal de la aplicación. Define todas las rutas disponibles y qué componentes se renderizan en cada una
function App() {
// Extraemos la acción de la store
  const setUsuario = useFinanceStore((state) => state.setUsuario);

  useEffect(() => {
    // 1. Verificar si ya hay una sesión activa al cargar la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null);
    });

    // 2. Suscribirse a cambios (Login, Logout, Token renovado)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null);
      
      // Tip: Si el evento es SIGN_OUT, podrías limpiar también los datos
      if (_event === 'SIGNED_OUT') {
        // Aquí podrías resetear ingresos/gastos si quisieras
      }
    });

    return () => subscription.unsubscribe();
  }, [setUsuario]);

  return (
    // BrowserRouter envuelve toda la aplicación para habilitar el sistema de rutas
    <BrowserRouter>
      {/* TitleUpdater se ejecuta en cada cambio de ruta para actualizar el título */}
      <TitleUpdater />
      
      <Routes>
        <Route path="/auth" element={<Login />} />

        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/historial" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />

        <Route path="/opciones" element={
          <ProtectedRoute>
            <Options />
          </ProtectedRoute>
        }  
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App