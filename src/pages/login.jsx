import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "admin@sena.com" && password === "1234") {
      login();
      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: "Inicio de sesión exitoso",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Credenciales incorrectas",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Login Agenda ADSO
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Ingresa con tus credenciales para acceder
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 border rounded-xl"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-4 border rounded-xl"
          />

          <button
            type="submit"
            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500">
          <p><strong>Correo:</strong> admin@sena.com</p>
          <p><strong>Contraseña:</strong> 1234</p>
        </div>
      </div>
    </div>
  );
}