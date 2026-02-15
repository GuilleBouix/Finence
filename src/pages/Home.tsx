import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import type { User } from '@supabase/supabase-js'
import { useFinanceStore } from '../store/useFinanceStore'
import { Header } from '../components/Header'
import { SummaryCards } from '../components/SummaryCards'
import { TransactionForm } from '../components/TransactionForm'
import { ActivityList } from '../components/ActivityList'
import { TrendChart } from '../components/TrendChart'
import { DashboardSkeleton } from '../components/Skeleton'


// Componente de la página principal (Dashboard)
export default function Home() {
    // Estado para almacenar los datos del usuario autenticado
    const [usuario, setUsuario] = useState<User | null>(null)

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
        obtenerTotales 
    } = useFinanceStore()

    // Obtenemos los totales calculados (ingresos, gastos, balance)
    const totales = obtenerTotales()


    // Effect que se ejecuta al montar el componente. Obtiene el usuario actual y carga sus datos de finanzas

    useEffect(() => {
        // Obtenemos el usuario actualmente autenticado
        supabase.auth.getUser().then(({ data }) => {
            // Si hay un usuario autenticado
            if (data.user) {
                // Guardamos el usuario en el estado local
                setUsuario(data.user)
                // Cargamos los datos de finanzas de este usuario desde Supabase
                obtenerDatos(data.user.id)
            }
        })
        // Esta dependencia asegura que si obtenerDatos cambia, se re-ejecuta el effect
    }, [obtenerDatos])


    // Maneja la adición de un nuevo movimiento (ingreso o gasto). Esta función se pasa al TransactionForm para que el usuario pueda agregar transacciones
    const manejarNuevoMovimiento = async (tipo: 'ingresos' | 'gastos', monto: string, descripcion: string) => {
        // Si no hay usuario, no podemos agregar el movimiento
        if (!usuario) return false;
        
        // Obtenemos la fecha actual en formato ISO
        const fechaActual = new Date().toISOString();
        
        // Llamamos a la acción de la store para agregar el movimiento
        return await agregarMovimiento(tipo, {
            // Convertimos el string del monto a número
            monto: parseFloat(monto),
            descripcion,
            
            // Fecha actual del movimiento
            fecha: fechaActual,
            
            // ID del usuario que crea el movimiento
            user_id: usuario.id
        })
    }

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
    )
}