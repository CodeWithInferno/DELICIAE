import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { client as sanityClient } from "@/sanity/lib/client"; // or wherever your Sanity client is

export async function POST(request) {
  try {
    // 1. Parse userEmail from the request body
    const { userEmail } = await request.json();
    if (!userEmail) {
      return NextResponse.json({ error: "No user email" }, { status: 401 });
    }

    // 2. Find user
    const dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        cart: {
          include: {
            items: true, // get CartItems
          },
        },
      },
    });

    if (!dbUser || !dbUser.cart) {
      // If no cart, return empty array
      return NextResponse.json([], { status: 200 });
    }

    const cartItems = dbUser.cart.items; // all items in cart

    // 3. OPTIONAL: Gather product IDs for a single Sanity query
    const productIds = cartItems.map((item) => item.productId);
    const sanityQuery = `*[_type == "product" && _id in $ids]{
      _id,
      "images": images[].asset->url
      // any other fields you might want to fetch
    }`;
    const sanityProducts = await sanityClient.fetch(sanityQuery, {
      ids: productIds,
    });

    // 4. Build a map of { [productId]: productData } for quick lookup
    const productMap = {};
    sanityProducts.forEach((prod) => {
      productMap[prod._id] = prod;
    });

    // 5. Merge each cart item with the relevant data from Sanity
    const mergedCartItems = cartItems.map((item) => {
      const matchedProduct = productMap[item.productId] || {};
      return {
        ...item,
        images: matchedProduct.images || [], // e.g. from Sanity
      };
    });

    return NextResponse.json(mergedCartItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
