"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    format: "",
    harvest: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error("Error creating product");
      setNewProduct({ name: "", description: "", price: "", format: "", harvest: "" });
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const updateProduct = async () => {
    try {
      const res = await fetch(`/api/products?id=${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      if (!res.ok) throw new Error("Error updating product");
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error deleting product");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (<>
    <Navbar />
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Gestión de Productos</h1>

      <button
        className={`w-full mb-6 py-3 px-4 rounded-lg text-white font-semibold ${
          showForm ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Ocultar Formulario" : "Crear Producto"}
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {editingProduct ? "Editar Producto" : "Crear Producto"}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Nombre"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingProduct ? editingProduct.name : newProduct.name}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({ ...editingProduct, name: e.target.value })
                  : setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <textarea
              placeholder="Descripción"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingProduct ? editingProduct.description : newProduct.description}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({ ...editingProduct, description: e.target.value })
                  : setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Precio"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingProduct ? editingProduct.price : newProduct.price}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
                  : setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
              }
            />
            <input
              type="text"
              placeholder="Formato"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingProduct ? editingProduct.format : newProduct.format}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({ ...editingProduct, format: e.target.value })
                  : setNewProduct({ ...newProduct, format: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Cosecha"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editingProduct ? editingProduct.harvest : newProduct.harvest}
              onChange={(e) =>
                editingProduct
                  ? setEditingProduct({ ...editingProduct, harvest: e.target.value })
                  : setNewProduct({ ...newProduct, harvest: e.target.value })
              }
            />
            <div className="flex justify-end gap-4">
              <button
                className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600"
                onClick={editingProduct ? updateProduct : createProduct}
              >
                {editingProduct ? "Actualizar" : "Crear"}
              </button>
              {editingProduct && (
                <button
                  className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-500"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Lista de Productos</h2>
        {loading ? (
          <p className="text-gray-600">Cargando...</p>
        ) : (
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border px-4 py-2 text-left">Nombre</th>
                <th className="border px-4 py-2 text-left">Descripción</th>
                <th className="border px-4 py-2 text-left">Precio</th>
                <th className="border px-4 py-2 text-left">Formato</th>
                <th className="border px-4 py-2 text-left">Cosecha</th>
                <th className="border px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-gray-700">{product.name}</td>
                  <td className="border px-4 py-2 text-gray-700">{product.description}</td>
                  <td className="border px-4 py-2 text-gray-700">{product.price} €</td>
                  <td className="border px-4 py-2 text-gray-700">{product.format}</td>
                  <td className="border px-4 py-2 text-gray-700">{product.harvest}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600"
                      onClick={() => setEditingProduct(product)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                      onClick={() => deleteProduct(product.id)}
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