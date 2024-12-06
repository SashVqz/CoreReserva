"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({
    type: "particular",
    NIF_CIF: "",
    name: "",
    surname: "",
    address: "",
    deliveryAddress: "",
    phone: "",
    volumeDiscount: 0,
  });
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async () => {
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });
      if (!res.ok) throw new Error("Error creating client");
      setNewClient({
        type: "particular",
        NIF_CIF: "",
        name: "",
        surname: "",
        address: "",
        deliveryAddress: "",
        phone: "",
        volumeDiscount: 0,
      });
      setShowForm(false);
      fetchClients();
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  const updateClient = async () => {
    try {
      const res = await fetch(`/api/clients?id=${editingClient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingClient),
      });
      if (!res.ok) throw new Error("Error updating client");
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  const deleteClient = async (id) => {
    try {
      const res = await fetch(`/api/clients?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error deleting client");
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (<>
    <Navbar />
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Gestión de Clientes</h1>

      <button
        className={`w-full mb-6 py-3 px-4 rounded-lg text-white font-semibold ${
          showForm ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Ocultar Formulario" : "Crear Cliente"}
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {editingClient ? "Editar Cliente" : "Crear Cliente"}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <select
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingClient ? editingClient.type : newClient.type}
              onChange={(e) =>
                editingClient
                  ? setEditingClient({ ...editingClient, type: e.target.value })
                  : setNewClient({ ...newClient, type: e.target.value })
              }
            >
              <option value="particular">Particular</option>
              <option value="empresa">Empresa</option>
            </select>

            <input
              type="text"
              placeholder="NIF/CIF"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingClient ? editingClient.NIF_CIF : newClient.NIF_CIF}
              onChange={(e) =>
                editingClient
                  ? setEditingClient({ ...editingClient, NIF_CIF: e.target.value })
                  : setNewClient({ ...newClient, NIF_CIF: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Nombre"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingClient ? editingClient.name : newClient.name}
              onChange={(e) =>
                editingClient
                  ? setEditingClient({ ...editingClient, name: e.target.value })
                  : setNewClient({ ...newClient, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Apellidos"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingClient ? editingClient.surname : newClient.surname}
              onChange={(e) =>
                editingClient
                  ? setEditingClient({ ...editingClient, surname: e.target.value })
                  : setNewClient({ ...newClient, surname: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Dirección"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingClient ? editingClient.address : newClient.address}
              onChange={(e) =>
                editingClient
                  ? setEditingClient({ ...editingClient, address: e.target.value })
                  : setNewClient({ ...newClient, address: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Dirección de Entrega"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingClient ? editingClient.deliveryAddress : newClient.deliveryAddress}
              onChange={(e) =>
                editingClient
                  ? setEditingClient({ ...editingClient, deliveryAddress: e.target.value })
                  : setNewClient({ ...newClient, deliveryAddress: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Teléfono"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingClient ? editingClient.phone : newClient.phone}
              onChange={(e) =>
                editingClient
                  ? setEditingClient({ ...editingClient, phone: e.target.value })
                  : setNewClient({ ...newClient, phone: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Descuento por Volumen (%)"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingClient ? editingClient.volumeDiscount : newClient.volumeDiscount}
              onChange={(e) =>
                editingClient
                  ? setEditingClient({ ...editingClient, volumeDiscount: parseInt(e.target.value, 10) || 0 })
                  : setNewClient({ ...newClient, volumeDiscount: parseInt(e.target.value, 10) || 0 })
              }
            />

            <div className="flex justify-end gap-4">
              <button
                className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600"
                onClick={editingClient ? updateClient : createClient}
              >
                {editingClient ? "Actualizar" : "Crear"}
              </button>
              {editingClient && (
                <button
                  className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-500"
                  onClick={() => setEditingClient(null)}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Lista de Clientes</h2>
        {loading ? (
          <p className="text-gray-600">Cargando...</p>
        ) : (
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border px-4 py-2 text-left font-semibold">Tipo</th>
                <th className="border px-4 py-2 text-left font-semibold">NIF/CIF</th>
                <th className="border px-4 py-2 text-left font-semibold">Nombre</th>
                <th className="border px-4 py-2 text-left font-semibold">Apellidos</th>
                <th className="border px-4 py-2 text-left font-semibold">Dirección</th>
                <th className="border px-4 py-2 text-left font-semibold">Dirección de Entrega</th>
                <th className="border px-4 py-2 text-left font-semibold">Teléfono</th>
                <th className="border px-4 py-2 text-left font-semibold">Descuento (%)</th>
                <th className="border px-4 py-2 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-gray-700">{client.type}</td>
                  <td className="border px-4 py-2 text-gray-700">{client.NIF_CIF}</td>
                  <td className="border px-4 py-2 text-gray-700">{client.name}</td>
                  <td className="border px-4 py-2 text-gray-700">{client.surname}</td>
                  <td className="border px-4 py-2 text-gray-700">{client.address}</td>
                  <td className="border px-4 py-2 text-gray-700">{client.deliveryAddress}</td>
                  <td className="border px-4 py-2 text-gray-700">{client.phone}</td>
                  <td className="border px-4 py-2 text-gray-700">{client.volumeDiscount}%</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600"
                      onClick={() => setEditingClient(client)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                      onClick={() => deleteClient(client.id)}
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