// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import LuxuryHeader from "@/components/Landing/Header";
// import { client } from "@/sanity/lib/client";
// import { motion } from "framer-motion";

// export default function CollectionPage() {
//   const { collection } = useParams();
//   const [products, setProducts] = useState([]);
//   const [collectionTitle, setCollectionTitle] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!collection) return;

//     const fetchProductsAndTitle = async () => {
//       const subcategoryQuery = `*[_type == "subcategory" && slug.current == $collection][0]{_id, name}`;
//       const subcategory = await client.fetch(subcategoryQuery, { collection });

//       if (!subcategory) {
//         setProducts([]);
//         setCollectionTitle(collection.replace("-", " "));
//         setLoading(false);
//         return;
//       }

//       setCollectionTitle(subcategory.name);

//       const productsQuery = `
//         *[_type == "product" && references($subcategoryId)]{
//           _id,
//           title,
//           price,
//           "imageUrl": images[0].asset->url,
//           slug,
//           "category": categories[]->name,
//           "subcategory": subcategories[]->name
//         }
//       `;

//       try {
//         const data = await client.fetch(productsQuery, { subcategoryId: subcategory._id });
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductsAndTitle();
//   }, [collection]);

//   const fadeIn = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { duration: 1.2 } },
//   };

//   return (
//     <main className="bg-[#f9f9f7] text-[#1a1a1a] min-h-screen">
//       <LuxuryHeader />

//       <motion.section
//         initial="hidden"
//         animate="visible"
//         variants={fadeIn}
//         className="w-full h-[60vh] flex flex-col items-center justify-center text-center px-6"
//       >
//         <h1 className="text-5xl md:text-7xl font-extralight tracking-[0.2em] uppercase mb-4">
//           {collectionTitle}
//         </h1>
//         <p className="text-lg text-[#666] font-light">
//           Discover timeless pieces from our {collectionTitle} collection.
//         </p>
//       </motion.section>

//       <section className="max-w-screen-xl mx-auto px-6 md:px-10 pb-32">
//         {loading ? (
//           <div className="h-[50vh] flex items-center justify-center">
//             <span className="text-[#999] text-lg">Loading products...</span>
//           </div>
//         ) : products.length > 0 ? (
//           <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={fadeIn}
//             className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14"
//           >
//             {products.map((product) => (
//               <motion.div
//                 key={product._id}
//                 className="relative group cursor-pointer overflow-hidden"
//                 whileHover={{ scale: 1.03 }}
//               >
//                 {product.imageUrl ? (
//                   <img
//                     src={product.imageUrl}
//                     alt={product.title}
//                     className="w-full h-[500px] object-cover transition-transform duration-500 ease-out group-hover:scale-105"
//                   />
//                 ) : (
//                   <div className="w-full h-[500px] bg-[#f0f0f0] flex items-center justify-center">
//                     <span className="text-[#999] font-light uppercase">No Image</span>
//                   </div>
//                 )}

//                 <div className="absolute bottom-6 left-6">
//                   <h3 className="text-2xl font-light tracking-wide">{product.title}</h3>
//                   <p className="text-lg text-[#666] mt-1">${product.price.toFixed(2)}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : (
//           <div className="text-center py-20">
//             <p className="text-[#999] font-light tracking-wider">
//               No products found in this collection.
//             </p>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }



"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import LuxuryHeader from "@/components/Landing/Header"
import { client } from "@/sanity/lib/client"
import { motion } from "framer-motion"
import Link from "next/link"

