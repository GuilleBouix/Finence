// Componente de widget de usuario
// Muestra la foto de perfil y el email del usuario con animacion de expansion
import type { User } from "@supabase/supabase-js";

import { URLs } from "../../constants";

interface UserWidgetProps {
  usuario: User | null;
  expandido: boolean;
  onClick: () => void;
}

export const UserWidget = ({
  usuario,
  expandido,
  onClick,
}: UserWidgetProps) => (
  <button
    onClick={onClick}
    className={`group flex items-center bg-transparent border-none p-1 rounded-full transition-all duration-500 ease-in-out outline-none ${expandido ? "bg-[#222]" : "hover:bg-[#222]"}`}
  >
    {/* Imagen de perfil del usuario */}
    <img
      src={usuario?.user_metadata?.avatar_url || URLs.avatarDefault}
      className="w-6 h-6 rounded-full object-cover z-10 border border-[#333] shrink-0 pointer-events-none"
      alt="User"
    />

    {/* Email del usuario (se expande/collapse) */}
    <span
      className={`
        text-xs font-mono text-[#22c55e]
        overflow-hidden whitespace-nowrap
        transition-all duration-300 ease-in-out
        ${
          expandido
            ? "max-w-xs opacity-100 translate-x-0 ml-2 mr-2"
            : "max-w-0 opacity-0 -translate-x-2"
        }
        group-hover:max-w-xs group-hover:opacity-100 group-hover:translate-x-0 group-hover:ml-2 group-hover:mr-2
      `}
    >
      {usuario?.email}
    </span>
  </button>
);
