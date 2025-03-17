"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LuxuryHeader from "@/components/Landing/Header"
import { client } from "@/sanity/lib/client"
import { motion } from "framer-motion"

export default function MensCollections() {
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Fetch Mens Subcategories & One Product for Profile Image
    const fetchSubcategories = async () => {
      const query = `
        *[_type == "subcategory" && parentCategory->name == "Mens"] {
          _id,
          name,
          "profileImage": *[_type == "product" && references(^._id) && images[].asset._ref != null][0].images[0]{
            asset->{
              url
            }
          }
        }
      `

      try {
        const data = await client.fetch(query)
        setSubcategories(data)
      } catch (error) {
        console.error("Error fetching subcategories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubcategories()
  }, [])

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.2 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <main className="bg-[#f9f9f7] text-[#1a1a1a] min-h-screen">
      {/* Luxury Header */}
      <LuxuryHeader />

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full h-[90vh] flex flex-col items-center justify-center text-center px-6 py-32"
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extralight tracking-[0.2em] uppercase mb-8">Mens Collections</h1>
          <div className="w-16 h-[1px] bg-black/40 mx-auto mb-8"></div>
          <p className="mt-4 text-base md:text-lg text-[#666] max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            Explore premium fashion tailored for the modern gentleman. Timeless elegance meets contemporary design.
          </p>
          <button className="mt-12 px-10 py-4 border border-black/80 text-black hover:bg-black hover:text-white transition-all duration-500 uppercase tracking-[0.15em] text-sm font-light">
            Explore Now
          </button>
        </div>
      </motion.section>

      {/* Collection Title */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 mb-6">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-[1px] flex-grow bg-black/20"></div>
          <h2 className="text-xl font-light tracking-[0.15em] uppercase text-[#333]">Collections</h2>
          <div className="h-[1px] flex-grow bg-black/20"></div>
        </div>
      </div>

      {/* Subcategory Collections Section */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-10 pb-32">
        {loading ? (
          <div className="h-[60vh] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-black/40 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-black/40 animate-pulse mx-2 delay-150"></div>
            <div className="w-3 h-3 rounded-full bg-black/40 animate-pulse delay-300"></div>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20"
          >
            {subcategories.length > 0 ? (
              subcategories.map((subcategory) => (
                <motion.div
                  key={subcategory._id}
                  variants={itemVariant}
                  className="relative group cursor-pointer overflow-hidden"
                  onClick={() => router.push(`/mens/${subcategory.name.toLowerCase()}`)}
                >
                  {/* Profile Image */}
                  {subcategory.profileImage && subcategory.profileImage.asset ? (
                    <div className="overflow-hidden">
                      <img
                        src={subcategory.profileImage.asset.url || "/placeholder.svg"}
                        alt={subcategory.name}
                        className="w-full h-[600px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-[600px] bg-[#f0f0f0] flex items-center justify-center">
                      <span className="text-[#999] font-light tracking-widest uppercase text-sm">No Image</span>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-700 ease-out" />

                  {/* Subcategory Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="h-[1px] w-12 bg-black/60 mb-4 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
                    <h3 className="text-[#1a1a1a] text-2xl font-light tracking-widest uppercase">{subcategory.name}</h3>
                    <div className="mt-3 overflow-hidden h-0 group-hover:h-6 transition-all duration-500 ease-out">
                      <span className="text-[#666] text-sm tracking-wider font-light">Discover Collection</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-[#999] font-light tracking-wider">No collections available at the moment.</p>
              </div>
            )}
          </motion.div>
        )}
      </section>
    </main>
  )
}

