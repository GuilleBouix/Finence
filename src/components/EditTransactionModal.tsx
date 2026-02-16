import { useState, useEffect } from "react";
import { useFinanceStore } from "../store/useFinanceStore";
import { LuPencil } from "react-icons/lu";

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
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState(0);

  // Cargamos los datos de la transacción en el estado local cuando el modal se abre
  useEffect(() => {
    if (transaction) {
      setDescripcion(transaction.descripcion);
      setMonto(transaction.monto);
    }
  }, [transaction]); // Solo se ejecuta cuando 'transaction' cambia

  if (!transaction) return null;

  // Maneja el envío del formulario para actualizar la transacción
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await actualizarMovimiento(
      transaction.tipo,
      transaction.id,
      { descripcion, monto: Number(monto) },
      userId,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade animate-duration-200">
      <div className="bg-[#111] border border-[#222] p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LuPencil className="text-gray-500 text-base" />
            <h3 className="font-bold text-gray-500 text-xs tracking-widest">
              EDITAR TRANSACCIOÓN
            </h3>
          </div>
          <span
            className={`text-[10px] px-2 py-1 rounded border font-bold uppercase ${transaction.tipo === "ingresos" ? "border-green-500/20 text-green-500" : "border-red-500/20 text-red-500"}`}
          >
            {transaction.tipo}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
