// Importamos React y el hook useState para manejar estados locales del componente
import { useState, useRef, useEffect } from "react";

// Componente FormularioContacto
// Recibe como props la función onAgregar (para crear un contacto)
// Recibe como props la función para crear el contacto: `onAgregar` o `onCrear`
function FormularioContacto({ onAgregar, onCrear, onActualizar, contactoEnEdicion, onCancelarEdicion }) {

  // Estado principal del formulario: almacena los valores de cada campo
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    etiqueta: "",
    empresa: "",
  });

  // Estado para almacenar los mensajes de error de validación por cada campo
  const [errores, setErrores] = useState({
    nombre: "",
    telefono: "",
    correo: "",
  });

  const [mensajeExito, setMensajeExito] = useState("");
  const mensajeTimeout = useRef(null);

  useEffect(() => {
    return () => {
      if (mensajeTimeout.current) {
        clearTimeout(mensajeTimeout.current);
        mensajeTimeout.current = null;
      }
    };
  }, []);

  // Si se pasa un contacto para editar, precargar el formulario
  useEffect(() => {
    if (contactoEnEdicion) {
      setForm({
        nombre: contactoEnEdicion.nombre || "",
        telefono: contactoEnEdicion.telefono || "",
        correo: contactoEnEdicion.correo || "",
        etiqueta: contactoEnEdicion.etiqueta || "",
        empresa: contactoEnEdicion.empresa || "",
      });
    }
  }, [contactoEnEdicion]);

  // Estado que indica si el formulario está enviando la información al servidor
  // Sirve para desactivar el botón y mostrar un texto diferente
  const [enviando, setEnviando] = useState(false);

  // Función manejadora del cambio de los inputs
  // Se ejecuta cada vez que el usuario escribe en un campo
  const onChange = (e) => {
    // Extraemos el nombre y el valor del input que disparó el evento
    const { name } = e.target;
    let { value } = e.target;

    // Sanitizar entrada para el campo teléfono: permitir solo dígitos y símbolos comunes
    if (name === "telefono") {
      // Permitimos números, espacios, +, -, y paréntesis
      value = String(value).replace(/[^0-9+\-\s()]/g, "");
    }

    // Actualizamos el estado del formulario manteniendo lo anterior
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Función encargada de validar todos los campos del formulario
  // Devuelve true si el formulario es válido, y false en caso contrario
  function validarFormulario() {

    // Creamos un objeto temporal para ir llenando los mensajes de error
    const nuevosErrores = {
      nombre: "",
      telefono: "",
      correo: "",
    };

    // Validación del campo nombre
    // .trim() elimina espacios en blanco al inicio y al final
    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    // Validación del campo teléfono
    if (!form.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    }

    // Validación del campo correo
    if (!form.correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!form.correo.includes("@")) {
      nuevosErrores.correo = "El correo debe contener @.";
    }

    // Actualizamos el estado de errores
    setErrores(nuevosErrores);

    // Retornamos true SOLO si no hay errores
    return (
      !nuevosErrores.nombre &&
      !nuevosErrores.telefono &&
      !nuevosErrores.correo
    );
  }

  // Función manejadora del envío del formulario
  // Es async porque puede llamar a la API
  const onSubmit = async (e) => {

    // Evitamos que el formulario recargue la página
    e.preventDefault();

    // Ejecutamos la validación
    const esValido = validarFormulario();
    if (!esValido) return;

    try {
      // Activamos el estado enviando
      setEnviando(true);

      // Si estamos editando, llamamos a onActualizar
      let creado = null;
      if (contactoEnEdicion && onActualizar) {
        const payload = { id: contactoEnEdicion.id, ...form };
        creado = await onActualizar(payload);
        // Si existe callback para cancelar edición, llamarlo
        if (onCancelarEdicion) onCancelarEdicion();
      } else {
        const crearFn = onAgregar || onCrear;
        creado = await crearFn(form);
      }

      // Mostrar mensaje de éxito temporal y guardar timeout para poder cancelarlo
      const nombreMostrado = (creado && creado.nombre) || form.nombre || "";
      setMensajeExito(`Contacto ${nombreMostrado} guardado correctamente.`);
      if (mensajeTimeout.current) clearTimeout(mensajeTimeout.current);
      mensajeTimeout.current = setTimeout(() => {
        setMensajeExito("");
        mensajeTimeout.current = null;
      }, 3000);

      // Limpiamos los campos del formulario
      setForm({
        nombre: "",
        telefono: "",
        correo: "",
        etiqueta: "",
        empresa: "",
      });

      // Limpiamos los errores
      setErrores({
        nombre: "",
        telefono: "",
        correo: "",
      });

    } catch (err) {
      // Si onAgregar lanza, lo registramos en consola; no relanzamos
      // para evitar errores no capturados en la UI
      console.error(err);
    } finally {
      // Apagamos el estado enviando
      setEnviando(false);
    }
  };

  const dismissMensaje = () => {
    if (mensajeTimeout.current) {
      clearTimeout(mensajeTimeout.current);
      mensajeTimeout.current = null;
    }
    setMensajeExito("");
  };

  return (
    <form
      className="bg-white shadow-sm rounded-2xl p-6 space-y-4 mb-8"
      onSubmit={onSubmit}
    >
      {/* Título */}
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        {contactoEnEdicion ? "Editar contacto" : "Nuevo contacto"}
      </h2>

      {/* Alerta de éxito */}
      {mensajeExito && (
        <div id="alerta-exito" className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700" role="status" aria-live="polite">
          <div className="flex items-center justify-between">
            <span>{mensajeExito}</span>
            <button onClick={dismissMensaje} className="ml-4 text-green-800 font-semibold">OK</button>
          </div>
        </div>
      )}

      {/* Campo Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre *
        </label>

        <input
          className="w-full rounded-xl border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          name="nombre"
          placeholder="Ej: Camila Pérez"
          value={form.nombre}
          onChange={onChange}
        />

        {/* Mostramos mensaje de error si existe */}
        {errores.nombre && (
          <p className="mt-1 text-xs text-red-600">
            {errores.nombre}
          </p>
        )}
      </div>

      {/* Campo Teléfono */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono *
        </label>

        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9+\-\s()]*"
          className="w-full rounded-xl border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          name="telefono"
          placeholder="Ej: 300 123 4567"
          value={form.telefono}
          onChange={onChange}
        />

        {errores.telefono && (
          <p className="mt-1 text-xs text-red-600">
            {errores.telefono}
          </p>
        )}
      </div>

      {/* Campo Correo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo *
        </label>

        <input
          className="w-full rounded-xl border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          name="correo"
          placeholder="Ej: camila@sena.edu.co"
          value={form.correo}
          onChange={onChange}
        />

        {errores.correo && (
          <p className="mt-1 text-xs text-red-600">
            {errores.correo}
          </p>
        )}
      </div>

      {/* Campo Empresa (opcional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Empresa
        </label>

        <input
          className="w-full rounded-xl border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          name="empresa"
          placeholder="Ej: ACME S.A."
          value={form.empresa}
          onChange={onChange}
        />
      </div>

      {/* Campo Etiqueta (opcional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Etiqueta (opcional)
        </label>

        <input
          className="w-full rounded-xl border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          name="etiqueta"
          placeholder="Ej: Trabajo"
          value={form.etiqueta}
          onChange={onChange}
        />
      </div>

      {/* Botón */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={enviando}
          className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold shadow-sm"
        >
          {enviando ? "Guardando..." : contactoEnEdicion ? "Guardar cambios" : "Agregar contacto"}
        </button>
      </div>
    </form>
  );
}

export default FormularioContacto;

//