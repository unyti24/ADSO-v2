// Archivo: src/config.js
// Este archivo centraliza las configuraciones reutilizables
// de la aplicación Agenda ADSO.

// ------------------------------------------------------
// URL BASE DE LA API
// ------------------------------------------------------
// Si el puerto del JSON Server cambia,
// solo debemos modificar esta línea.
export const API_BASE_URL = "https://agenda-adso-api-ziid.onrender.com/contactos";

// ------------------------------------------------------
// INFORMACIÓN GENERAL DE LA APLICACIÓN
// ------------------------------------------------------
// Estos datos se usarán en el encabezado de App.jsx
export const APP_INFO = {
  
  ficha: "3229207",


  titulo: "Agenda ADSO v10",

  subtitulo:
    "Gestión de contactos conectada a una API local con JSON Server, con validaciones y mejor experiencia de usuario.",
};