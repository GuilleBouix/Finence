import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Mapeo de rutas a títulos para la pestaña del navegador
const titulosPorRuta: Record<string, string> = {
  "/login": "FINENCE | Login",
  "/": "FINENCE",
  "/historial": "FINENCE | Historial",
  "/opciones": "FINENCE | Opciones",
};

export const TitleUpdater = () => {
  // Obtenemos la ruta actual
  const location = useLocation();

  // Actualiza el título de la página en la pestaña del navegador
  useEffect(() => {
    // Obtenemos el título correspondiente a la ruta actual
    const titulo = titulosPorRuta[location.pathname] || "FINENCE | Login";

    // Actualizamos el título del documento
    document.title = titulo;
  }, [location]);

  // Este componente no renderiza ningún elemento visual
  return null;
};
