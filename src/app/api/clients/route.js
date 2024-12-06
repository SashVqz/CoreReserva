import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const filePath = path.resolve(process.cwd(), "src/app/api/clients.json");

const readClients = async () => {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

const writeClients = async (data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

export async function GET() {
  const data = await readClients();
  return NextResponse.json(data.clients);
}

export async function POST(req) {
  const body = await req.json();
  const data = await readClients();

  const newClient = {
    id: Date.now(),
    ...body,
  };

  data.clients.push(newClient);
  await writeClients(data);

  return NextResponse.json(newClient, { status: 201 });
}

export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id'), 10);
  const body = await req.json();

  const data = await readClients();
  const clientIndex = data.clients.findIndex((c) => c.id === id);

  if (clientIndex === -1) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  data.clients[clientIndex] = { ...data.clients[clientIndex], ...body };
  await writeClients(data);

  return NextResponse.json(data.clients[clientIndex]);
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id'), 10);

  const data = await readClients();
  data.clients = data.clients.filter((c) => c.id !== id);

  await writeClients(data);

  return NextResponse.json({ success: true });
}