// Archivo: src/App.jsx
// Versión PRO de la Agenda ADSO con dos vistas:
// - Vista "crear": solo formulario para crear contactos.
// - Vista "contactos": listado, búsqueda, ordenamiento, edición y eliminación.
// NO se usa React Router, solo un estado de vista.

import { useEffect, useState } from "react";
import {
  listarContactos,
  crearContacto,
  actualizarContacto,
  eliminarContactoPorId,
} from "./api";

import { APP_INFO } from "./config";
import Swal from "sweetalert2";
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

function App() {
  // =========================
  // ESTADOS
  // =========================

  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [ordenAsc, setOrdenAsc] = useState(true);
  const [contactoEnEdicion, setContactoEnEdicion] = useState(null);
  const [vista, setVista] = useState("crear");

  // =========================
  // CARGAR CONTACTOS
  // =========================

  useEffect(() => {
    const cargarContactos = async () => {
      try {
        setCargando(true);
        setError("");

        const data = await listarContactos();
        setContactos(data);
      } catch (error) {
        console.error("Error al cargar contactos:", error);

        setError(
          "No se pudieron cargar los contactos. Verifica que el servidor esté encendido e intenta de nuevo."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarContactos();
  }, []);

  // =========================
  // CREAR CONTACTO
  // =========================

  const onAgregarContacto = async (nuevoContacto) => {
    try {
      setError("");

      const creado = await crearContacto(nuevoContacto);

      setContactos((prev) => [...prev, creado]);
    } catch (error) {
      console.error("Error al crear contacto:", error);

      setError(
        "No se pudo guardar el contacto. Verifica tu conexión o el servidor."
      );
      // No relanzamos el error para evitar promesas rechazadas no manejadas
    }
  };

  // =========================
  // ACTUALIZAR CONTACTO
  // =========================

  const onActualizarContacto = async (contactoActualizado) => {
    try {
      setError("");

      const actualizado = await actualizarContacto(
        contactoActualizado.id,
        contactoActualizado
      );

      setContactos((prev) =>
        prev.map((c) => (c.id === actualizado.id ? actualizado : c))
      );

      setContactoEnEdicion(null);
    } catch (error) {
      console.error("Error al actualizar contacto:", error);

      setError("No se pudo actualizar el contacto. Intenta nuevamente.");
      // No relanzamos el error aquí
    }
  };

  // =========================
  // ELIMINAR CONTACTO
  // =========================

  const onEliminarContacto = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar contacto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      setError("");

      await eliminarContactoPorId(id);

      setContactos((prev) => prev.filter((c) => c.id !== id));

      setContactoEnEdicion((actual) =>
        actual && actual.id === id ? null : actual
      );

      await Swal.fire({
        icon: "success",
        title: "Contacto eliminado",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al eliminar contacto:", error);

      setError("No se pudo eliminar el contacto.");
    }
  };

  // =========================
  // CONTROLES UI
  // =========================

  const onEditarClick = (contacto) => {
    setContactoEnEdicion(contacto);
    setError("");
  };

  const onCancelarEdicion = () => setContactoEnEdicion(null);

  const irAVerContactos = () => {
    setVista("contactos");
    setContactoEnEdicion(null);
  };

  const irACrearContacto = () => {
    setVista("crear");
    setContactoEnEdicion(null);
    setBusqueda("");
  };

  // =========================
  // FILTRADO
  // =========================

  const contactosFiltrados = contactos.filter((c) => {
    const termino = busqueda.toLowerCase();

    return (
      (c.nombre || "").toLowerCase().includes(termino) ||
      (c.correo || "").toLowerCase().includes(termino) ||
      ((c.etiqueta || "") + "").toLowerCase().includes(termino)
    );
  });

  // =========================
  // ORDENAMIENTO
  // =========================

  const contactosOrdenados = [...contactosFiltrados].sort((a, b) => {
    const nombreA = (a.nombre || "").toLowerCase();
    const nombreB = (b.nombre || "").toLowerCase();

    if (nombreA < nombreB) return ordenAsc ? -1 : 1;
    if (nombreA > nombreB) return ordenAsc ? 1 : -1;

    return 0;
  });

  const estaEnVistaCrear = vista === "crear";
  const estaEnVistaContactos = vista === "contactos";

  // =========================
  // INTERFAZ
  // =========================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">

      {/* HEADER */}

      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
              A
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Proyecto ABP
              </p>

              <h1 className="text-sm md:text-base font-semibold text-slate-50">
                Agenda ADSO - ReactJS
              </h1>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
              SENA CTMA
            </p>

            <p className="text-xs text-slate-200">
              Ficha {APP_INFO.ficha}
            </p>
          </div>

        </div>
      </header>

      {/* MAIN */}

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-10 pb-14">

        <div className="grid gap-8 md:grid-cols-[1.6fr,1fr] items-start">

          {/* TARJETA PRINCIPAL */}

          <div className="bg-white/95 rounded-3xl shadow-2xl border border-slate-100 px-6 py-7 md:px-8 md:py-8">

            <header className="mb-5 flex items-start justify-between gap-3">

              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {APP_INFO.titulo}
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  {APP_INFO.subtitulo}
                </p>
              </div>

              <button
                type="button"
                onClick={estaEnVistaCrear ? irAVerContactos : irACrearContacto}
                className="text-xs md:text-sm px-4 py-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                {estaEnVistaCrear
                  ? "Ver contactos"
                  : "Volver a crear contacto"}
              </button>

              <button
                type="button"
                onClick={() => setOrdenAsc((v) => !v)}
                className="ml-3 text-xs md:text-sm px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                title={ordenAsc ? "Ordenar Z → A" : "Ordenar A → Z"}
              >
                {ordenAsc ? "A → Z" : "Z → A"}
              </button>

            </header>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {cargando ? (
              <p className="text-sm text-gray-500">Cargando contactos...</p>
            ) : (
              <>
                {estaEnVistaCrear && (
                  <FormularioContacto
                    onAgregar={onAgregarContacto}
                    onActualizar={onActualizarContacto}
                    contactoEnEdicion={null}
                    onCancelarEdicion={onCancelarEdicion}
                  />
                )}

                {estaEnVistaContactos && (
                  <>
                    {contactoEnEdicion && (
                      <FormularioContacto
                        onAgregar={onAgregarContacto}
                        onActualizar={onActualizarContacto}
                        contactoEnEdicion={contactoEnEdicion}
                        onCancelarEdicion={onCancelarEdicion}
                      />
                    )}

                    {contactosOrdenados.map((c) => (
                      <ContactoCard
                        key={c.id}
                        nombre={c.nombre}
                        telefono={c.telefono}
                        correo={c.correo}
                        etiqueta={c.etiqueta}
                        onEliminar={() => onEliminarContacto(c.id)}
                        onActualizar={() => onEditarClick(c)}
                      />
                    ))}
                  </>
                )}
              </>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default App;