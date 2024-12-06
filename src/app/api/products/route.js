import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const filePath = path.resolve(process.cwd(), "src/app/api/products.json");

const readProducts = async () => {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

const writeProducts = async (data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

export async function GET() {
  const data = await readProducts();
  return NextResponse.json(data.products);
}

export async function POST(req) {
  const body = await req.json();
  const data = await readProducts();

  const newProduct = {
    id: Date.now(),
    ...body,
  };

  data.products.push(newProduct);
  await writeProducts(data);

  return NextResponse.json(newProduct, { status: 201 });
}

export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id'), 10);
  const body = await req.json();

  const data = await readProducts();
  const productIndex = data.products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }

  data.products[productIndex] = { ...data.products[productIndex], ...body };
  await writeProducts(data);

  return NextResponse.json(data.products[productIndex]);
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id'), 10);

  const data = await readProducts();
  data.products = data.products.filter((p) => p.id !== id);

  await writeProducts(data);

  return NextResponse.json({ success: true });
}