import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getSession(req, res);
  if (!session?.user) return res.status(401).end();

  const user = await prisma.user.findUnique({
    where: { auth0Id: session.user.sub },
    include: { cart: { include: { items: true } } },
  });

  if (!user || !user.cart) return res.json({ items: [] });

  res.json(user.cart.items);
}
