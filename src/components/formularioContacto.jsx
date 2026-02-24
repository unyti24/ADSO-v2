import { useState } from "react";

export default function FormularioContacto({ onAgregar }) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    etiqueta: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.telefono || !form.correo) return;

    onAgregar(form);

    setForm({
      nombre: "",
      telefono: "",
      correo: "",
      etiqueta: "",
    });
  };

  return (
<form
  onSubmit={onSubmit}
  className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-4 mb-6"
>
  <label className="text-sm font-semibold">Nombre *</label>
  <input
    name="nombre"
    value={form.nombre}
    onChange={onChange}
    placeholder="Ej: Ana López"
    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-morado"
  />

  <label className="text-sm font-semibold">Teléfono *</label>
  <input
    name="telefono"
    value={form.telefono}
    onChange={onChange}
    className="border rounded-md p-2 focus:ring-2 focus:ring-morado"
  />

  <label className="text-sm font-semibold">Correo *</label>
  <input
    name="correo"
    value={form.correo}
    onChange={onChange}
    className="border rounded-md p-2 focus:ring-2 focus:ring-morado"
  />

  <label className="text-sm font-semibold">Etiqueta (opcional)</label>
  <input
    name="etiqueta"
    value={form.etiqueta}
    onChange={onChange}
    className="border rounded-md p-2 focus:ring-2 focus:ring-morado"
  />

  <button className="bg-morado hover:bg-morado-oscuro text-white py-2 rounded-md">
    Agregar contacto
  </button>
</form>
  );
}

