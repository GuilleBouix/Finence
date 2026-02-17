import { LuClock, LuArrowUp, LuArrowDown, LuInfo } from "react-icons/lu";
import type { Movimiento } from "../types/finance";

// Componente de lista de actividad reciente
export const ActivityList = ({
  ingresos,
  gastos,
}: {
  ingresos: Movimiento[];
  gastos: Movimiento[];
}) => {
  // Combinamos ingresos y gastos, ordenamos por fecha y limitamos a 10
  const movimientos = [...ingresos, ...gastos]
    .sort((transaccionA, transaccionB) => {
      return (
        new Date(transaccionB.fecha).getTime() -
        new Date(transaccionA.fecha).getTime()
      );
    })
    .slice(0, 10);

  // Verificamos si la lista está vacía
  const sinMovimientos = movimientos.length === 0;

  return (
    <div className="bg-[#111] p-4 rounded-xl border border-[#222] flex flex-col relative overflow-hidden h-75">
      {/* Título de la sección */}
      <div className="flex items-center gap-2 mb-4 h-8 z-10">
        <LuClock className="text-gray-500 text-base" />
        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-widest">
          Actividad Reciente
        </h3>
      </div>

      <div className="relative overflow-hidden h-full">
        {/* Estado vacío: Se muestra cuando no hay transacciones */}
        {sinMovimientos ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 animate-fade pb-8">
            <LuInfo className="text-[#222] size-8" />
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest text-center">
              Aún no tienes movimientos
            </p>
          </div>
        ) : (
          /* Lista de movimientos */
          <div
            className="space-y-3 overflow-y-auto h-full scrollbar-hide pt-2 pb-10"
            style={{ scrollbarWidth: "none" }}
          >
            {movimientos.map((movimiento) => {
              // Verificamos si es un ingreso o un gasto
              const esIngreso = ingresos.some(
                (ingreso) => ingreso.id === movimiento.id,
              );

              return (
                <div
                  key={movimiento.id}
                  className="flex justify-between items-center group pr-1 animate-fade-up"
                >
                  {/* Icono y descripción del movimiento */}
                  <div className="flex items-center gap-2">
                    {/* Icono según tipo (flecha arriba o abajo) */}
                    <div
                      className={`p-2 rounded-lg ${
                        esIngreso
                          ? "bg-[#22c55e]/10 text-[#22c55e]"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {esIngreso ? (
                        <LuArrowUp size={14} />
                      ) : (
                        <LuArrowDown size={14} />
                      )}
                    </div>

                    {/* Descripción y fecha */}
                    <div>
                      <p className="text-sm font-medium text-gray-300 leading-none mb-1">
                        {movimiento.descripcion}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase">
                        {new Date(movimiento.fecha).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "short",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Monto con signo según tipo */}
                  <span
                    className={`text-md font-mono ${
                      esIngreso ? "text-[#22c55e]" : "text-red-500"
                    }`}
                  >
                    {esIngreso ? "+" : "-"}${movimiento.monto.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Gradiente inferior (solo se muestra si hay movimientos) */}
        {!sinMovimientos && (
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-[#111] to-transparent z-10 pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};
