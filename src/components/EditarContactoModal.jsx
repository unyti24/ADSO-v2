import { useState, useEffect } from "react";

/*
Este componente muestra un modal para editar un contacto.
Recibe:
- contacto: el contacto que se va a editar
- onClose: función para cerrar el modal
- onGuardar: función para guardar cambios
*/

function EditarContactoModal({ contacto, onClose, onGuardar }) {

  // Estado local para manejar el formulario
  // Usar las mismas claves que el resto de la app: `correo` y `etiqueta`
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    empresa: "",
    etiqueta: ""
  });

  // Cuando cambia el contacto seleccionado
  // se cargan sus datos en el formulario
  useEffect(() => {
    if (contacto) {
      // Mapear campos por si el objeto tiene propiedades distintas
      setFormData({
        nombre: contacto.nombre || "",
        telefono: contacto.telefono || "",
        correo: contacto.correo || contacto.email || "",
        empresa: contacto.empresa || "",
        etiqueta: contacto.etiqueta || contacto.cargo || "",
      });
    }
  }, [contacto]);

  // Maneja los cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Cuando se envía el formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Llamamos a la función que actualizará el contacto
    onGuardar(formData);
  };

  return (
    // Fondo oscuro del modal
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

      {/* Caja del modal */}
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">

        {/* Título */}
        <h2 className="text-xl font-bold mb-4">
          Editar contacto
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="border p-2 rounded"
          />

          <input
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            className="border p-2 rounded"
          />

          <input
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="Correo"
            className="border p-2 rounded"
          />

          <input
            name="empresa"
            value={formData.empresa}
            onChange={handleChange}
            placeholder="Empresa"
            className="border p-2 rounded"
          />

          <input
            name="etiqueta"
            value={formData.etiqueta}
            onChange={handleChange}
            placeholder="Etiqueta"
            className="border p-2 rounded"
          />

          {/* Botones */}
          <div className="flex justify-end gap-2 mt-3">

            {/* Botón cancelar */}
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>

            {/* Botón guardar */}
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default EditarContactoModal;