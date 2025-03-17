import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request) {
  try {
    // 1. Parse the request body
    const {
      userEmail,  // Received from the client
      productId,
      title,
      variant,
      size,
      price,
      quantity,
    } = await request.json();

    // 2. Basic check: if we have no email, return 401
    if (!userEmail) {
      return new NextResponse("Unauthorized (no user email)", { status: 401 });
    }

    // 3. Find or create the user in your DB
    let dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: userEmail,
          // Add additional fields here if needed
        },
      });
    }

    // 4. Find or create a Cart for this user
    let cart = await prisma.cart.findUnique({
      where: { userId: dbUser.id },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: dbUser.id,
        },
        include: { items: true },
      });
    }

    // 5. Check if CartItem already exists (matching product, variant, size)
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variant,
        size,
      },
    });

    let cartItem;
    if (existingCartItem) {
      // If found, increment quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + (quantity || 1),
        },
      });
    } else {
      // Otherwise, create a new item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          title,
          variant,
          size,
          price,
          quantity: quantity || 1,
        },
      });
    }

    // 6. Return the newly upserted item
    return NextResponse.json({ cartItem }, { status: 201 });
    
  } catch (error) {
    console.error("Error adding to cart:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
