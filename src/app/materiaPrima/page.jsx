"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/NavbarBodega";

export default function MateriaPrimaPage() {
  const [materiaPrima, setMateriaPrima] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMateriaPrima, setEditingMateriaPrima] = useState(null);
  const [newEntry, setNewEntry] = useState({
    fechaEntrada: "",
    cantidadKilos: "",
    origen: "",
    descripcion: "",
    detalle: { gradoMadurez: "", tipoUva: "", calidad: "" },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMateriaPrima();
  }, []);

  const fetchMateriaPrima = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/materiaPrima");
      const data = await res.json();
      setMateriaPrima(data);
    } catch (error) {
      console.error("Error fetching materia prima:", error);
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async () => {
    if (newEntry.detalle.calidad < 3 || newEntry.detalle.calidad > 5) {
      alert("La calidad debe estar entre 3 y 5.");
      return;
    }
    try {
      const res = await fetch("/api/materiaPrima", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
      if (!res.ok) throw new Error("Error creating materia prima");
      setNewEntry({
        fechaEntrada: "",
        cantidadKilos: "",
        origen: "",
        descripcion: "",
        detalle: { gradoMadurez: "", tipoUva: "", calidad: "" },
      });
      setShowForm(false);
      fetchMateriaPrima();
    } catch (error) {
      console.error("Error creating materia prima:", error);
    }
  };

  const updateMateriaPrima = async () => {
    if (editingMateriaPrima.detalle.calidad < 3 || editingMateriaPrima.detalle.calidad > 5) {
      alert("La calidad como minimo 3 sobre 5");
      return;
    }
    try {
      const res = await fetch(`/api/materiaPrima?id=${editingMateriaPrima.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMateriaPrima),
      });
      if (!res.ok) throw new Error("Error updating materia prima");
      setEditingMateriaPrima(null);
      fetchMateriaPrima();
    } catch (error) {
      console.error("Error updating materia prima:", error);
    }
  };

  const deleteEntry = async (id) => {
    try {
      const res = await fetch(`/api/materiaPrima?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error deleting materia prima");
      fetchMateriaPrima();
    } catch (error) {
      console.error("Error deleting materia prima:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Gestión de Materia Prima</h1>
  
        <button
          className={`w-full mb-6 py-3 px-4 rounded-lg text-white font-semibold ${
            showForm ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Ocultar Formulario" : "Crear Entrada"}
        </button>
  
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {editingMateriaPrima ? "Editar Materia Prima" : "Crear Materia Prima"}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Fecha de Entrada"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editingMateriaPrima ? editingMateriaPrima.fechaEntrada : newEntry.fechaEntrada}
                onChange={(e) =>
                  editingMateriaPrima
                    ? setEditingMateriaPrima({ ...editingMateriaPrima, fechaEntrada: e.target.value })
                    : setNewEntry({ ...newEntry, fechaEntrada: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Cantidad en Kilos"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editingMateriaPrima ? editingMateriaPrima.cantidadKilos : newEntry.cantidadKilos}
                onChange={(e) =>
                  editingMateriaPrima
                    ? setEditingMateriaPrima({
                        ...editingMateriaPrima,
                        cantidadKilos: parseFloat(e.target.value),
                      })
                    : setNewEntry({
                        ...newEntry,
                        cantidadKilos: parseFloat(e.target.value),
                      })
                }
              />
              <input
                type="text"
                placeholder="Origen"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editingMateriaPrima ? editingMateriaPrima.origen : newEntry.origen}
                onChange={(e) =>
                  editingMateriaPrima
                    ? setEditingMateriaPrima({ ...editingMateriaPrima, origen: e.target.value })
                    : setNewEntry({ ...newEntry, origen: e.target.value })
                }
              />
              <textarea
                placeholder="Descripción"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editingMateriaPrima ? editingMateriaPrima.descripcion : newEntry.descripcion}
                onChange={(e) =>
                  editingMateriaPrima
                    ? setEditingMateriaPrima({ ...editingMateriaPrima, descripcion: e.target.value })
                    : setNewEntry({ ...newEntry, descripcion: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Grado de Madurez"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editingMateriaPrima ? editingMateriaPrima.detalle.gradoMadurez : newEntry.detalle.gradoMadurez}
                onChange={(e) =>
                  editingMateriaPrima
                    ? setEditingMateriaPrima({
                        ...editingMateriaPrima,
                        detalle: { ...editingMateriaPrima.detalle, gradoMadurez: e.target.value },
                      })
                    : setNewEntry({
                        ...newEntry,
                        detalle: { ...newEntry.detalle, gradoMadurez: e.target.value },
                      })
                }
              />
              <input
                type="text"
                placeholder="Tipo de Uva"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editingMateriaPrima ? editingMateriaPrima.detalle.tipoUva : newEntry.detalle.tipoUva}
                onChange={(e) =>
                  editingMateriaPrima
                    ? setEditingMateriaPrima({
                        ...editingMateriaPrima,
                        detalle: { ...editingMateriaPrima.detalle, tipoUva: e.target.value },
                      })
                    : setNewEntry({
                        ...newEntry,
                        detalle: { ...newEntry.detalle, tipoUva: e.target.value },
                      })
                }
              />
              <input
                type="number"
                placeholder="Calidad (3-5)"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editingMateriaPrima ? editingMateriaPrima.detalle.calidad : newEntry.detalle.calidad}
                onChange={(e) =>
                  editingMateriaPrima
                    ? setEditingMateriaPrima({
                        ...editingMateriaPrima,
                        detalle: { ...editingMateriaPrima.detalle, calidad: parseInt(e.target.value) },
                      })
                    : setNewEntry({
                        ...newEntry,
                        detalle: { ...newEntry.detalle, calidad: parseInt(e.target.value) },
                      })
                }
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600"
                onClick={editingMateriaPrima ? updateMateriaPrima : createEntry}
              >
                {editingMateriaPrima ? "Actualizar Materia Prima" : "Crear Materia Prima"}
              </button>
              {editingMateriaPrima && (
                <button
                  className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-500"
                  onClick={() => setEditingMateriaPrima(null)}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        )}
  
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Lista de Materia Prima</h2>
          {loading ? (
            <p className="text-gray-600">Cargando...</p>
          ) : (
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border px-4 py-2 text-left">Fecha de Entrada</th>
                  <th className="border px-4 py-2 text-left">Cantidad (kg)</th>
                  <th className="border px-4 py-2 text-left">Origen</th>
                  <th className="border px-4 py-2 text-left">Descripción</th>
                  <th className="border px-4 py-2 text-left">Grado de Madurez</th>
                  <th className="border px-4 py-2 text-left">Tipo de Uva</th>
                  <th className="border px-4 py-2 text-left">Calidad</th>
                  <th className="border px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {materiaPrima.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-gray-700">{entry.fechaEntrada}</td>
                    <td className="border px-4 py-2 text-gray-700">{entry.cantidadKilos}</td>
                    <td className="border px-4 py-2 text-gray-700">{entry.origen}</td>
                    <td className="border px-4 py-2 text-gray-700">{entry.descripcion}</td>
                    <td className="border px-4 py-2 text-gray-700">{entry.detalle.gradoMadurez}</td>
                    <td className="border px-4 py-2 text-gray-700">{entry.detalle.tipoUva}</td>
                    <td className="border px-4 py-2 text-gray-700">{entry.detalle.calidad}</td>
                    <td className="border px-4 py-2 flex gap-2">
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
                        onClick={() => setEditingMateriaPrima(entry)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                        onClick={() => deleteEntry(entry.id)}
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