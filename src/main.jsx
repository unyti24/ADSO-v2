import React from "react";
import ReactDOM from "react-dom/client";

// Importamos el componente raíz
import App from "./App.jsx";

// Importante: trae Tailwind a la app
import "./index.css";

// Importaciones correctas
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";

// Punto de entrada de la app: renderiza <App /> dentro de #root
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);