import { LuTriangleAlert } from "react-icons/lu";

interface ConfirmDeleteModalProps {
  transaction: any | null;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDeleteModal({
  transaction,
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  // Si no hay transacción, no renderizamos nada
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4 animate-fade animate-duration-200">
      <div className="bg-[#111] border border-[#222] p-6 rounded-2xl max-w-sm w-full shadow-2xl space-y-4 text-center">
        {/* Icono de advertencia */}
        <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
          <LuTriangleAlert size={24} />
        </div>

        {/* Mensaje de confirmación */}
        <div className="space-y-2">
          <h3 className="font-bold text-white uppercase tracking-widest">
            ¿Eliminar movimiento?
          </h3>
          <p className="text-sm text-gray-500">
            Estás a punto de borrar{" "}
            <span className="text-white font-medium">
              "{transaction.descripcion}"
            </span>
            .
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-2">
          {/* Botón de cancelar */}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-[#222] hover:bg-[#333] transition-colors text-xs font-bold uppercase text-gray-400 cursor-pointer"
          >
            Cancelar
          </button>

          {/* Botón de eliminar */}
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-xs font-bold uppercase text-white flex items-center justify-center gap-2 cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
