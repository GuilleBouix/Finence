export const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-[#222] animate-pulse rounded-lg ${className}`}></div>
);

// Muestra una versión esqueleto de todo el dashboard mientras cargan los datos
export const DashboardSkeleton = () => (
  <div className="max-w-3xl mx-auto space-y-4">
    {/* Skeleton del Header (logo y navegación) */}
    <div className="h-20 bg-[#111] rounded-xl flex items-center px-4 justify-between">
      <div className="space-y-2">
        {/* Placeholder del logo */}
        <Skeleton className="h-6 w-32" />

        {/* Placeholder del botón de logout */}
        <Skeleton className="h-3 w-24" />
      </div>

      {/* Placeholder de botones de navegación */}
      <Skeleton className="h-8 w-20" />
    </div>

    {/* Skeleton de las tarjetas de resumen (3 tarjetas) */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Generamos 3 skeleton cards iguales */}
      {[1, 2, 3].map((indice) => (
        <div key={indice} className="h-24 bg-[#111] rounded-xl p-4 space-y-3">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      ))}
    </div>

    {/* Skeleton del formulario de transacciones */}
    <div className="h-40 bg-[#111] rounded-xl p-4 space-y-4">
      {/* Título del formulario */}
      <Skeleton className="h-3 w-32" />

      {/* Inputs del formulario */}
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-2" />
      </div>

      {/* Botones del formulario */}
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>

    {/* Skeleton de la parte inferior (lista y gráfico) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Skeleton de lista de actividad reciente */}
      <div className="h-75 bg-[#111] rounded-xl p-4 space-y-4">
        <Skeleton className="h-4 w-1/3" />
        <div className="space-y-3">
          {/* Varios skeleton de items de lista */}
          {[1, 2, 3, 4].map((indice) => (
            <Skeleton key={indice} className="h-12 w-full" />
          ))}
        </div>
      </div>

      {/* Skeleton del gráfico de tendencia */}
      <div className="h-75 bg-[#111] rounded-xl p-4">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  </div>
);
