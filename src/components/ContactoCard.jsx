export default function ContactoCard({
  nombre,
  telefono,
  correo,
  empresa,
  etiqueta,
  onEliminar,
  onActualizar
}) {
  return (

    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition flex justify-between">

      <div className="p-6 flex-1 space-y-2">

        <h3 className="text-lg font-semibold text-gray-800">
          {nombre}
        </h3>

        <p className="text-gray-600 text-sm">
          {telefono}
        </p>

        <p className="text-gray-600 text-sm">
          {correo}
        </p>

        <p className="text-gray-600 text-sm">
          {empresa}
        </p>

        {etiqueta && (
          <span className="inline-block bg-purple-50 text-purple-600 text-sm px-3 py-1 rounded-full">
            {etiqueta}
          </span>
        )}

      </div>

      <div className="w-40 border-l p-4 flex flex-col gap-3">

        <button
          onClick={onActualizar}
          className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl"
        >
          Actualizar
        </button>

        <button
          onClick={onEliminar}
          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
        >
          Eliminar
        </button>

      </div>

    </div>
  );
}
