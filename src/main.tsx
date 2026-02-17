// Punto de entrada de la aplicación React
// Se monta el componente principal App en el elemento del DOM con id "root"

import { createRoot } from "react-dom/client";

import "./globals.css";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