export default function CollectionPage() {
  const { collection } = useParams()
  const [products, setProducts] = useState([])
  const [collectionTitle, setCollectionTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [bannerVideo, setBannerVideo] = useState(null)

  useEffect(() => {
    if (!collection) return

    const fetchCollectionData = async () => {
      const subcategoryQuery = `
        *[_type == "subcategory" && slug.current == $collection][0]{
          _id,
          name,
          "bannerVideo": *[_type=="banner" && linkedSubcategory._ref==^._id][0].video.asset->url
        }
      `

      const subcategory = await client.fetch(subcategoryQuery, { collection })

      if (!subcategory) {
        setProducts([])
        setCollectionTitle(collection.replace(/-/g, " "))
        setLoading(false)
        return
      }

      setCollectionTitle(subcategory.name)
      setBannerVideo(subcategory.bannerVideo)

      const productsQuery = `
        *[_type == "product" && references($subcategoryId)]{
          _id,
          title,
          price,
          "imageUrl": images[0].asset->url,
          "hoverImageUrl": images[1].asset->url,
          slug,
          "category": categories[]->name,
          "subcategory": subcategories[]->name
        }
      `

      try {
        const data = await client.fetch(productsQuery, { subcategoryId: subcategory._id })
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollectionData()
  }, [collection])

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5, ease: "easeOut" } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <main className="bg-white text-[#1a1a1a] min-h-screen">
      <LuxuryHeader />

      {/* Banner Section */}
      <div className="relative w-full h-[90vh] overflow-hidden">
        {bannerVideo ? (
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={bannerVideo} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[#f5f5f5]" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white"
        >
          <h1 className="text-5xl md:text-7xl font-extralight tracking-[0.2em] uppercase mb-6">{collectionTitle}</h1>
          <div className="w-24 h-[1px] bg-white/70 my-6"></div>
          <p className="text-lg font-light tracking-widest max-w-xl mx-auto">
            Discover the essence of timeless elegance in our curated {collectionTitle} collection.
          </p>
        </motion.div>
      </div>

      {/* Collection Description */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="max-w-3xl mx-auto text-center py-20 px-6"
      >
        <h2 className="text-2xl font-light tracking-widest uppercase mb-8">The Collection</h2>
        <p className="text-[#666] leading-relaxed font-light">
          Each piece in our {collectionTitle} collection embodies the perfect balance of craftsmanship and design.
          Created with exceptional materials and meticulous attention to detail, these timeless creations reflect our
          commitment to excellence and the art of luxury.
        </p>
      </motion.div>

      {/* Products Section */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-10 pb-32">
        {loading ? (
          <div className="h-[50vh] flex items-center justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-t-2 border-r-2 border-[#d4d4d4] rounded-full animate-spin"></div>
            </div>
          </div>
        ) : products.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20"
          >
            {products.map((product) => (
              <motion.div key={product._id} variants={itemVariant} className="group">
                <Link href={`/product/${product.slug?.current || product._id}`}>
                  <div className="relative overflow-hidden mb-6 aspect-[3/4]">
                    {product.imageUrl ? (
                      <>
                        <img
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
                        />
                        <img
                          src={product.hoverImageUrl || product.imageUrl}
                          alt={`${product.title} - Alternate View`}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full bg-[#f0f0f0] flex items-center justify-center">
                        <span className="text-[#999] font-light uppercase tracking-widest">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-light tracking-wider mb-2">{product.title}</h3>
                    <p className="text-[#666] font-light">
                      $
                      {typeof product.price === "number"
                        ? product.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : product.price}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-32">
            <p className="text-[#999] font-light tracking-wider uppercase">No products found in this collection.</p>
            <Link href="/collections" className="inline-block mt-8 border-b border-black pb-1 text-sm tracking-wider">
              Discover Other Collections
            </Link>
          </div>
        )}
      </section>

      {/* Footer Banner */}
      <div className="w-full h-[40vh] bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center max-w-xl px-6">
          <h3 className="text-2xl font-light tracking-widest uppercase mb-6">Craftsmanship</h3>
          <p className="text-[#666] leading-relaxed font-light mb-8">
            Each piece is meticulously crafted by our artisans, embodying our heritage of excellence.
          </p>
          <Link
            href="/about"
            className="inline-block border border-black px-10 py-3 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300"
          >
            Our Story
          </Link>
        </div>
      </div>
    </main>
  )
}

