// Componente Header (barra de navegación superior)
import { useState } from "react";

import { LuLogOut, LuHistory, LuSettings } from "react-icons/lu";

import { supabase } from "../lib/supabaseClient";

import { useNavigate, Link } from "react-router-dom";

import { useFinanceStore } from "../store/useFinanceStore";

import { UserWidget } from "./UserWidget";

export const Header = () => {
  const navigate = useNavigate();
  const { usuario } = useFinanceStore();

  // Estado para controlar la expansión del widget de usuario
  const [estaExpandido, setEstaExpandido] = useState(false);

  // Cierra la sesión del usuario y redirige al login
  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 bg-[#111] p-4 rounded-xl border border-[#222] shadow-xl animate-fade">
      {/* Contenedor Logo e Info Usuario (Mobile) */}
      <div className="flex w-full md:w-auto justify-between items-center">
        {/* Logo de la aplicación */}
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-2xl font-black text-[#22c55e] mb-0.5">
            FINE<span className="text-white/80 font-thin">NCE</span>
          </h1>
        </Link>

        {/* Widget de usuario visible solo en móvil */}
        <div className="md:hidden">
          <UserWidget
            usuario={usuario}
            expandido={estaExpandido}
            onClick={() => setEstaExpandido(!estaExpandido)}
          />
        </div>
      </div>

      {/* Barra de navegación y botón de logout */}
      <div className="flex items-center justify-between w-full md:w-auto gap-2">
        <nav className="flex items-center gap-1 border-[#222] md:border-r md:pr-3">
          {/* Enlace a historial */}
          <Link
            to="/historial"
            className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 hover:text-white hover:bg-[#222] px-3 py-2 rounded-lg transition-all"
          >
            <LuHistory size={16} />
            <span className="hidden sm:inline">HISTORIAL</span>
          </Link>

          {/* Enlace a opciones */}
          <Link
            to="/opciones"
            className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 hover:text-white hover:bg-[#222] px-3 py-2 rounded-lg transition-all"
          >
            <LuSettings size={16} />
            <span className="hidden sm:inline">OPCIONES</span>
          </Link>

          {/* Widget Usuario (Desktop) */}
          <div className="hidden md:block">
            <UserWidget
              usuario={usuario}
              expandido={estaExpandido}
              onClick={() => setEstaExpandido(!estaExpandido)}
            />
          </div>
        </nav>

        {/* Botón de cerrar sesión */}
        <button
          onClick={cerrarSesion}
          className="group flex items-center bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out cursor-pointer overflow-hidden"
        >
          <LuLogOut size={16} className="text-red-500 shrink-0" />
          <span className="max-w-0 opacity-0 group-hover:max-w-25 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out text-[10px] font-bold tracking-widest text-red-500 overflow-hidden whitespace-nowrap">
            SALIR
          </span>
        </button>
      </div>
    </div>
  );
};
