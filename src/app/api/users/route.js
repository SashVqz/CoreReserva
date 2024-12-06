import fs from "fs";
import path from "path";

const filePath = path.resolve(process.cwd(), "src/app/api/users.json");

function readJson() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function writeJson(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const database = readJson();
  return new Response(JSON.stringify(database.users), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  const body = await req.json();
  const database = readJson();
  const newUser = { id: Date.now(), ...body };
  database.users.push(newUser);
  writeJson(database);

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(req) {
  const body = await req.json();
  const { id, ...updates } = body;
  const database = readJson();
  const userIndex = database.users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  database.users[userIndex] = { ...database.users[userIndex], ...updates };
  writeJson(database);

  return new Response(JSON.stringify(database.users[userIndex]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"), 10);
  const database = readJson();

  database.users = database.users.filter((user) => user.id !== id);
  writeJson(database);

  return new Response(JSON.stringify({ message: "User deleted" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}