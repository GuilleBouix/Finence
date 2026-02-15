import { LuClock, LuArrowUp, LuArrowDown } from "react-icons/lu";
import type { Movimiento } from '../types/finance';

// Componente de lista de actividad reciente. Muestra los 10 movimientos más recientes (mezcla de ingresos y gastos)
export const ActivityList = ({ ingresos, gastos }: { ingresos: Movimiento[], gastos: Movimiento[] }) => {
    // Combinamos ingresos y gastos, ordenamos por fecha y limitamos a 10
    const movimientos = [...ingresos, ...gastos]
        // Ordenamos por fecha de forma descendente
        .sort((transaccionA, transaccionB) => {
            return new Date(transaccionB.fecha).getTime() - new Date(transaccionA.fecha).getTime()
        })
        
        // Tomamos solo los 10 primeros (más recientes)
        .slice(0, 10);

    return (
        <div className="bg-[#111] p-4 rounded-xl border border-[#222] flex flex-col relative overflow-hidden h-75">
            {/* Título de la sección */}
            <div className="flex items-center gap-2 mb-4 h-8 z-10">
                <LuClock className="text-gray-500 text-base" />
                <h3 className="font-bold text-gray-500 text-xs uppercase tracking-widest">Actividad Reciente</h3>
            </div>
             
            <div className="relative overflow-hidden h-full">
                {/* Lista de movimientos con scroll */}
                <div className="space-y-3 overflow-y-auto h-full scrollbar-hide pt-2 pb-10" style={{ scrollbarWidth: 'none' }}>
                    {movimientos.map((movimiento) => {
                        // Determinamos si es un ingreso o gasto buscando en el array de ingresos
                        const esIngreso = ingresos.some(ingreso => ingreso.id === movimiento.id);
                        
                        return (
                            <div key={movimiento.id} className="flex justify-between items-center group pr-1">
                                {/* Información del movimiento */}
                                <div className="flex items-center gap-2">
                                    {/* Icono según tipo de transacción */}
                                    <div className={`p-2 rounded-lg ${esIngreso ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-red-500/10 text-red-500'}`}>
                                        {esIngreso ? <LuArrowUp size={14} /> : <LuArrowDown size={14} />}
                                    </div>
                                    
                                    <div>
                                        <p className="text-sm font-medium text-gray-300 leading-none mb-1">{movimiento.descripcion}</p>
                                        
                                        {/* Fecha formateada en español (día y mes abreviado) */}
                                        <p className="text-[10px] text-gray-500 uppercase">
                                            {new Date(movimiento.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Monto con formato y signo según tipo */}
                                <span className={`text-md font-mono ${esIngreso ? 'text-[#22c55e]' : 'text-red-500'}`}>
                                    {esIngreso ? '+' : '-'}${movimiento.monto.toFixed(2)}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* Gradiente inferior para efecto visual de desvanecimiento */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-[#111] to-transparent z-10 pointer-events-none"></div>
            </div>
        </div>
    )
}