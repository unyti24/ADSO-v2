// Capa de acceso a datos a Agenda ADSO (llamado a la API REST)

// Importamos la URL base desde config.js
import { API_BASE_URL } from "./config";


// GET: listar contactos
export async function listarContactos() {
    const res = await fetch(API_BASE_URL);

    if (!res.ok) {
        throw new Error("Error al listar contactos");
    }

    return res.json();
}

// POST: crear contacto
export async function crearContacto(data) {
    const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // Convertimos el objeto JavaScript a JSON
    });

    if (!res.ok) {
        throw new Error("Error al crear el contacto");
    }

    return res.json();
}

// actualizar contacto
export const actualizarContacto = async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Error al actualizar");
    }

    return await response.json(); // 🔥 ESTO ES LO QUE FALTABA
};

// DELETE: eliminar contacto por id
export async function eliminarContactoPorId(id) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Error al eliminar el contacto");
    }

    return true;
}