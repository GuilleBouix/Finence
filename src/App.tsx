import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import History from './pages/History'
import Options from './pages/Options'
import ProtectedRoute from './layouts/ProtectedRoute'

import { TitleUpdater } from './components/TitleUpdater'

/**
 * Componente principal de la aplicación
 * Define todas las rutas disponibles y qué componentes se renderizan en cada una
 */
function App() {
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