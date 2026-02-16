import { LuLogOut, LuHistory, LuSettings } from "react-icons/lu";
import { supabase } from '../lib/supabaseClient'
import { useNavigate, Link } from 'react-router-dom'
import { useFinanceStore } from "../store/useFinanceStore";

// Componente Header. Muestra el logo, navegación entre páginas y botón de cierre de sesión
export const Header = () => {
    // Hook para navegar a otras rutas
    const navigate = useNavigate()
    
    const { usuario } = useFinanceStore();

    // Cierra la sesión del usuario actual. Llama a Supabase auth signOut y redirige al login
    const cerrarSesion = async () => {
        // Cerramos la sesión en Supabase
        await supabase.auth.signOut()
        
        // Redirigimos a la página de login
        navigate('/auth')
    }

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 bg-[#111] p-4 rounded-xl border border-[#222] shadow-xl animate-fade">
            {/* Logo de la aplicación */}
            <div className="flex flex-col items-center md:items-start">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <h1 className="text-2xl font-black text-[#22c55e] mb-0.5">
                        FINE<span className='text-white/80 font-thin'>NCE</span>
                    </h1>
                </Link>
            </div>

            {/* Navegación y acciones */}
            <div className="flex items-center gap-2">
                {/* Menú de navegación */}
                <nav className="flex items-center gap-1 mr-2 border-r border-[#222] pr-3">
                    {/* Enlace a la página de historial */}
                    <Link 
                        to="/historial" 
                        className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 hover:text-white hover:bg-[#222] px-3 py-2 rounded-lg transition-all"
                    >
                        <LuHistory size={16} />
                        <span className="hidden sm:inline">HISTORIAL</span>
                    </Link>
                    
                    {/* Enlace a la página de opciones */}
                    <Link 
                        to="/opciones" 
                        className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 hover:text-white hover:bg-[#222] px-3 py-2 rounded-lg transition-all"
                    >
                        <LuSettings size={16} />
                        <span className="hidden sm:inline">OPCIONES</span>
                    </Link>

                    <div className="group flex items-center cursor-default hover:bg-[#222] rounded-full transition-all duration-300 ease-in-out">
                        <img src={usuario?.user_metadata?.avatar_url || '/default-avatar.jpg'} className="w-6 h-6 rounded-full object-cover z-10 border border-[#333]" />

                        <span className="
                            text-xs font-mono text-[#22c55e]
                            max-w-0 overflow-hidden opacity-0 whitespace-nowrap
                            -translate-x-2
                            transition-all duration-300 ease-in-out
                            group-hover:max-w-xs group-hover:opacity-100 group-hover:translate-x-0 group-hover:ml-2 group-hover:mr-2
                        ">
                            {usuario?.email}
                        </span>
                    </div>
                </nav>

                {/* Botón de cierre de sesión */}
                <button 
                    onClick={cerrarSesion} 
                    className="group flex items-center bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out cursor-pointer overflow-hidden"
                >
                    {/* Icono de logout (siempre visible) */}
                    <LuLogOut size={16} className="text-red-500 shrink-0" />
                    
                    {/* Texto "SALIR" que aparece al hacer hover */}
                    <span className="max-w-0 opacity-0 group-hover:max-w-25 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out text-[10px] font-bold tracking-widest text-red-500 overflow-hidden whitespace-nowrap">
                        SALIR
                    </span>
                </button>
            </div>
        </div>
    )
}