import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LuChartSpline } from "react-icons/lu";
import { useState, useMemo } from "react";
import type { Movimiento } from "../types/finance";

// Props que recibe el componente
interface TrendChartProps {
  ingresos: Movimiento[];
  gastos: Movimiento[];
}

// Componente de gráfico de tendencia. Muestra un gráfico de área con la evolución de ingresos vs gastos. Permite alternar entre ver ingresos o gastos
export const TrendChart = ({ ingresos, gastos }: TrendChartProps) => {
  // Estado para alternar entre mostrar ingresos o gastos
  const [verIngresos, setVerIngresos] = useState(true);

  // useMemo calcula los datos del gráfico solo cuando cambian ingresos o gastos. Esto evita recalculos costosos en cada render
  const datosGrafico = useMemo(() => {
    // Combinamos todos los movimientos
    const todosLosMovimientos = [...ingresos, ...gastos];

    // Interface para los datos agrupados del gráfico
    interface DatoGrafico {
      name: string;
      ingreso: number;
      gasto: number;
      fechaOriginal: Date;
    }

    // Usamos reduce para agrupar movimientos por fecha y calcular el total de ingresos y gastos por día
    const datosAgrupados = todosLosMovimientos.reduce(
      (acumulador: DatoGrafico[], movimientoActual) => {
        // Formateamos la fecha a día-mes abreviado
        const fechaFormateada = new Date(
          movimientoActual.fecha,
        ).toLocaleDateString("es-ES", { day: "2-digit", month: "short" });

        // Buscamos si ya existe un registro para esta fecha
        const registroExistente = acumulador.find(
          (item) => item.name === fechaFormateada,
        );

        // Determinamos si el movimiento actual es un ingreso
        const esIngreso = ingresos.some(
          (ingreso) => ingreso.id === movimientoActual.id,
        );

        // Si ya existe la fecha, sumamos al total correspondiente
        if (registroExistente) {
          if (esIngreso) {
            registroExistente.ingreso += movimientoActual.monto;
          } else {
            registroExistente.gasto += movimientoActual.monto;
          }
        } else {
          // Si no existe, creamos un nuevo registro para esa fecha
          acumulador.push({
            name: fechaFormateada,

            // Si es ingreso, asignamos el monto a ingreso, si no a gasto
            ingreso: esIngreso ? movimientoActual.monto : 0,
            gasto: esIngreso ? 0 : movimientoActual.monto,

            // Guardamos la fecha original para ordenar correctamente
            fechaOriginal: new Date(movimientoActual.fecha),
          });
        }

        return acumulador;
      },
      [] as DatoGrafico[],
    );

    // Ordenamos los datos por fecha cronológica
    return datosAgrupados.sort((datoA, datoB) => {
      return datoA.fechaOriginal.getTime() - datoB.fechaOriginal.getTime();
    });
  }, [ingresos, gastos]);

  return (
    <div className="bg-[#111] p-4 rounded-xl border border-[#222] flex flex-col h-75">
      {/* Título y botones de alternancia */}
      <div className="flex justify-between items-center mb-4 h-8">
        <div className="flex items-center gap-2">
          <LuChartSpline className="text-gray-500 text-base" />
          <h3 className="font-bold text-gray-500 text-xs uppercase tracking-widest">
            Tendencia
          </h3>
        </div>

        {/* Botones para alternar entre ingresos y gastos */}
        <div className="flex bg-[#0a0a0a] p-1 rounded-lg border border-[#222]">
          {/* Botón de ingresos (verde cuando está activo) */}
          <button
            onClick={() => setVerIngresos(true)}
            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all outline-none cursor-pointer ${verIngresos ? "bg-[#22c55e] text-black" : "text-gray-500"}`}
          >
            INGRESOS
          </button>

          {/* Botón de gastos (rojo cuando está activo) */}
          <button
            onClick={() => setVerIngresos(false)}
            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all outline-none cursor-pointer ${!verIngresos ? "bg-red-500 text-white" : "text-gray-500"}`}
          >
            GASTOS
          </button>
        </div>
      </div>

      {/* Contenedor del gráfico */}
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={datosGrafico}>
            <defs>
              {/* Degradado verde para ingresos */}
              <linearGradient id="colorIngreso" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>

              {/* Degradado rojo para gastos */}
              <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid del gráfico (líneas horizontales) */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#1a1a1a"
            />

            {/* Eje X con las fechas */}
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#444", fontSize: 9 }}
              minTickGap={20}
            />

            {/* Eje Y oculto */}
            <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />

            {/* Tooltip al hacer hover */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid #222",
                borderRadius: "8px",
                fontSize: "10px",
              }}
              itemStyle={{ color: verIngresos ? "#22c55e" : "#ef4444" }}
            />

            {/* Área del gráfico */}
            <Area
              type="monotone"
              // Mostramos ingreso o gasto según el estado
              dataKey={verIngresos ? "ingreso" : "gasto"}
              // Color de la línea según el tipo
              stroke={verIngresos ? "#22c55e" : "#ef4444"}
              strokeWidth={2}
              fillOpacity={1}
              // Relleno con el degradado correspondiente
              fill={verIngresos ? "url(#colorIngreso)" : "url(#colorGasto)"}
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
