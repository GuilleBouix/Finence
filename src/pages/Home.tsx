import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { useFinanceStore } from "../store/useFinanceStore";
import { Header } from "../components/Header";
import { SummaryCards } from "../components/SummaryCards";
import { TransactionForm } from "../components/TransactionForm";
import { ActivityList } from "../components/ActivityList";
import { TrendChart } from "../components/TrendChart";
import { DashboardSkeleton } from "../components/Skeleton";
import toast from "react-hot-toast";

// Página principal del dashboard de finanzas personales
export default function Home() {
  // Estado para almacenar los datos del usuario autenticado
  const [usuario, setUsuario] = useState<User | null>(null);

  // Extraemos el estado y las acciones de la store de Zustand
  const {
    // Datos de la store
    ingresos,
    gastos,
    cargando,
    cargandoInicial,

    // Acciones de la store
    obtenerDatos,
    agregarMovimiento,
  } = useFinanceStore();

  // Obtenemos los totales calculados (ingresos, gastos, balance)
  const totales = useMemo(() => {
    const totalIngresos = ingresos.reduce((acc, mov) => acc + mov.monto, 0);
    const totalGastos = gastos.reduce((acc, mov) => acc + mov.monto, 0);
    return {
      ingresos: totalIngresos,
      gastos: totalGastos,
      balance: totalIngresos - totalGastos,
    };
  }, [ingresos, gastos]);

  // Effect que se ejecuta al montar el componente
  // Obtiene el usuario actual y carga sus datos de finanzas
  useEffect(() => {
    const cargarSesion = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUsuario(user);

        // forzarRefresco = true solo la primera vez para asegurar
        // que si la caché quedó "sucia" con arrays vacíos, se limpie.
        await obtenerDatos(user.id, true);
      }
    };

    cargarSesion();
  }, []);

  // Maneja la adición de un nuevo movimiento (ingreso o gasto)
  const manejarNuevoMovimiento = async (
    tipo: "ingresos" | "gastos",
    monto: string,
    descripcion: string,
  ) => {
    if (!usuario) return false;

    const fechaActual = new Date().toISOString();

    const resultado = await agregarMovimiento(tipo, {
      monto: parseFloat(monto),
      descripcion,
      fecha: fechaActual,
      user_id: usuario.id,
    });

    if (resultado) {
      toast.success(
        tipo === "ingresos"
          ? "Ingreso registrado con éxito"
          : "Gasto registrado con éxito",
      );
    } else {
      toast.error("Hubo un problema al guardar el movimiento");
    }

    return resultado;
  };

  return (
    <div className="min-h-screen bg-[#070808] text-white p-4 font-sans antialiased">
      {/* Si es la primera carga, mostramos el esqueleto (skeleton) */}
      {cargandoInicial ? (
        <DashboardSkeleton />
      ) : (
        /* Si ya cargaron los datos, mostramos el dashboard completo */
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Header con logo, navegación y botón de cierre de sesión */}
          <Header />

          {/* Tarjetas de resumen: ingresos, gastos y balance */}
          <SummaryCards totales={totales} />

          {/* Formulario para agregar nuevas transacciones */}
          <TransactionForm onAdd={manejarNuevoMovimiento} cargando={cargando} />

          {/* Grilla con lista de actividad reciente y gráfico de tendencia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade animate-delay-300">
            {/* Lista de los 10 movimientos más recientes */}
            <ActivityList ingresos={ingresos} gastos={gastos} />

            {/* Gráfico de área con la tendencia de ingresos vs gastos */}
            <TrendChart ingresos={ingresos} gastos={gastos} />
          </div>
        </div>
      )}
    </div>
  );
}
