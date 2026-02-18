// Página de opciones y configuración del usuario
import { useState } from "react";

import { Header } from "../components/Header";

import { LuUser, LuTrash2, LuTriangleAlert, LuX } from "react-icons/lu";

import { supabase } from "../lib/supabaseClient";

import { useFinanceStore } from "../store/useFinanceStore";

import { toastService, mensajes } from "../services/toastService";

import { useUsuario } from "../hooks/useUsuario";

import { URLs, TABLAS } from "../constants";

export default function Options() {
  // Obtenemos el usuario desde el hook
  const { usuario } = useUsuario();

  // Extraemos las acciones de la store
  const { setUsuario, obtenerDatos } = useFinanceStore();

  // Estado para la nueva URL del avatar
  const [newAvatarUrl, setNewAvatarUrl] = useState("");

  // Estado para indicar si está actualizando
  const [isUpdating, setIsUpdating] = useState(false);

  // Estado para controlar la visibilidad del modal
  const [modalOpen, setModalOpen] = useState(false);

  // Estado para la configuración del modal
  const [modalConfig, setModalConfig] = useState<{
    titulo: string;
    mensaje: string;
    accion: () => Promise<void>;
    botonTexto: string;
  } | null>(null);

  // Actualiza la foto de perfil del usuario
  const handleUpdateAvatar = async () => {
    if (!newAvatarUrl) return;
    setIsUpdating(true);

    const { data, error } = await supabase.auth.updateUser({
      data: { avatar_url: newAvatarUrl },
    });

    if (error) {
      toastService.error(mensajes.perfil.errorFoto);
    } else {
      setUsuario(data.user);
      setNewAvatarUrl("");
      toastService.success(mensajes.perfil.fotoActualizada);
    }
    setIsUpdating(false);
  };

  // Resetea todos los datos (elimina ingresos y gastos)
  const resetearDatos = async () => {
    if (!usuario) return;
    try {
      await Promise.all([
        supabase.from(TABLAS.ingresos).delete().eq("user_id", usuario.id),
        supabase.from(TABLAS.gastos).delete().eq("user_id", usuario.id),
      ]);
      await obtenerDatos(usuario.id, true);

      setModalOpen(false);
      toastService.success(mensajes.datos.reseteados);
    } catch {
      toastService.error(mensajes.datos.errorResetear);
    }
  };

  // Abre el modal de confirmación
  const abrirConfirmacion = (tipo: "reset" | "delete") => {
    if (tipo === "reset") {
      setModalConfig({
        titulo: "¿Resetear todos los datos?",
        mensaje:
          "Esta acción borrará permanentemente todos tus ingresos y gastos registrados hasta ahora. No se puede deshacer.",
        accion: resetearDatos,
        botonTexto: "SÍ, RESETEAR TODO",
      });
    }
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070808] text-white p-4 font-sans antialiased relative">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header con navegación */}
        <Header />

        <div className="space-y-6 animate-fade">
          {/* SECCIÓN: PERFIL */}
          <section className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#22c55e] mb-2">
              <LuUser className="text-gray-500 text-base" />
              <h2 className="font-bold text-gray-500 text-xs uppercase tracking-widest">
                Perfil
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Imagen de perfil actual */}
              <div className="relative group">
                <img
                  src={
                    usuario?.user_metadata?.avatar_url ||
                    URLs.avatarDefault
                  }
                  alt="Perfil"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#222]"
                />
              </div>
              
              {/* Campos para actualizar avatar */}
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    URL de la foto
                  </label>
                  <input
                    type="text"
                    value={newAvatarUrl}
                    onChange={(e) => setNewAvatarUrl(e.target.value)}
                    placeholder="https://ejemplo.com/foto.jpg"
                    className="w-full bg-[#070808] border border-[#222] rounded-lg px-3 py-2 text-sm focus:border-[#22c55e] outline-none transition-all mt-1"
                  />
                </div>
                <button
                  onClick={handleUpdateAvatar}
                  disabled={isUpdating || !newAvatarUrl}
                  className="bg-[#22c55e] text-black font-bold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer hover:bg-[#27ec6f] transition-all w-full sm:w-auto"
                >
                  {isUpdating ? "ACTUALIZANDO..." : "ACTUALIZAR FOTO"}
                </button>
              </div>
            </div>
          </section>

          {/* SECCIÓN: ZONA DE PELIGRO */}
          <section className="bg-[#111] border border-red-500/20 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-500 mb-4">
              <LuTriangleAlert className="text-gray-500 text-base" />
              <h2 className="font-bold text-gray-500 text-xs uppercase tracking-widest">
                Zona de Peligro
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Opción de resetear datos */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-red-500/5 border border-red-500/10 rounded-lg">
                <div className="text-center sm:text-left">
                  <h3 className="text-sm font-bold">Resetear Datos</h3>
                  <p className="text-xs text-gray-400">
                    Borra todos tus ingresos y gastos de forma permanente.
                  </p>
                </div>
                <button
                  onClick={() => abrirConfirmacion("reset")}
                  className="flex items-center gap-2 bg-transparent border border-red-500/40 hover:bg-red-500 hover:text-white text-red-500 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <LuTrash2 size={14} /> RESET
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade">
          <div className="bg-[#111] border border-[#222] w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-6">
            {/* Encabezado del modal */}
            <div className="flex justify-between items-start">
              <div className="bg-red-500/10 p-2 rounded-lg text-red-500">
                <LuTriangleAlert size={24} />
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <LuX size={20} />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="space-y-2">
              <h2 className="text-lg font-bold">{modalConfig?.titulo}</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                {modalConfig?.mensaje}
              </p>
            </div>

            {/* Botones del modal */}
            <div className="flex flex-col gap-2">
              <button
                onClick={modalConfig?.accion}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
              >
                {modalConfig?.botonTexto}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="w-full bg-[#222] hover:bg-[#333] text-white font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
