// Archivo: src/config.js
// Este archivo centraliza las configuraciones reutilizables
// de la aplicación Agenda ADSO.

// ------------------------------------------------------
// URL BASE DE LA API
// ------------------------------------------------------
// Si el puerto del JSON Server cambia,
// solo debemos modificar esta línea.
export const API_BASE_URL = "http://localhost:3001/contactos";

// ------------------------------------------------------
// INFORMACIÓN GENERAL DE LA APLICACIÓN
// ------------------------------------------------------
// Estos datos se usarán en el encabezado de App.jsx
export const APP_INFO = {
  
  ficha: "3223876",


  titulo: "Agenda ADSO v7",

  subtitulo:
    "Gestión de contactos conectada a una API local con JSON Server, con validaciones y mejor experiencia de usuario.",
};