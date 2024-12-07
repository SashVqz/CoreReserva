import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const filePath = path.resolve(process.cwd(), "src/app/api/materiaPrima.json");

const readData = async () => {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

const writeData = async (data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

export async function GET() {
  const data = await readData();
  return NextResponse.json(data.materiaPrima);
}

export async function POST(req) {
  const body = await req.json();
  const data = await readData();

  const newEntry = {
    id: Date.now(),
    fechaEntrada: body.fechaEntrada || new Date().toISOString(),
    cantidadKilos: body.cantidadKilos || 0,
    origen: body.origen || "Desconocido",
    descripcion: body.descripcion || "Sin descripción",
    detalle: body.detalle || {}, // Ej. { gradoMadurez, tipoUva, calidad }
  };

  data.materiaPrima.push(newEntry);
  await writeData(data);

  return NextResponse.json(newEntry, { status: 201 });
}

export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id'), 10);
  const body = await req.json();

  const data = await readData();
  const index = data.materiaPrima.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Materia prima no encontrada' }, { status: 404 });
  }

  data.materiaPrima[index] = { ...data.materiaPrima[index], ...body };
  await writeData(data);

  return NextResponse.json(data.materiaPrima[index]);
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id'), 10);

  const data = await readData();
  data.materiaPrima = data.materiaPrima.filter((item) => item.id !== id);

  await writeData(data);

  return NextResponse.json({ success: true });
}