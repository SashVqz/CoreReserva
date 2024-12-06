"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Obtener el rol del usuario desde localStorage
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>
          CoreReserva
        </h1>
        {role !== undefined && role && (
          <div className="flex items-center space-x-4">
            {role === "admin" && (
              <button
                className="hover:underline"
                onClick={() => router.push("/users")}
              >
                Personal
              </button>
            )}

            <button
              className="hover:underline"
              onClick={() => router.push("/clients")}
            >
              Clientes
            </button>

            <button
              className="hover:underline"
              onClick={() => router.push("/products")}
            >
              Productos
            </button>
            <button
              className="hover:underline"
              onClick={() => router.push("/orders")}
            >
              Ventas
            </button>
            
            <button className="hover:underline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}