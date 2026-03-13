// Archivo: src/App.jsx
// Agenda ADSO PRO con diseño dashboard + CRUD + SweetAlert + modal edición

import { APP_INFO } from "./config";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

import {
  listarContactos,
  crearContacto,
  eliminarContactoPorId,
  actualizarContacto
} from "./app";

import FormularioContacto from "./components/formularioContacto";
import ContactoCard from "./components/contactoCard";

function App() {

  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const [vista, setVista] = useState("crear");

  const [busqueda, setBusqueda] = useState("");
  const [ordenAsc, setOrdenAsc] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);

  const [formEditar, setFormEditar] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    empresa: "",
    etiqueta: "",
  });

  // Cargar contactos
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
          "No se pudieron cargar los contactos. Verifica que el servidor esté encendido."
        );

      } finally {

        setCargando(false);

      }
    };

    cargarContactos();

  }, []);

  // Crear contacto
  const onAgregarContacto = async (nuevoContacto) => {

    try {

      setError("");

      const creado = await crearContacto(nuevoContacto);

      setContactos((prev) => [...prev, creado]);

      setMensajeExito("Contacto agregado correctamente ✅");

      setTimeout(() => {
        setMensajeExito("");
      }, 3000);

    } catch (error) {

      console.error("Error al crear contacto:", error);

      setError(
        "No se pudo guardar el contacto."
      );

      throw error;
    }
  };

  // Eliminar contacto
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

      await eliminarContactoPorId(id);

      setContactos((prev) => prev.filter((c) => c.id !== id));

      Swal.fire({
        icon: "success",
        title: "Eliminado",
        timer: 2000,
        showConfirmButton: false,
      });

    } catch (error) {

      console.error("Error al eliminar:", error);

      setError("No se pudo eliminar el contacto.");
    }
  };

  // Abrir modal editar
  const abrirModalEditar = (contacto) => {

    setContactoSeleccionado(contacto);

    setFormEditar({
      nombre: contacto.nombre,
      telefono: contacto.telefono,
      correo: contacto.correo,
      empresa: contacto.empresa,
      etiqueta: contacto.etiqueta,
    });

    setMostrarModal(true);
  };

  // Confirmar actualización
  const confirmarActualizacion = async () => {

    const result = await Swal.fire({
      title: "¿Guardar cambios?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#d33",
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {

      const actualizado = await actualizarContacto(
        contactoSeleccionado.id,
        formEditar
      );

      setContactos((prev) =>
        prev.map((c) =>
          c.id === actualizado.id ? actualizado : c
        )
      );

      setMostrarModal(false);

      Swal.fire({
        icon: "success",
        title: "Actualizado",
        timer: 2000,
        showConfirmButton: false,
      });

    } catch (error) {

      console.error("Error al actualizar:", error);

      setError("No se pudo actualizar el contacto.");
    }
  };

  // FILTRAR
  const contactosFiltrados = contactos.filter((c) => {

    const termino = busqueda.toLowerCase();

    return (
      c.nombre.toLowerCase().includes(termino) ||
      c.correo.toLowerCase().includes(termino) ||
      (c.etiqueta || "").toLowerCase().includes(termino)
    );
  });

  // ORDENAR
  const contactosOrdenados = [...contactosFiltrados].sort((a, b) => {

    const nombreA = a.nombre.toLowerCase();
    const nombreB = b.nombre.toLowerCase();

    if (nombreA < nombreB) return ordenAsc ? -1 : 1;
    if (nombreA > nombreB) return ordenAsc ? 1 : -1;

    return 0;
  });

  const estaEnVistaCrear = vista === "crear";
  const estaEnVistaContactos = vista === "contactos";

  const irAVerContactos = () => setVista("contactos");

  const irACrearContacto = () => {
    setVista("crear");
    setBusqueda("");
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">

      {/* HEADER */}

      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">

        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between">

          <div className="flex items-center gap-3">

            <div className="h-9 w-9 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-bold">
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

            <p className="text-xs text-slate-400">
              SENA CTMA
            </p>

            <p className="text-xs text-slate-200">
              Ficha {APP_INFO.ficha}
            </p>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="max-w-6xl mx-auto px-4 py-10">

        <div className="grid md:grid-cols-[1.6fr,1fr] gap-8">

          {/* PANEL PRINCIPAL */}

          <div className="bg-white rounded-3xl shadow-2xl p-8">

            <header className="mb-6 flex justify-between">

              <div>

                <h2 className="text-3xl font-bold text-gray-900">
                  {APP_INFO.titulo}
                </h2>

                <p className="text-sm text-gray-600">
                  {APP_INFO.subtitulo}
                </p>

              </div>

              <button
                onClick={estaEnVistaCrear ? irAVerContactos : irACrearContacto}
                className="px-4 py-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-sm"
              >
                {estaEnVistaCrear ? "Ver contactos" : "Crear contacto"}
              </button>

            </header>


            {/* MENSAJES */}

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            {mensajeExito && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 text-green-700 text-sm">
                {mensajeExito}
              </div>
            )}


            {cargando ? (

              <p>Cargando contactos...</p>

            ) : (

              <>

                {estaEnVistaCrear && (
                  <FormularioContacto onAgregar={onAgregarContacto} />
                )}

                {estaEnVistaContactos && (

                  <>

                    <div className="flex gap-3 mb-4">

                      <input
                        type="text"
                        placeholder="Buscar contacto..."
                        className="w-full h-10 px-4 border rounded-xl text-sm"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                      />

                      <button
                        onClick={() => setOrdenAsc(!ordenAsc)}
                        className="px-4 py-2 bg-gray-100 rounded-xl text-sm"
                      >
                        {ordenAsc ? "Z-A" : "A-Z"}
                      </button>

                    </div>

                    <section className="space-y-3">

                      {contactosOrdenados.map((c) => (

                        <ContactoCard
                          key={c.id}
                          nombre={c.nombre}
                          telefono={c.telefono}
                          correo={c.correo}
                          empresa={c.empresa}
                          etiqueta={c.etiqueta}
                          onEliminar={() => onEliminarContacto(c.id)}
                          onActualizar={() => abrirModalEditar(c)}
                        />

                      ))}

                    </section>

                  </>

                )}

              </>

            )}

          </div>


          {/* PANEL DERECHO */}

          <aside className="space-y-5">

            <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-3xl p-6 shadow-xl">

              <p className="text-[10px] uppercase tracking-[0.3em] text-purple-100/80">Proyecto ABP</p>
              <h2 className="text-lg font-bold mt-2">Agenda ADSO - Dashboard</h2>
              <p className="text-sm text-purple-100 mt-1">CRUD completo con React y JSON Server.</p>
              <p className="text-sm mt-1">
                Contactos registrados
              </p>

              <p className="text-3xl font-bold mt-3">
                {contactos.length}
              </p>

            </div>


            <div className="bg-white rounded-2xl p-4 shadow">

              <h3 className="font-semibold mb-2">
                💡 Tips de Codigo Limpio
              </h3>

              <ul className="text-sm text-gray-600 space-y-1">

                <li>Usa etiquetas para organizar.</li>
                <li>Guarda teléfonos con indicativo.</li>
                <li>Edita o elimina desde la lista.</li>

              </ul>

            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-700 p-4 text-slate-100 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">SENA CTMA ADSO</p>
              <p className="text-sm font-semibold mt-2">Desarrollo Web - ReactJS</p>
              <p className="text-xs text-slate-400 mt-3 italic">
                "Agenda ADSO es tu carta de presentación como desarrollador."
              </p>
            </div>

          </aside>

        </div>

      </main>


      {/* MODAL */}

      {mostrarModal && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white rounded-2xl p-8 w-full max-w-xl">

            <h2 className="text-xl font-bold mb-4">
              Editar Contacto
            </h2>

            <div className="space-y-3">

              {Object.keys(formEditar).map((campo) => (

                <input
                  key={campo}
                  value={formEditar[campo]}
                  placeholder={campo}
                  onChange={(e) =>
                    setFormEditar({
                      ...formEditar,
                      [campo]: e.target.value
                    })
                  }
                  className="w-full h-10 px-4 border rounded-xl"
                />

              ))}

            </div>

            <div className="flex gap-3 mt-5 justify-end">

              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarActualizacion}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg"
              >
                Guardar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;