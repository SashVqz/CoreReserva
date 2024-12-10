import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const ordersPath = path.resolve(process.cwd(), "src/app/api/orders.json");
const clientsPath = path.resolve(process.cwd(), "src/app/api/clients.json");
const productsPath = path.resolve(process.cwd(), "src/app/api/products.json");

const readJSON = async (filePath) => {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

const writeJSON = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

export async function GET() {
  try {
    const ordersData = await readJSON(ordersPath);
    return NextResponse.json(ordersData.orders);
  } catch (error) {
    console.error("Error reading orders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en el backend:", body);

    const ordersData = await readJSON(ordersPath);
    const clientsData = await readJSON(clientsPath);
    const productsData = await readJSON(productsPath);

    const clientId = Number(body.clientId);

    const client = clientsData.clients.find((c) => c.id === clientId);
    if (!client) {
      console.error(`Cliente con ID ${clientId} no encontrado`);
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    console.log(`Cliente encontrado: ${client.name}, Descuento de volumen: ${client.volumeDiscount}%`);

    const orderDetails = body.products.map((product) => {
      const catalogProduct = productsData.products.find((p) => String(p.id) === String(product.productId));
      if (!catalogProduct) {
        throw new Error(`Producto con ID ${product.productId} no encontrado`);
      }

      const productPrice = catalogProduct.price;
      const subtotal = product.quantity * productPrice;

      console.log(`Producto encontrado: ${catalogProduct.name}, Subtotal: ${subtotal}`);

      return {
        productId: product.productId,
        productName: catalogProduct.name,
        quantity: product.quantity,
        productPrice,
        subtotal: subtotal.toFixed(2),
      };
    });

    const totalPrice = orderDetails.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    const discount = (client.volumeDiscount / 100) * totalPrice;
    const totalPriceAfterDiscount = totalPrice - discount;

    const totalPriceWithIVA = totalPriceAfterDiscount * 1.21; // IVA del 21%

    console.log(`Total sin descuento: ${totalPrice}, Descuento: ${discount}, Total con descuento: ${totalPriceAfterDiscount}, Total con IVA: ${totalPriceWithIVA}`);

    const newOrder = {
      id: Date.now(),
      clientId: clientId,
      status: 'pending',
      totalPrice: totalPrice.toFixed(2),
      discount: discount.toFixed(2),
      totalPriceAfterDiscount: totalPriceAfterDiscount.toFixed(2),
      totalPriceWithIVA: totalPriceWithIVA.toFixed(2),
      details: orderDetails,
    };

    ordersData.orders.push(newOrder);
    await writeJSON(ordersPath, ordersData);

    console.log("Nueva orden creada:", newOrder);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creando la orden:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id'), 10);
    const body = await req.json();

    const ordersData = await readJSON(ordersPath);
    const orderIndex = ordersData.orders.findIndex((o) => o.id === id);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    ordersData.orders[orderIndex].status = body.status;
    await writeJSON(ordersPath, ordersData);

    return NextResponse.json(ordersData.orders[orderIndex]);
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id'), 10);

    const ordersData = await readJSON(ordersPath);
    const orderIndex = ordersData.orders.findIndex((o) => o.id === id);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    ordersData.orders.splice(orderIndex, 1);
    await writeJSON(ordersPath, ordersData);

    return NextResponse.json({ message: 'Orden eliminada' });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}