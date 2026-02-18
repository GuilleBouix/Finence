// Página de historial de transacciones, muestra una lista combinada de ingresos y gastos
import { useFinanceStore } from "../store/useFinanceStore";

import { Header } from "../components/Header";

import {
  LuTrash2,
  LuHistory,
  LuPencil,
  LuArrowUp,
  LuArrowDown,
  LuInfo,
} from "react-icons/lu";

import { useState } from "react";

import EditTransactionModal from "../components/EditTransactionModal";

import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

import { toastService, mensajes } from "../services/toastService";

import { useUsuario } from "../hooks/useUsuario";

export default function History() {
  // Obtenemos el usuario desde el hook
  const { usuario } = useUsuario();

  // Estado para la transacción que se está editando
  const [transaccionAEditar, setTransaccionAEditar] = useState<any | null>(
    null,
  );

  // Estado para la transacción que se está eliminando
  const [transaccionAEliminar, setTransaccionAEliminar] = useState<any | null>(
    null,
  );

  // Extraemos los datos y acciones de la store de Zustand
  const {
    // Datos de ingresos y gastos
    ingresos,
    gastos,

    // Acción para eliminar un movimiento
    eliminarMovimiento,
  } = useFinanceStore();

  // Combinamos ingresos y gastos en un solo array
  // Convertimos cada ingreso a un objeto con propiedad 'tipo'
  const todasLasTransacciones = [
    ...ingresos.map((ingresoActual) => ({
      ...ingresoActual,
      tipo: "ingresos" as const,
    })),

    // Convertimos cada gasto a un objeto con propiedad 'tipo'
    ...gastos.map((gastoActual) => ({
      ...gastoActual,
      tipo: "gastos" as const,
    })),
  ]
    // Ordenamos por fecha de forma descendente (la más reciente primero)
    .sort((transaccionA, transaccionB) => {
      return (
        new Date(transaccionB.fecha).getTime() -
        new Date(transaccionA.fecha).getTime()
      );
    });

  // Maneja la eliminación de un movimiento
  const confirmarBorrado = async () => {
    if (transaccionAEliminar && usuario) {
      try {
        await eliminarMovimiento(
          transaccionAEliminar.tipo,
          transaccionAEliminar.id,
          usuario.id,
        );
        toastService.success(mensajes.transacciones.eliminado);
        setTransaccionAEliminar(null);
      } catch {
        toastService.error(mensajes.transacciones.errorEliminar);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070808] text-white p-4 font-sans antialiased">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header con navegación */}
        <Header />

        {/* Contenedor principal del historial */}
        <div
          className="space-y-2 rounded-xl bg-[#111] p-4 border border-[#222]
                animate-fade"
        >
          {/* Título y contador de registros */}
          <div className="flex justify-between items-center px-2 mb-4">
            <div className="flex items-center gap-2 h-8 z-10">
              <LuHistory className="text-gray-500 text-base" />
              <h3 className="font-bold text-gray-500 text-xs uppercase tracking-widest">
                HISTORIAL DE TRANSACCIONES
              </h3>
            </div>
            <span className="text-[10px] bg-[#111] border border-[#222] px-2 py-1 rounded text-gray-400  tracking-widest">
              {todasLasTransacciones.length} REGISTROS
            </span>
          </div>

          {/* Lista de transacciones */}
          {todasLasTransacciones.map((transaccion) => (
            <div
              key={transaccion.id}
              className="group bg-[#111] border border-[#222] p-4 rounded-xl flex items-center justify-between hover:border-[#333] transition-all
                        animate-fade animate-delay-100"
            >
              {/* Información de la transacción */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-4">
                  {/* Icono según tipo de transacción */}
                  <div
                    className={`p-2 rounded-lg ${transaccion.tipo === "ingresos" ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-red-500/10 text-red-500"}`}
                  >
                    {transaccion.tipo === "ingresos" ? (
                      <LuArrowUp size={16} />
                    ) : (
                      <LuArrowDown size={16} />
                    )}
                  </div>
                </div>

                {/* Descripción y fecha */}
                <div>
                  <p className="font-medium text-gray-200">
                    {transaccion.descripcion}
                  </p>
                  
                  {/* Fecha formateada en español */}
                  <p className="text-xs text-gray-500 uppercase">
                    {new Date(transaccion.fecha).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Monto y botones de acción */}
              <div className="flex items-center gap-6">
                {/* Monto con signo según tipo */}
                <span
                  className={`font-mono ${transaccion.tipo === "ingresos" ? "text-green-500" : "text-red-400"}`}
                >
                  {transaccion.tipo === "ingresos" ? "+" : "-"}$
                  {transaccion.monto.toLocaleString()}
                </span>

                {/* Botones de editar y eliminar */}
                <div className="flex gap-2  transition-opacity">
                  {/* Botón de editar */}
                  <button
                    onClick={() => setTransaccionAEditar(transaccion)}
                    className="p-2 hover:bg-blue-500/10 rounded-lg text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    <LuPencil size={16} />
                  </button>

                  {/* Botón de eliminar */}
                  <button
                    onClick={() => setTransaccionAEliminar(transaccion)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <LuTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Mensaje cuando no hay transacciones */}
          {todasLasTransacciones.length === 0 && (
            <div
              className="py-20 text-center border-2 border-dashed border-[#111] rounded-2xl
                        animate-fade animate-delay-100"
            >
              <div className="h-full flex flex-col items-center justify-center gap-2 animate-fade pb-8">
                <LuInfo className="text-[#222] size-8" />
                <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest text-center">
                  Aún no tienes movimientos
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      {usuario && (
        <EditTransactionModal
          transaction={transaccionAEditar}
          userId={usuario.id}
          onClose={() => setTransaccionAEditar(null)}
        />
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <ConfirmDeleteModal
        transaction={transaccionAEliminar}
        onConfirm={confirmarBorrado}
        onClose={() => setTransaccionAEliminar(null)}
      />
    </div>
  );
}
