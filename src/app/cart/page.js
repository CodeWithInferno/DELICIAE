"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function DeliciaeCart() {
  const [cartItems, setCartItems] = useState([]);
  const { user, isLoading: authLoading } = useUser(); // From Auth0
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showRemoveNotification, setShowRemoveNotification] = useState(false);
  const [removedItem, setRemovedItem] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // If Auth is still loading, do nothing
    if (authLoading) return;

    // If user is not logged in, you could redirect or do something else
    if (!user) {
      router.push("/api/auth/login");
      return;
    }

    // Otherwise, fetch the cart from /api/cart/fetch
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user.email }),
        });
        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json(); // an array of cart items
        console.log("Fetched cart data:", data); // Log the entire cart array
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false); // stop spinner once done
      }
    };

    fetchCart();
  }, [authLoading, user, router]);

  const updateQuantity = async (cartItemId, newQuantity) => {
    // 1) Ensure quantity >= 1
    if (newQuantity < 1) return;

    try {
      // 2) Call the /api/cart/edit endpoint
      const res = await fetch("/api/cart/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user?.email,
          action: "update",
          cartItemId,
          newQuantity,
        }),
      });
      if (!res.ok) throw new Error("Failed to update item");

      // 3) Refetch the cart from the server to get updated data
      await refetchCart();
    } catch (err) {
      console.error("Error updating cart item:", err);
    }
  };

  const refetchCart = async () => {
    try {
      const res = await fetch("/api/cart/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user?.email }),
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error refetching cart:", error);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      // 1) Call the /api/cart/edit endpoint
      const res = await fetch("/api/cart/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user?.email,
          action: "remove",
          cartItemId,
        }),
      });
      if (!res.ok) throw new Error("Failed to remove item");

      // 2) Show notification for the removed item
      const itemToRemove = cartItems.find((item) => item.id === cartItemId);
      setRemovedItem(itemToRemove);
      setShowRemoveNotification(true);
      setTimeout(() => setShowRemoveNotification(false), 3000);

      // 3) Refetch the cart so local state matches DB
      await refetchCart();
    } catch (err) {
      console.error("Error removing cart item:", err);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 0; // Complimentary shipping
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="text-3xl font-serif tracking-widest text-stone-800">
            DELICIAE
          </div>
          <div className="mt-8 w-8 h-8 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-6 bg-white border-b border-stone-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif tracking-widest text-stone-900">
              DELICIAE
            </h1>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif tracking-widest text-stone-800">
            YOUR SELECTIONS
          </h2>
          <div className="mt-2 text-stone-500 text-sm tracking-wider">
            Items in your shopping bag will be reserved for 30 minutes
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20 bg-white border border-stone-100"
              >
                <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-stone-300" />
                <p className="text-lg text-stone-500 font-serif tracking-wider">
                  Your shopping bag is empty
                </p>
                <Button
                  asChild
                  className="mt-8 bg-stone-900 hover:bg-stone-800 text-white tracking-wider font-serif py-6 px-8"
                >
                  <Link href="/">EXPLORE THE COLLECTION</Link>
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col sm:flex-row gap-8 p-8 bg-white border border-stone-100"
                    >
                      <div className="flex-shrink-0 overflow-hidden">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Image
                            src={item.images?.[0] || "/placeholder.png"}
                            alt={item.title || "Cart item"}
                            width={150}
                            height={150}
                            className="object-cover bg-stone-100"
                          />
                        </motion.div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-xl tracking-wider text-stone-800">
                            {item.title}
                          </h3>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => removeItem(item.id)}
                            className="text-stone-400 hover:text-stone-600"
                            aria-label="Remove item"
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        </div>
                        <div className="mt-3 text-sm text-stone-500 tracking-wider">
                          <p>Color: {item.variant}</p>
                          <p>Size: {item.size}</p>
                        </div>
                        <div className="mt-auto flex justify-between items-center pt-6">
                          <div className="flex items-center border border-stone-700">
                            <motion.button
                              whileHover={{ backgroundColor: "#f9f9f8" }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-4 py-2"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3 text-stone-700" />
                            </motion.button>
                            <span className="px-4 py-2 min-w-[40px] text-stone-700 text-center font-serif">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ backgroundColor: "#f9f9f8" }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-4 py-2"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3 text-stone-700" />
                            </motion.button>
                          </div>
                          <p className="font-serif text-lg text-stone-700 tracking-wider">
                            ${item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-8 border border-stone-100 sticky top-6"
            >
              <h2 className="font-serif text-2xl mb-8 tracking-wider text-stone-800">
                ORDER SUMMARY
              </h2>
              <div className="space-y-5 text-sm tracking-wider">
                <div className="flex justify-between">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="font-serif text-stone-900">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Shipping</span>
                  <span className="italic text-stone-600">
                    {shipping === 0
                      ? "Complimentary"
                      : `$${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Estimated Tax</span>
                  <span className="font-serif text-stone-900">
                    ${tax.toLocaleString()}
                  </span>
                </div>

                <Separator className="my-6 bg-stone-200" />

                <div className="flex justify-between font-medium text-base">
                  <span className="text-stone-800 font-serif">Total</span>
                  <span className="text-stone-800 font-serif text-xl">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <Button className="w-full mt-8 bg-stone-900 hover:bg-stone-800 text-white py-6 font-serif tracking-widest">
                  PROCEED TO CHECKOUT
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
              + {/* Continue Shopping Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <Button
                  asChild
                  className="w-full bg-stone-50 border border-stone-700 text-stone-700 py-6 font-serif tracking-widest hover:bg-stone-100"
                >
                  <Link href="/">CONTINUE SHOPPING</Link>
                </Button>
              </motion.div>
              <div className="mt-12 space-y-6">
                <div>
                  <h3 className="font-serif text-sm tracking-wider text-stone-800 mb-3">
                    WE ACCEPT
                  </h3>
                  <div className="flex text-stone-700 gap-3">
                    {["Visa", "Mastercard", "More"].map((method) => (
                      <motion.div
                        key={method}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                        className="w-14 h-10 bg-white border border-stone-200 flex items-center justify-center text-xs font-serif tracking-wider"
                      >
                        {method.substring(0, 4)}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-sm tracking-wider text-stone-800 mb-3">
                    CUSTOMER CARE
                  </h3>
                  <p className="text-sm text-stone-600 tracking-wider">
                    For personal assistance, please contact our Client Services
                  </p>
                  <p className="text-sm font-serif text-stone-700 tracking-wider mt-2">
                    +1 800 DELICIAE
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-sm tracking-wider text-stone-800 mb-3">
                    SECURE SHOPPING
                  </h3>
                  <p className="text-xs text-stone-500 tracking-wider">
                    All transactions are secured and encrypted for your
                    protection
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Notification */}
      <AnimatePresence>
        {showRemoveNotification && removedItem && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 bg-white border border-stone-200 shadow-lg p-4 w-80"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <div className="w-12 h-12 relative overflow-hidden bg-stone-100">
                  +{" "}
                  <Image
                    src={removedItem.images?.[0] || "/placeholder.svg"}
                    alt={removedItem.title || "Removed item"}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-serif tracking-wider">
                  {removedItem.name}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Item removed from your bag
                </p>
                <button className="text-xs text-stone-800 underline mt-2 tracking-wider font-serif">
                  UNDO
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-stone-900 text-white py-12 mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-serif tracking-widest mb-3">
              DELICIAE
            </h2>
            <p className="text-stone-400 text-sm tracking-wider">
              HANDCRAFTED LUXURY SINCE 1987
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
