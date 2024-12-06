import fs from "fs";
import path from "path";

const filePath = path.resolve(process.cwd(), "src/app/api/users.json");

function readJson() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error.message);
    throw new Error("Unable to read the database file.");
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;
    const database = readJson();

    const user = database.users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      return new Response(
        JSON.stringify({ role: user.role, name: user.name }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(JSON.stringify({ message: "Invalid email or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Internal server error:", error.message);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}