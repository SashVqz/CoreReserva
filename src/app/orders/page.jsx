"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import Navbar from "../components/Navbar";

export default function OrdersPage() {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    clientId: "",
    products: [],
  });
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const clientsRes = await fetch("/api/clients");
      const productsRes = await fetch("/api/products");
      const ordersRes = await fetch("/api/orders");

      if (!clientsRes.ok || !productsRes.ok || !ordersRes.ok) {
        throw new Error("Error fetching data from API");
      }

      setClients(await clientsRes.json());
      setProducts(await productsRes.json());
      setOrders(await ordersRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addProductToOrder = () => {
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      products: [...prevOrder.products, { productId: "", quantity: 1 }],
    }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...newOrder.products];
    updatedProducts[index][field] = value;
    setNewOrder({ ...newOrder, products: updatedProducts });
  };

  const removeProductFromOrder = (index) => {
    const updatedProducts = [...newOrder.products];
    updatedProducts.splice(index, 1);
    setNewOrder({ ...newOrder, products: updatedProducts });
  };

  const createOrder = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!res.ok) throw new Error("Error creating order");

      setNewOrder({ clientId: "", products: [] });
      setShowForm(false);
      fetchInitialData();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/orders?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Error updating order status");

      fetchInitialData();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      const res = await fetch(`/api/orders?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error deleting order");

      fetchInitialData();
      alert("Orden eliminada correctamente.");
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const createInvoice = (order) => {
    try {
      if (!order) {
        console.error("Error: La orden no está definida");
        alert("Error: No se pudo generar la factura porque la orden no está disponible.");
        return;
      }
  
      if (!order.details || order.details.length === 0) {
        console.error("Error: La orden no tiene detalles de productos.");
        alert("Error: No hay productos en la orden.");
        return;
      }
  
      const client = clients.find((c) => c.id === order.clientId) || { name: "Cliente desconocido" };
  
      console.log("Datos de la orden:", order);
      console.log("Datos del cliente:", client);
  
      const doc = new jsPDF();
  
      doc.setFontSize(16);
      doc.text("Factura", 10, 10);
      doc.setFontSize(12);
      doc.text(`Cliente: ${client.name}`, 10, 20);
      doc.text(`ID Cliente: ${order.clientId}`, 10, 30);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 40);
  
      let yPosition = 50;
      doc.text("Productos:", 10, yPosition);
      yPosition += 10;
  
      doc.setFontSize(10);
      doc.text("Cant.", 10, yPosition);
      doc.text("Producto", 30, yPosition);
      doc.text("Precio", 100, yPosition);
      doc.text("Subtotal", 160, yPosition);
      yPosition += 5;
  
      order.details.forEach((item) => {
        if (!item.productName || typeof item.productPrice !== "number" || typeof item.quantity !== "number") {
          console.error("Producto con datos incompletos o inválidos:", item);
          return;
        }
  
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 10;
        }
  
        doc.text(`${item.quantity}`, 10, yPosition);
        doc.text(item.productName, 30, yPosition);
        doc.text(`$${item.productPrice.toFixed(2)}`, 100, yPosition);
        doc.text(`$${parseFloat(item.subtotal).toFixed(2)}`, 160, yPosition);
        yPosition += 10;
      });
  
      yPosition += 10;
  
      if (typeof parseFloat(order.totalPrice) !== "number" || typeof parseFloat(order.totalPriceWithIVA) !== "number") {
        console.error("Error: Los totales de la orden no son válidos.", order);
        alert("Error: No se puede generar la factura debido a totales inválidos.");
        return;
      }
  
      doc.setFontSize(12);
      doc.text(`Total sin descuento: $${parseFloat(order.totalPrice).toFixed(2)}`, 10, yPosition);
      yPosition += 10;
      doc.text(`Descuento aplicado: $${parseFloat(order.discount).toFixed(2)}`, 10, yPosition);
      yPosition += 10;
      doc.text(`Total después del descuento: $${parseFloat(order.totalPriceAfterDiscount).toFixed(2)}`, 10, yPosition);
      yPosition += 10;
      doc.text(`Total con IVA: $${parseFloat(order.totalPriceWithIVA).toFixed(2)}`, 10, yPosition);
  
      doc.save(`Factura_${order.id || "sin_id"}.pdf`);
      alert("Factura creada y guardada en la carpeta de descargas.");
  
    } catch (error) {
      console.error("Error al generar la factura:", error.message, error.stack);
      alert("Hubo un error al generar la factura.");
    }
  };

  const filteredOrders = orders.filter((order) => order.status === statusFilter);

  return (<>
    <Navbar />
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Gestión de Órdenes</h1>

      <div className="flex justify-center gap-4 mb-8">
        {["pending", "completed", "canceled"].map((status) => (
          <button
            key={status}
            className={`py-2 px-6 rounded-lg font-semibold text-lg ${
              statusFilter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setStatusFilter(status)}
          >
            {status === "pending" ? "Pendientes" : status === "completed" ? "Completadas" : "Canceladas"}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <button
          className={`w-full mb-6 py-2 px-4 rounded-lg text-white font-bold ${
            showForm ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cerrar Formulario" : "Crear Nueva Orden"}
        </button>

        {showForm && (
          <div className="mb-8">
            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-700 mb-2">Cliente</label>
              <select
                className="w-full p-3 border rounded-lg"
                value={newOrder.clientId}
                onChange={(e) => setNewOrder({ ...newOrder, clientId: e.target.value })}
              >
                <option value="">Seleccione un cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos</h3>
            {newOrder.products.map((product, index) => (
              <div key={index} className="flex items-center gap-2 mb-4">
                <select
                  className="flex-1 p-3 border rounded-lg"
                  value={product.productId}
                  onChange={(e) => handleProductChange(index, "productId", e.target.value)}
                >
                  <option value="">Seleccione un producto</option>
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} - ${prod.price}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Cantidad"
                  className="w-20 p-3 border rounded-lg"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, "quantity", parseInt(e.target.value, 10))}
                />
                <button
                  className="bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600"
                  onClick={() => removeProductFromOrder(index)}
                >
                  Eliminar
                </button>
              </div>
            ))}

            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full mb-4"
              onClick={addProductToOrder}
            >
              Añadir Producto
            </button>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                onClick={createOrder}
              >
                Crear Orden
              </button>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Órdenes {statusFilter}</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : filteredOrders.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border px-4 py-2 text-left">Cliente</th>
                <th className="border px-4 py-2 text-left">Total (IVA)</th>
                <th className="border px-4 py-2 text-left">Estado y Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const client = clients.find((c) => c.id === order.clientId) || {};
                return (
                  <tr key={order.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{client.name || "Desconocido"}</td>
                    <td className="border px-4 py-2">${order.totalPriceWithIVA}</td>
                    <td className="border px-4 py-2 flex items-center gap-4">
                      <span className="capitalize">{order.status}</span>
                      {order.status === "pending" && (
                        <>
                          <button
                            className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600"
                            onClick={() => updateOrderStatus(order.id, "completed")}
                          >
                            Completar
                          </button>
                          <button
                            className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                            onClick={() => updateOrderStatus(order.id, "canceled")}
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                      {order.status === "completed" && (
                        <button
                          className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
                          onClick={() => createInvoice(order)}
                        >
                          Imprimir Factura
                        </button>
                      )}
                      {order.status === "canceled" && (
                        <button
                          className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                          onClick={() => deleteOrder(order.id)}
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No hay órdenes {statusFilter}.</p>
        )}
      </div>
    </div>
    </>
  );
}