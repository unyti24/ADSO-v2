export default function ContactoCard({
  nombre,
  telefono,
  correo,
  etiqueta,
  onEliminar
}) {
  return (
    <article className="bg-white border rounded-lg shadow-sm p-4 mb-4">
      <h3 className="text-lg font-semibold text-morado-oscuro">
        {nombre}
      </h3>

      <p className="text-gray-600">📞 {telefono}</p>
      <p className="text-gray-600">✉️ {correo}</p>

      {etiqueta && (
        <p className="text-sm text-morado font-medium">
          {etiqueta}
        </p>
      )}

      <div className="mt-3">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
          onClick={() => onEliminar(correo)}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
