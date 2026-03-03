

// Importamos useEffect y useState para manejar estados y efectos
import { useEffect, useState } from "react";

// Importamos los servicios que se comunican con JSON Server
import {
  listarContactos,
  crearContacto,
  eliminarContactoPorId,
} from "./api";

import Swal from "sweetalert2";

// Importamos los componentes hijos
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

// Componente principal de la aplicación
function App() {

  // Estado que almacena la lista de contactos obtenidos de la API
  const [contactos, setContactos] = useState([]);

  // Estado que indica si estamos cargando información (por ejemplo, al iniciar)
  const [cargando, setCargando] = useState(true);

  // Estado para guardar mensajes de error generales de la aplicación
  const [error, setError] = useState("");

  // useEffect se ejecuta una sola vez cuando el componente se monta
  // Aquí cargamos los contactos iniciales desde JSON Server
  useEffect(() => {

    // Función asincrónica para obtener los contactos
    const cargarContactos = async () => {
      try {
        // Indicamos que estamos cargando
        setCargando(true);

        // Limpiamos posibles errores anteriores
        setError("");

        // Llamamos a la API para listar contactos
        const data = await listarContactos();

        // Guardamos los contactos en el estado
        setContactos(data);

      } catch (error) {
        // Mostramos el error en consola para depuración
        console.error("Error al cargar contactos:", error);

        // Mostramos mensaje amigable al usuario
        setError(
          "No se pudieron cargar los contactos. Verifica que el servidor esté encendido e intenta de nuevo."
        );

      } finally {
        // Finalizamos el estado de carga
        setCargando(false);
      }
    };

    // Ejecutamos la función
    cargarContactos();

  }, []);

  // Función para agregar un nuevo contacto
  // Es async para poder usar await
  const onAgregarContacto = async (nuevoContacto) => {
    try {
      // Limpiamos errores anteriores
      setError("");

      // Llamamos al servicio que crea el contacto
      const creado = await crearContacto(nuevoContacto);

      // Actualizamos la lista agregando el nuevo contacto
      setContactos((prev) => [...prev, creado]);

      // Retornamos el contacto creado para que el formulario pueda usar datos (ej. nombre)
      return creado;

    } catch (error) {
      // Mostramos el error en consola
      console.error("Error al crear contacto:", error);

      // Mostramos mensaje amigable al usuario
      setError(
        "No se pudo guardar el contacto. Verifica tu conexión o el estado del servidor e intenta nuevamente."
      );

      // Relanzamos el error para que el formulario lo detecte si es necesario
      throw error;
    }
  };

  // Función para eliminar un contacto por su id (con SweetAlert2)
  const onEliminarContacto = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar contacto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      setError("");

      await eliminarContactoPorId(id);

      setContactos((prev) => prev.filter((c) => c.id !== id));

      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El contacto fue eliminado correctamente",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al eliminar contacto:", error);

      setError(
        "No se pudo eliminar el contacto. Vuelve a intentarlo o verifica el servidor."
      );
    }
  };

  // JSX que renderiza la aplicación
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Contenedor principal centrado */}
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Encabezado principal */}
        <header className="mb-8">
          <p className="text-xs tracking-[0.3em] text-gray-500 uppercase">
            Desarrollo Web ReactJS Ficha 3223876
          </p>

          <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
            Agenda ADSO v6
          </h1>

          <p className="text-sm text-gray-600 mt-1">
            Gestión de contactos conectada a una API local con JSON Server,
            ahora con validaciones y mejor experiencia de usuario.
          </p>
        </header>

        {/* Si existe un error global lo mostramos en un recuadro rojo */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Si estamos cargando mostramos mensaje */}
        {cargando ? (
          <p className="text-sm text-gray-500">
            Cargando contactos...
          </p>
        ) : (
          <>
            {/* Formulario para agregar nuevos contactos */}
            <FormularioContacto onAgregar={onAgregarContacto} />

            {/* Sección de listado de contactos */}
            <section className="space-y-4">
              {contactos.length === 0 ? (
                // Mensaje si no hay contactos
                <p className="text-sm text-gray-500">
                  Aún no tienes contactos registrados.
                  Agrega el primero usando el formulario superior.
                </p>
              ) : (
                // Recorremos la lista y mostramos una tarjeta por cada contacto
                contactos.map((c) => (
                  <ContactoCard
                    key={c.id}
                    nombre={c.nombre}
                    telefono={c.telefono}
                    correo={c.correo}
                    etiqueta={c.etiqueta}
                    empresa={c.empresa}
                    onEliminar={() => onEliminarContacto(c.id)}
                  />
                ))
              )}
            </section>
          </>
        )}

        {/* Pie de página */}
        <footer className="mt-8 text-xs text-gray-400">
          <p>Desarrollo Web – ReactJS | Proyecto Agenda ADSO</p>
          <p>Instructor: Gustavo Adolfo Bolaños Dorado</p>
        </footer>

      </div>
    </div>
  );
}

// Exportamos el componente principal
export default App;