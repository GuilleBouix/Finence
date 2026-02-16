import { useState } from "react";
import {
  LuCircleDollarSign,
  LuTrendingUp,
  LuTrendingDown,
} from "react-icons/lu";
type FuncionAgregarMovimiento = (
  tipo: "ingresos" | "gastos",
  monto: string,
  descripcion: string,
) => Promise<boolean>;

// Componente de formulario para agregar nuevas transacciones
export const TransactionForm = ({
  onAdd,
  cargando,
}: {
  onAdd: FuncionAgregarMovimiento;
  cargando: boolean;
}) => {
  // Estado para el campo de monto (cantidad de dinero)
  const [monto, setMonto] = useState("");

  // Estado para el campo de descripción
  const [descripcion, setDescripcion] = useState("");

  // Maneja el envío del formulario. Tipo de transacción: 'ingresos' o 'gastos'
  const handleSubmit = async (tipo: "ingresos" | "gastos") => {
    // Llamamos a la función proporcionada por el componente padre (Home)
    const exitoso = await onAdd(tipo, monto, descripcion);

    // Si se agregó correctamente, limpiamos los campos del formulario
    if (exitoso) {
      setMonto("");
      setDescripcion("");
    }
  };

  return (
    <div className="bg-[#111] p-4 rounded-xl border border-[#222] mb-4 animate-fade animate-delay-200">
      {/* Título del formulario */}
      <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
        <LuCircleDollarSign className="text-lg" /> Nueva Transacción
      </h2>

      <div className="flex flex-col gap-4">
        {/* Campos de entrada: monto y descripción */}
        <div className="flex flex-col md:flex-row gap-2">
          {/* Input de monto (número) */}
          <input
            type="number"
            placeholder="0.00"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="flex-1 bg-[#0a0a0a] border border-[#222] p-2 rounded-lg outline-none focus:border-[#22c55e] transition-all font-mono"
          />

          {/* Input de descripción (texto) */}
          <input
            type="text"
            placeholder="Descripción de la transacción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="flex-2 bg-[#0a0a0a] border border-[#222] p-2 rounded-lg outline-none focus:border-[#22c55e] transition-all text-gray-300"
          />
        </div>

        {/* Botones para agregar como ingreso o gasto */}
        <div className="grid grid-cols-2 gap-2">
          {/* Botón de ingreso (verde) */}
          <button
            onClick={() => handleSubmit("ingresos")}
            disabled={cargando}
            className="bg-[#22c55e] text-black font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer
                        hover:bg-[#27ec6f] transition-colors"
          >
            <LuTrendingUp /> INGRESO
          </button>

          {/* Botón de gasto (rojo) */}
          <button
            onClick={() => handleSubmit("gastos")}
            disabled={cargando}
            className="bg-[#ef4444] text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer
                        hover:bg-[#f87171] transition-colors"
          >
            <LuTrendingDown /> GASTO
          </button>
        </div>
      </div>
    </div>
  );
};
