import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Mapeo de rutas a títulos para la pestaña del navegador. Cada ruta tiene su título personalizado
const titulosPorRuta: Record<string, string> = {
  "/login": "FINENCE | Login", // Ruta de login (redirige a /auth en el router, pero mantenemos por compatibilidad)
  "/": "FINENCE", // Ruta principal del dashboard
  "/historial": "FINENCE | Historial", // Ruta del historial de transacciones
  "/opciones": "FINENCE | Opciones", // Ruta de opciones/configuración
};

// Componente TitleUpdater. Actualiza el título de la pestaña del navegador según la ruta actual
export const TitleUpdater = () => {
  // Obtenemos la ruta actual
  const location = useLocation();

  // Actualiza el título de la página en la pestaña del navegador
  useEffect(() => {
    // Obtenemos el título correspondiente a la ruta actual
    const titulo = titulosPorRuta[location.pathname] || "FINENCE | Login";

    // Actualizamos el título del documento
    document.title = titulo;
  }, [location]); // Se re-ejecuta cuando cambia la ubicación (ruta)

  // Este componente no renderiza ningún elemento visual
  return null;
};
