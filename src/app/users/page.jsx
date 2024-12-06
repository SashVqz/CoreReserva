"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error("Error creating user");
      setNewUser({ name: "", email: "", password: "", role: "user" });
      setShowForm(false);
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const updateUser = async () => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });
      if (!res.ok) throw new Error("Error updating user");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error deleting user");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (<>
    <Navbar />
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Gestión de Personal</h1>

      <button
        className={`w-full mb-6 py-3 px-4 rounded-lg text-white font-semibold ${
          showForm ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Ocultar Formulario" : "Crear Usuario"}
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {editingUser ? "Editar Usuario" : "Crear Usuario"}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Nombre"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingUser ? editingUser.name : newUser.name}
              onChange={(e) =>
                editingUser
                  ? setEditingUser({ ...editingUser, name: e.target.value })
                  : setNewUser({ ...newUser, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Correo"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingUser ? editingUser.email : newUser.email}
              onChange={(e) =>
                editingUser
                  ? setEditingUser({ ...editingUser, email: e.target.value })
                  : setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingUser ? editingUser.password : newUser.password}
              onChange={(e) =>
                editingUser
                  ? setEditingUser({ ...editingUser, password: e.target.value })
                  : setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <select
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingUser ? editingUser.role : newUser.role}
              onChange={(e) =>
                editingUser
                  ? setEditingUser({ ...editingUser, role: e.target.value })
                  : setNewUser({ ...newUser, role: e.target.value })
              }
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>

            <div className="flex justify-end gap-4">
              <button
                className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600"
                onClick={editingUser ? updateUser : createUser}
              >
                {editingUser ? "Actualizar" : "Crear"}
              </button>
              {editingUser && (
                <button
                  className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-500"
                  onClick={() => setEditingUser(null)}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Lista de Usuarios</h2>
        {loading ? (
          <p className="text-gray-600">Cargando...</p>
        ) : (
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border px-4 py-2 text-left">Nombre</th>
                <th className="border px-4 py-2 text-left">Correo</th>
                <th className="border px-4 py-2 text-left">Rol</th>
                <th className="border px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-gray-700">{user.name}</td>
                  <td className="border px-4 py-2 text-gray-700">{user.email}</td>
                  <td className="border px-4 py-2 text-gray-700">{user.role}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600"
                      onClick={() => setEditingUser(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                      onClick={() => deleteUser(user.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </>
  );
}