import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getSession(req, res);
  if (!session?.user) return res.status(401).end();

  const { productId, quantity } = req.body;
  const user = await prisma.user.findUnique({ where: { auth0Id: session.user.sub } });

  if (!user) return res.status(404).json({ error: "User not found" });

  let cart = await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: { increment: quantity } },
    create: { cartId: cart.id, productId, quantity },
  });

  res.json({ message: "Added to cart" });
}
