// import { useState, useEffect } from "react";
// import "./App.css";
// import FormularioContacto from "./components/FormularioContacto";
// import ContactoCard from "./components/ContactoCard";

// export default function App() {

//   const contactosGuardados =
//     JSON.parse(localStorage.getItem("contactos")) || [];

//   const [contactos, setContactos] = useState(contactosGuardados);

//   useEffect(() => {
//     localStorage.setItem("contactos", JSON.stringify(contactos));
//   }, [contactos]);

//   const agregarContacto = (nuevo) => {
//     setContactos((prev) => [...prev, nuevo]);
//   };

//   const eliminarContacto = (correo) => {
//     setContactos((prev) =>
//       prev.filter((c) => c.correo !== correo)
//     );
//   };

//   return (
//     <main className="app-container">
//       <h1 className="app-title">Agenda ADSO v3</h1>
//       <p className="bg-morado text-white text-xs rounded px-2 py-1 w-fit">Analisis y Desarrollo de software</p>

//       <p className="subtitulo">
//         Persistencia con localStorage + UI moderna
//       </p>

//       <FormularioContacto onAgregar={agregarContacto} />

//       {contactos.map((c) => (
//         <ContactoCard
//           key={c.correo}
//           {...c}
//           onEliminar={eliminarContacto}
//         />
//       ))}

//     </main>
//   );
// }
import { useEffect, useState } from "react";
import {
  listarContactos,
  crearContacto,
  eliminarContactoPorId,
} from "./api.js";

import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

export default function App() {
  // Estado principal de la app
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Cargar la lista desde la API al montar el componente (GET)
  useEffect(() => {
    async function cargarContactos() {
      try {
        const data = await listarContactos(); // GET a la API
        setContactos(data); // Guardamos en estado
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar la lista de contactos");
      } finally {
        setCargando(false);
      }
    }

    cargarContactos();
  }, []);

  // Agregar contacto usando la API (POST)
  const agregarContacto = async (nuevo) => {
    try {
      const creado = await crearContacto(nuevo); // POST a la API
      setContactos((prev) => [...prev, creado]); // Actualizamos estado
    } catch (error) {
      console.error(error);
      setError("No se pudo agregar el contacto");
    }
  };

  // Eliminar contacto usando la API (DELETE)
  const eliminarContacto = async (id) => {
    try {
      await eliminarContactoPorId(id); // DELETE en la API
      setContactos((prev) => prev.filter((c) => c.id !== id)); // Quitamos del estado
    } catch (error) {
      console.error(error);
      setError("No se pudo eliminar el contacto");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Encabezado */}
      <header className="max-w-6xl mx-auto px-6 pt-8">
        <p className="text-sm font-semibold text-gray-400 tracking-[0.25em] uppercase">
          Programa ADSO
        </p>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">
          Agenda ADSO v5
        </h1>

        <p className="text-gray-500 mt-1">
          Gestión de contactos conectada a una API local con JSON Server.
        </p>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Mensajes de estado */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {cargando && (
          <div className="rounded-xl bg-purple-50 border border-purple-200 px-4 py-3 text-sm text-purple-700">
            Cargando contactos desde la API...
          </div>
        )}

        {/* Formulario para agregar contactos */}
        <FormularioContacto onAgregar={agregarContacto} />

        {/* Lista de contactos */}
        <div className="space-y-4">
          {contactos.length === 0 && !cargando && (
            <p className="text-gray-500 text-sm">
              No hay contactos aún. Agrega el primero usando el formulario.
            </p>
          )}

          {contactos.map((c) => (
            <ContactoCard
              key={c.id}
              {...c}
              onEliminar={() => eliminarContacto(c.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}