"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/NavbarHome";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (!role || !name) {
      router.push("/login");
    } else {
      setUser({ role, name });
    }
  }, [router]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-700">Cargando...</p>
      </div>
    );
  }

  return (
    <>  
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h1 className="text-4xl font-bold text-gray-800">
              Bienvenido, {user.name}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Tu rol es:{" "}
              <span className="font-semibold text-blue-600">{user.role}</span>
            </p>
            {user.role === "admin" ? (
              <p className="mt-4 text-gray-700">
                Tienes acceso al panel de administración.
              </p>
            ) : (
              <p className="mt-4 text-gray-700">
                No tienes permisos administrativos.
              </p>
            )}
          </div>

          {user.role === "admin" && (
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Panel Administrador</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  className="bg-blue-600 text-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition"
                  onClick={() => router.push("/users")}
                >
                  <h2 className="text-2xl font-bold">Gestión de Personal</h2>
                  <p className="mt-2 text-sm">Administra los usuarios del sistema.</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">CoreReserva</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                className="bg-green-600 text-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-green-700 transition"
                onClick={() => router.push("/clients")}
              >
                <h2 className="text-2xl font-bold">Gestión de Clientes</h2>
                <p className="mt-2 text-sm">Gestiona los datos de tus clientes.</p>
              </div>

              <div
                className="bg-yellow-600 text-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-yellow-700 transition"
                onClick={() => router.push("/products")}
              >
                <h2 className="text-2xl font-bold">Gestión de Productos</h2>
                <p className="mt-2 text-sm">Administra el inventario de productos.</p>
              </div>

              <div
                className="bg-red-600 text-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-red-700 transition"
                onClick={() => router.push("/orders")}
              >
                <h2 className="text-2xl font-bold">Gestión de Pedidos</h2>
                <p className="mt-2 text-sm">Revisa y gestiona las pedidos.</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">CoreBodegas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                className="bg-purple-600 text-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-purple-700 transition"
                onClick={() => router.push("/materiaPrima")}
              >
                <h2 className="text-2xl font-bold">Gestión de Materia Prima</h2>
                <p className="mt-2 text-sm">Administra la materia prima de las bodegas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}