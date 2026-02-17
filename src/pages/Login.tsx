import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { LuLock, LuMail } from "react-icons/lu";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  // Estado para indicar si está procesando el login
  const [cargando, setCargando] = useState(false);

  // Estado para el campo de correo
  const [correo, setCorreo] = useState("");

  // Estado para el campo de contraseña
  const [password, setPassword] = useState("");

  // Maneja el login con email y contraseña
  const manejarLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: password,
    });

    if (error) {
      if (error.message === "Invalid login credentials") {
        toast.error("Correo o contraseña incorrectos.");
      } else {
        toast.error(error.message);
      }
    } else {
      navigate("/");
    }

    setCargando(false);
  };

  // Maneja el login con Google OAuth
  const manejarLoginGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/",
      },
    });

    if (error) toast.error("Error al conectar con Google: " + error.message);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 font-sans antialiased">
      <div className="w-full max-w-85 bg-[#111] border border-[#222] p-6 rounded-2xl shadow-2xl animate-fade-in">
        {/* Título de bienvenida */}
        <div className="text-center mb-6 animate-fade-down">
          <h2 className="text-2xl font-bold tracking-tight">Bienvenido</h2>
          <p className="text-xs text-gray-500 uppercase mt-1">
            Ingresa a tu cuenta
          </p>
        </div>

        {/* Formulario de login */}
        <form onSubmit={manejarLogin} className="flex flex-col gap-3">
          {/* Campo de correo */}
          <div className="relative group animate-fade-down animate-delay-50">
            <LuMail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#22c55e] transition-colors"
              size={14}
            />
            <input
              className="w-full bg-[#0a0a0a] border border-[#222] py-2.5 pl-9 pr-3 rounded outline-none focus:border-[#22c55e]/50 text-sm transition-all"
              type="email"
              placeholder="Correo electrónico"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          {/* Campo de contraseña */}
          <div className="relative group animate-fade-down animate-delay-100">
            <LuLock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#22c55e] transition-colors"
              size={14}
            />
            <input
              className="w-full bg-[#0a0a0a] border border-[#222] py-2.5 pl-9 pr-3 rounded outline-none focus:border-[#22c55e]/50 text-sm transition-all"
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            disabled={cargando}
            className={`mt-2 py-3 rounded text-sm font-medium transition-all cursor-pointer animate-fade-down animate-delay-150 ${
              cargando
                ? "bg-gray-800 text-gray-500"
                : "bg-[#22c55e] text-black hover:bg-[#22c55e]/80 active:scale-95"
            }`}
          >
            {cargando ? "Verificando..." : "Ingresar"}
          </button>
        </form>

        {/* Separador visual */}
        <div className="relative my-6 animate-fade-down animate-delay-200">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#222]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase font-bold tracking-tighter">
            <span className="bg-[#111] px-2 text-gray-600">O</span>
          </div>
        </div>

        {/* Botón de login con Google */}
        <button
          onClick={manejarLoginGoogle}
          type="button"
          className="w-full py-2.5 border border-[#222] rounded flex items-center justify-center gap-2 hover:bg-[#1a1a1a] transition-all text-sm font-medium text-gray-300 cursor-pointer active:scale-95 shadow-sm animate-fade-down animate-delay-250"
        >
          <FcGoogle size={18} />
          Ingresar con Google
        </button>
      </div>
    </div>
  );
}
