"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/NavbarBodega";

export default function MateriaPrimaPage() {
  const [materiaPrima, setMateriaPrima] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(null); // Para manejar los detalles
  const [editingMateriaPrima, setEditingMateriaPrima] = useState(null); // Para manejar edición de materia prima
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

  const updateDetails = async () => {
    try {
      const res = await fetch(`/api/materiaPrima?id=${showDetails.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(showDetails),
      });
      if (!res.ok) throw new Error("Error updating details");
      setShowDetails(null);
      fetchMateriaPrima();
    } catch (error) {
      console.error("Error updating details:", error);
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

  const getColorByQuality = (quality) => {
    if (quality < 3) return "text-red-500";
    if (quality <= 7) return "text-yellow-500";
    return "text-green-500";
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
                    <td className="border px-4 py-2 flex gap-2">
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
                        onClick={() => setEditingMateriaPrima(entry)}
                      >
                        Editar Materia Prima
                      </button>
                      <button
                        className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600"
                        onClick={() => setShowDetails(entry)}
                      >
                        Ver/Editar Detalles
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

        {showDetails && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">Detalles de la Uva</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Grado de Madurez"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={showDetails.detalle.gradoMadurez}
                onChange={(e) =>
                  setShowDetails({
                    ...showDetails,
                    detalle: { ...showDetails.detalle, gradoMadurez: e.target.value },
                  })
                }
              />
              <input
                type="text"
                placeholder="Tipo de Uva"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={showDetails.detalle.tipoUva}
                onChange={(e) =>
                  setShowDetails({
                    ...showDetails,
                    detalle: { ...showDetails.detalle, tipoUva: e.target.value },
                  })
                }
              />
              <input
                type="number"
                placeholder="Calidad (1-10)"
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${getColorByQuality(
                  showDetails.detalle.calidad
                )}`}
                value={showDetails.detalle.calidad}
                onChange={(e) =>
                  setShowDetails({
                    ...showDetails,
                    detalle: { ...showDetails.detalle, calidad: parseInt(e.target.value) },
                  })
                }
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                onClick={updateDetails}
              >
                Guardar Cambios
              </button>
              <button
                className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
                onClick={() => setShowDetails(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}