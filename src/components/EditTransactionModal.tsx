import { useState, useEffect } from "react";
import { useFinanceStore } from "../store/useFinanceStore";
import { LuPencil } from "react-icons/lu";
import toast from "react-hot-toast";

interface EditTransactionModalProps {
  transaction: any | null;
  userId: string;
  onClose: () => void;
}

export default function EditTransactionModal({
  transaction,
  userId,
  onClose,
}: EditTransactionModalProps) {
  const { actualizarMovimiento } = useFinanceStore();

  // Estado para la descripción
  const [descripcion, setDescripcion] = useState("");

  // Estado para el monto
  const [monto, setMonto] = useState(0);

  // Inicializamos los campos con los datos de la transacción
  useEffect(() => {
    if (transaction) {
      setDescripcion(transaction.descripcion);
      setMonto(transaction.monto);
    }
  }, [transaction]);

  if (!transaction) return null;

  // Maneja el envío del formulario de edición
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Ejecutamos la actualización
      await actualizarMovimiento(
        transaction.tipo,
        transaction.id,
        { descripcion, monto: Number(monto) },
        userId,
      );

      // Si todo sale bien, disparamos el éxito
      toast.success("Transacción actualizada correctamente");
      onClose();
    } catch (error) {
      // Por si falla Supabase
      toast.error("Error al actualizar la transacción");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade animate-duration-200">
      <div className="bg-[#111] border border-[#222] p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
        {/* Encabezado del modal */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LuPencil className="text-gray-500 text-base" />
            <h3 className="font-bold text-gray-500 text-xs tracking-widest uppercase">
              Editar Transacción
            </h3>
          </div>

          {/* Badge indicando el tipo de transacción */}
          <span
            className={`text-[10px] px-2 py-1 rounded border font-bold uppercase ${
              transaction.tipo === "ingresos"
                ? "border-green-500/20 text-green-500"
                : "border-red-500/20 text-red-500"
            }`}
          >
            {transaction.tipo}
          </span>
        </div>

        {/* Formulario de edición */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de descripción */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
              Descripción
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full bg-[#070808] border border-[#222] rounded-lg p-2 text-sm focus:outline-none focus:border-[#22c55e] transition-colors"
              required
            />
          </div>

          {/* Campo de monto */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
              Monto ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              className="w-full bg-[#070808] border border-[#222] rounded-lg p-2 text-sm focus:outline-none focus:border-[#22c55e] transition-colors"
              required
            />
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl bg-[#222] hover:bg-[#333] transition-colors text-xs font-bold uppercase cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#22c55e] text-black hover:bg-[#1eb054] transition-colors text-xs font-bold uppercase cursor-pointer"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
