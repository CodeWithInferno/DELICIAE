"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LuxuryHeader from "@/components/Landing/Header";
import ProductZoom from "@/components/productpage/productzoom";
import { client } from "@/sanity/lib/client";
import { motion } from "framer-motion";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null); // ✅ Add this line

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      const productQuery = `
      *[_type == "product" && slug.current == $slug][0]{
        _id,
        title,
        description,
        price,
        "images": images[].asset->url,
        "category": categories[]->name,
        "subcategory": subcategories[]->name,
        variants[]{
          color,
          sizes[]{size, stock},
          "images": images[].asset->url
        },
        details,
        materials,
        origin
      }
    `;

      try {
        const data = await client.fetch(productQuery, { slug });
        setProduct(data);
        if (data?.variants?.length > 0) {
          setSelectedVariant(data.variants[0]);
          setSelectedColor(data.variants[0].color);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-[#666] text-sm tracking-wider uppercase">
          Loading product details...
        </span>
      </div>
    );

  if (!product)
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-[#666] text-sm tracking-wider uppercase">
          Product not found.
        </span>
      </div>
    );

  // Get the current images to display based on selected variant
  const currentImages =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images
      : product.images;

  return (
    <main className="bg-[#faf8f3] text-[#1a1a1a] min-h-screen">
      {/* Header */}
      <LuxuryHeader />

      {/* Back button */}
      <div className="max-w-screen-xl mx-auto px-6 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-[#666] hover:text-black transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="ml-1">Back</span>
        </button>
      </div>

      {/* Product section */}
      <section className="max-w-screen-xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-[120px_1fr_400px] gap-8 md:gap-12"
        >
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col gap-4 order-1">
            {currentImages?.map((url, idx) => (
              <div
                key={idx}
                className={`border cursor-pointer ${selectedImage === idx ? "border-black" : "border-transparent"}`}
                onClick={() => setSelectedImage(idx)}
              >
                <img
                  src={url || "/placeholder.svg"}
                  alt={`${product.title} thumbnail ${idx + 1}`}
                  className="w-full h-24 object-cover"
                />
              </div>
            ))}
          </div>

          {/* Main image with zoom functionality */}
          <div className="order-2">
            {currentImages && currentImages.length > 0 && (
              <ProductZoom
                images={currentImages}
                initialImage={selectedImage}
                alt={product.title}
              />
            )}
          </div>

          {/* Product details */}
          <div className="order-3">
            <div className="mb-12">
              <h1 className="font-light tracking-widest uppercase text-xl mb-2">
                {product.title}
              </h1>
              <p className="text-lg mb-8">
                $
                {product.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>

              {/* Color selection */}
              {product.variants?.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="uppercase text-sm tracking-widest">Color</h2>
                    <span className="text-sm">
                      {selectedColor || "Select Color"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {product.variants.map((variant, idx) => (
                      <button
                        key={idx}
                        className={`w-16 h-16 border ${
                          selectedColor === variant.color
                            ? "border-black"
                            : "border-[#e5e5e5]"
                        }`}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setSelectedColor(variant.color);
                          setSelectedImage(0);
                        }}
                      >
                        {variant.images && variant.images.length > 0 ? (
                          <img
                            src={variant.images[0] || "/placeholder.svg"}
                            alt={variant.color}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{
                              backgroundColor: variant.color.toLowerCase(),
                            }}
                          ></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selection */}
              {selectedVariant && selectedVariant.sizes.length > 0 && (
                <div className="mb-8">
                  <div className="uppercase text-sm tracking-widest mb-2">
                    Size
                  </div>
                  <div className="flex gap-2">
                    {selectedVariant.sizes.map((variantSize, idx) => (
                      <button
                        key={idx}
                        className={`px-4 py-2 border ${selectedSize === variantSize.size ? "border-black" : "border-[#e5e5e5]"} ${variantSize.stock === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        disabled={variantSize.stock === 0}
                        onClick={() => setSelectedSize(variantSize.size)}
                      >
                        {variantSize.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to cart button */}
              <div className="mb-4">
                <button className="w-full bg-[#1a1a1a] text-white py-3 uppercase text-sm tracking-widest flex items-center justify-center gap-2">
                  <ShoppingBag size={16} />
                  Add to cart
                </button>
              </div>

              {/* Product description */}
              <div className="text-sm mb-8">
                <div className="space-y-2">
                  <PortableText
                    value={product.description}
                    components={{
                      block: {
                        normal: ({ children }) => (
                          <p className="leading-relaxed mb-2">{children}</p>
                        ),
                      },
                    }}
                  />
                </div>
                {product.materials && (
                  <p className="mb-2">{product.materials}</p>
                )}
                {product.details && <p className="mb-2">{product.details}</p>}
              </div>

              {/* Origin */}
              {product.origin && (
                <p className="text-sm mb-8">Made in {product.origin}</p>
              )}

              {/* Care instructions */}
              <div>
                <button className="w-full py-3 border-t border-b border-[#e5e5e5] flex justify-between items-center">
                  <span className="uppercase text-sm tracking-widest">
                    Care
                  </span>
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
