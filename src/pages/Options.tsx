import { Header } from '../components/Header'

// Componente de la página de Opciones. Página de configuración-placeholder para futuras funcionalidades
function Options() {
  return (
    <div className="min-h-screen bg-[#070808] text-white p-4 font-sans antialiased">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header con navegación y botón de cierre de sesión */}
        <Header />
      </div>
    </div>
  )
}

export default Options