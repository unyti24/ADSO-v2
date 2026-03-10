// Importamos la URL base desde config.js
import { API_BASE_URL } from "./config";

// ------------------------------------------------------
// GET - Listar contactos
// ------------------------------------------------------
export async function listarContactos() {
  // Realizamos petición GET
  const res = await fetch(API_BASE_URL);

  // Validamos respuesta
  if (!res.ok) {
    throw new Error("Error al listar contactos");
  }

  // Convertimos la respuesta a JSON
  return res.json();
}

// ------------------------------------------------------
// POST - Crear contacto
// ------------------------------------------------------
export async function crearContacto(data) {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error al crear el contacto");
  }

  return res.json();
}

// ------------------------------------------------------
// DELETE - Eliminar contacto por ID
// ------------------------------------------------------
export async function eliminarContactoPorId(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar el contacto");
  }

  return true;
}

// ------------------------------------------------------
// PATCH - Actualizar contacto por ID
// ------------------------------------------------------
export async function actualizarContacto(id, data) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error al actualizar el contacto");
  }

  return res.json();
}