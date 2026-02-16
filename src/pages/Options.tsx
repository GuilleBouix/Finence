import { Header } from '../components/Header'
import { LuUser, LuTrash2, LuTriangleAlert, LuCamera } from "react-icons/lu";

function Options() {
  return (
    <div className="min-h-screen bg-[#070808] text-white p-4 font-sans antialiased">
      <div className="max-w-3xl mx-auto space-y-6">
        <Header />

        <div className="space-y-6 animate-fade">
          {/* SECCIÓN: PERFIL */}
          <section className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#22c55e] mb-2">
              <LuUser className='text-gray-500 text-base' />
              
              <h2 className="font-bold text-gray-500 text-xs uppercase tracking-widest">Perfil</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <img 
                  src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" 
                  alt="Perfil" 
                  className="w-20 h-20 rounded-full object-cover group-hover:opacity-50 transition-all"
                />
                
                <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <LuCamera size={24} className="text-[#22c55e]" />
                </button>
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">URL de la foto</label>
                  
                  <input 
                    type="text" 
                    placeholder="https://ejemplo.com/foto.jpg"
                    className="w-full bg-[#070808] border border-[#222] rounded-lg px-3 py-2 text-sm focus:border-[#22c55e] outline-none transition-all mt-1"
                  />
                </div>

                <button className="bg-[#22c55e] text-black font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer
                hover:bg-[#27ec6f] transition-colors">
                  ACTUALIZAR FOTO
                </button>
              </div>
            </div>
          </section>

          {/* SECCIÓN: ZONA DE PELIGRO */}
          <section className="bg-[#111] border border-red-500/20 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-500 mb-4">
              <LuTriangleAlert className='text-gray-500 text-base' />
              <h2 className="font-bold text-gray-500 text-xs uppercase tracking-widest">Zona de Peligro</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Resetear Transacciones */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-red-500/5 border border-red-500/10 rounded-lg">
                <div className="text-center sm:text-left">
                  <h3 className="text-sm font-bold">Resetear Datos</h3>
                  
                  <p className="text-xs text-gray-400">Borra todos tus ingresos y gastos de forma permanente.</p>
                </div>
                
                <button className="flex items-center gap-2 bg-transparent border border-red-500/40 hover:bg-red-500 hover:text-white text-red-500 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer">
                  <LuTrash2 size={14} />
                  RESET
                </button>
              </div>

              {/* Eliminar Cuenta */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-red-500/5 border border-red-500/10 rounded-lg">
                <div className="text-center sm:text-left">
                  <h3 className="text-sm font-bold text-red-500">Eliminar Cuenta</h3>
                  
                  <p className="text-xs text-gray-400">Tu cuenta y todos tus datos serán eliminados por completo.</p>
                </div>

                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer">
                  ELIMINAR CUENTA
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Options