import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { userEmail, action, cartItemId, newQuantity } = await request.json();

    // 1. Basic auth check
    if (!userEmail) {
      return NextResponse.json(
        { error: "No user email provided" },
        { status: 401 }
      );
    }

    // 2. Find user
    const dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        cart: {
          include: { items: true },
        },
      },
    });
    if (!dbUser || !dbUser.cart) {
      return NextResponse.json(
        { error: "No cart found for this user" },
        { status: 404 }
      );
    }

    // 3. Find the item in the cart
    const cartItem = dbUser.cart.items.find((item) => item.id === cartItemId);
    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // 4. Handle "update" or "remove" action
    let updatedItem = null;

    if (action === "update") {
      // newQuantity must be >= 1
      if (newQuantity < 1) {
        return NextResponse.json(
          { error: "Invalid quantity" },
          { status: 400 }
        );
      }

      updatedItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: newQuantity,
        },
      });
    } else if (action === "remove") {
      // remove the item
      await prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // 5. Return success response
    // If the item was removed, updatedItem will be null
    return NextResponse.json(
      { success: true, updatedItem },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error editing cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
