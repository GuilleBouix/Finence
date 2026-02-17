import { LuTrendingUp, LuTrendingDown, LuScale } from "react-icons/lu";
import type { Totales } from "../types/finance";

export const SummaryCards = ({ totales }: { totales: Totales }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 animate-fade animate-delay-100">
    {/* Tarjeta de Ingresos: fondo verde oscuro, borde verde */}
    <div className="flex justify-between items-center bg-linear-to-br from-[#1a2c24] to-[#0a0a0a] px-4 py-6 rounded-xl border border-[#2d4d3d]">
      <div>
        {/* Etiqueta de título */}
        <p className="flex justify-between text-gray-500 text-xs uppercase mb-1">
          Ingresos
        </p>

        {/* Monto formateado con separadores de miles */}
        <p className="text-xl font-bold font-mono text-[#22c55e]">
          $ {totales.ingresos.toLocaleString()}
        </p>
      </div>

      {/* Icono de tendencia positiva */}
      <LuTrendingUp className="text-green-400/70 text-2xl mr-2" />
    </div>

    {/* Tarjeta de Gastos: fondo rojo oscuro, borde rojo */}
    <div className="flex justify-between items-center bg-linear-to-br from-[#2c1a1a] to-[#0a0a0a] px-4 py-6 rounded-xl border border-[#4d2d2d]">
      <div>
        {/* Etiqueta de título */}
        <p className="flex justify-between text-gray-500 text-xs uppercase mb-1">
          Gastos
        </p>

        {/* Monto formateado con separadores de miles */}
        <p className="text-xl font-bold font-mono text-red-400">
          $ {totales.gastos.toLocaleString()}
        </p>
      </div>

      {/* Icono de tendencia negativa */}
      <LuTrendingDown className="text-red-400/70 text-2xl mr-2" />
    </div>

    {/* Tarjeta de Balance: fondo azul oscuro, borde azul */}
    <div className="flex justify-between items-center bg-linear-to-br from-[#1a222c] to-[#0a0a0a] px-4 py-6 rounded-xl border border-[#2d3a4d] relative overflow-hidden">
      <div>
        {/* Etiqueta de título */}
        <p className="flex justify-between text-gray-400 text-xs uppercase mb-1">
          Balance
        </p>

        {/* Monto formateado con separadores de miles */}
        <p className="text-xl font-bold font-mono text-white">
          $ {totales.balance.toLocaleString()}
        </p>
      </div>

      {/* Icono de balanza */}
      <LuScale className="text-[#4d6481]/70 text-2xl mr-2" />
    </div>
  </div>
);
