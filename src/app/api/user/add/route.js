import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { auth0Id, email, name } = await req.json();

    const user = await prisma.user.create({
      data: { auth0Id, email, name },
    });

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.error("Error adding user:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
