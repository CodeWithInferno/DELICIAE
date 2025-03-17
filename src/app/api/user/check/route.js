import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return new Response(JSON.stringify({ message: "User exists" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
