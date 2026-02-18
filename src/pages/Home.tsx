import { useMemo } from "react";
import { useFinanceStore } from "../store/useFinanceStore";
import { Header } from "../components/common/Header";
import { SummaryCards } from "../components/common/SummaryCards";
import { TransactionForm } from "../components/forms/TransactionForm";
import { ActivityList } from "../components/common/ActivityList";
import { TrendChart } from "../components/common/TrendChart";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { toastService, mensajes } from "../services/toastService";
import { useUsuario } from "../hooks/useUsuario";

// Página principal del dashboard de finanzas personales
export default function Home() {
  // Obtenemos el usuario y estado de carga desde el hook
  const { usuario, usuarioListo } = useUsuario();

  // Extraemos el estado y las acciones de la store de Zustand
  const {
    // Datos de la store
    ingresos,
    gastos,
    cargando,
    cargandoInicial,

    // Acciones de la store
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
      toastService.success(
        tipo === "ingresos"
          ? mensajes.transacciones.ingresoRegistrado
          : mensajes.transacciones.gastoRegistrado,
      );
    } else {
      toastService.error(mensajes.transacciones.errorGuardar);
    }

    return resultado;
  };

  return (
    <div className="min-h-screen bg-[#070808] text-white p-4 font-sans antialiased">
      {/* Si es la primera carga o el usuario no está listo, mostramos el esqueleto */}
      {!usuarioListo || cargandoInicial ? (
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
