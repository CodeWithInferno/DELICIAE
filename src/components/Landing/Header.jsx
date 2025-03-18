"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Search, ShoppingBag, User, X, LogOut, Settings, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@auth0/nextjs-auth0/client"
import { createClient } from "next-sanity"
import imageUrlBuilder from "@sanity/image-url"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Create Sanity client outside component to prevent recreation on each render
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-05-03",
  useCdn: true,
})

// Initialize the image URL builder
const builder = imageUrlBuilder(client)

// Helper function to get image URL from Sanity
const urlFor = (source) => {
  return builder.image(source)
}

// Default navigation items for loading state
const defaultNavItems = [
  { title: "Women", hasMegaMenu: true },
  { title: "Men", hasMegaMenu: true },
  { title: "Collections", hasMegaMenu: true },
  { title: "About", hasMegaMenu: false },
]

export default function LuxuryHeader({ headerData = null }) {
  const [activeMenu, setActiveMenu] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, error, isLoading: authLoading } = useUser()
  const [header, setHeader] = useState(headerData)
  const [isLoading, setIsLoading] = useState(!headerData)

  useEffect(() => {
    // Fetch header data if not provided as prop
    if (!headerData) {
      const fetchHeaderData = async () => {
        try {
          setIsLoading(true)
          const data = await client.fetch(`*[_type == "header"][0]`)
          setHeader(data)
        } catch (error) {
          console.error("Error fetching header data:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchHeaderData()
    }
  }, [headerData])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMouseEnter = (menu) => {
    if (isLoading) return
    setActiveMenu(menu)
  }

  const handleMouseLeave = () => {
    setActiveMenu(null)
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.name) return "U"
    return user.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Helper function to get image URL from Sanity
  const getImageUrl = (image) => {
    if (!image || !image.asset) return null
    return urlFor(image).url()
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full py-6 px-12 flex justify-between items-center z-50 transition-all duration-500",
          isScrolled ? "bg-white/90 backdrop-blur-md text-black shadow-sm" : "bg-white text-black",
        )}
      >
        <div className="text-2xl font-light tracking-[0.2em] uppercase">
          <Link href="/">
            {!isLoading && header?.logoImage && header.logoImage.asset ? (
              <Image
                src={getImageUrl(header.logoImage) || "/placeholder.svg"}
                alt={header?.logoText || "DELICIAE"}
                width={150}
                height={40}
                className="object-contain"
              />
            ) : (
              header?.logoText || "DELICIAE"
            )}
          </Link>
        </div>

        <nav className="hidden lg:flex space-x-10 text-sm tracking-wider uppercase">
          {isLoading
            ? // Loading state for navigation
              defaultNavItems.map((item, index) => (
                <div key={index} className="relative py-2 cursor-default">
                  <div className="flex items-center space-x-1 text-gray-400">
                    <span className="opacity-70">{item.title}</span>
                    {item.hasMegaMenu && <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              ))
            : // Actual navigation items
              header?.navItems &&
              header.navItems.map((item, index) => (
                <div
                  key={index}
                  className="relative py-2 cursor-pointer"
                  onMouseEnter={() => (item.hasMegaMenu ? handleMouseEnter(item.title) : handleMouseLeave())}
                >
                  <Link href={item.slugLink || "#"}>
                    <div className="flex items-center space-x-1 hover:text-gray-500 transition-colors duration-300">
                      <span>{item.title}</span>
                      {item.hasMegaMenu && (
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform duration-300",
                            activeMenu === item.title && "rotate-180",
                          )}
                        />
                      )}
                    </div>
                  </Link>
                </div>
              ))}
        </nav>

        <div className="flex items-center space-x-6">
          <Search className="w-5 h-5 cursor-pointer hover:text-gray-500 transition-colors duration-300" />

          {authLoading ? (
            <div className="w-5 h-5 rounded-full animate-pulse bg-gray-200"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="w-8 h-8 border border-gray-200 hover:border-gray-300 transition-colors duration-300">
                    <AvatarImage src={user.picture} alt={user.name || "User"} />
                    <AvatarFallback className="bg-black text-white text-xs">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium text-black">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-black">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>Cart</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-black">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" asChild>
                  <Link href="/api/auth/logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/api/auth/login">
              <User className="w-5 h-5 cursor-pointer hover:text-gray-500 transition-colors duration-300" />
            </Link>
          )}

          <div className="relative">
            <ShoppingBag className="w-5 h-5 cursor-pointer hover:text-gray-500 transition-colors duration-300" />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {activeMenu && header?.navItems && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-40"
            onMouseLeave={handleMouseLeave}
          >
            <div className="absolute top-6 right-12 z-50">
              <button
                onClick={handleMouseLeave}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="h-full overflow-auto pt-24 pb-16 px-12">
              {header.navItems.map(
                (item, index) =>
                  activeMenu === item.title &&
                  item.hasMegaMenu && <LuxuryMegaMenu key={index} title={item.title} megaMenu={item.megaMenu} />,
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-24"></div>
    </>
  )
}

function LuxuryMegaMenu({ title, megaMenu }) {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch featured products if they exist in the megaMenu
    if (megaMenu && megaMenu.featuredProducts && megaMenu.featuredProducts.length > 0) {
      const fetchProducts = async () => {
        try {
          setIsLoading(true)
          // Create a GROQ query to fetch the referenced products
          const productIds = megaMenu.featuredProducts.map((ref) => ref._ref).join('","')
          const query = `*[_type == "product" && _id in ["${productIds}"]]`
          const products = await client.fetch(query)
          setFeaturedProducts(products)
        } catch (error) {
          console.error("Error fetching featured products:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchProducts()
    } else {
      setIsLoading(false)
    }
  }, [megaMenu])

  // Helper function to get image URL from Sanity
  const getImageUrl = (image) => {
    if (!image || !image.asset) return "/placeholder.png"
    return urlFor(image).url()
  }

  if (!megaMenu) return null

  return (
    <div className="max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl font-light tracking-wider uppercase mb-12 border-b border-gray-200 pb-4"
      >
        {megaMenu.megaMenuTitle || title}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {megaMenu.categories && megaMenu.categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-light tracking-wider uppercase border-b border-gray-200 pb-2">Categories</h3>
            <ul className="space-y-4 text-sm text-gray-700">
              {megaMenu.categories.map((category, index) => (
                <li key={index} className="hover:text-black transition-colors duration-300 group">
                  <Link
                    href={category.slugLink || "#"}
                    className="group-hover:pl-2 transition-all duration-300 flex items-center"
                  >
                    {category.title}
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                      <ChevronDown className="w-4 h-4 rotate-270 ml-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {megaMenu.accessories && megaMenu.accessories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-light tracking-wider uppercase border-b border-gray-200 pb-2">Accessories</h3>
            <ul className="space-y-4 text-sm text-gray-700">
              {megaMenu.accessories.map((accessory, index) => (
                <li key={index} className="hover:text-black transition-colors duration-300 group">
                  <Link
                    href={accessory.slugLink || "#"}
                    className="group-hover:pl-2 transition-all duration-300 flex items-center"
                  >
                    {accessory.title}
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                      <ChevronDown className="w-4 h-4 rotate-270 ml-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {featuredProducts && featuredProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-1 md:col-span-2 space-y-6"
          >
            <h3 className="text-lg font-light tracking-wider uppercase border-b border-gray-200 pb-2">Featured</h3>
            <div className="grid grid-cols-2 gap-6">
              {featuredProducts.slice(0, 2).map((product, index) => (
                <div key={index} className="space-y-4">
                  <div className="relative overflow-hidden group">
                    <Image
                      src={
                        product.images && product.images.length > 0
                          ? getImageUrl(product.images[0])
                          : product.image
                            ? getImageUrl(product.image)
                            : "/placeholder.png"
                      }
                      alt={product.title || "Luxury item"}
                      width={300}
                      height={400}
                      className="object-cover w-full h-[400px] group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <Button
                        variant="outline"
                        className="bg-white text-black hover:bg-black hover:text-white border-white"
                      >
                        Discover
                      </Button>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium">{product.title || "Luxury Product"}</h4>
                  <p className="text-sm text-gray-500">${product.price ? product.price.toLocaleString() : "N/A"}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ) : isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-1 md:col-span-2 space-y-6"
          >
            <h3 className="text-lg font-light tracking-wider uppercase border-b border-gray-200 pb-2">Featured</h3>
            <div className="grid grid-cols-2 gap-6">
              {[0, 1].map((index) => (
                <div key={index} className="space-y-4">
                  <div className="relative overflow-hidden bg-gray-100 animate-pulse w-full h-[400px]"></div>
                  <div className="h-4 bg-gray-100 animate-pulse rounded w-2/3"></div>
                  <div className="h-4 bg-gray-100 animate-pulse rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}

function CollectionsMegaMenu() {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl font-light tracking-wider uppercase mb-12 border-b border-gray-200 pb-4"
      >
        Collections
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Spring/Summer 2025",
            image: "/placeholder.png",
          },
          {
            title: "Artisan Series",
            image: "/placeholder.png",
          },
          {
            title: "Heritage Collection",
            image: "/placeholder.png",
          },
        ].map((collection, index) => (
          <motion.div
            key={collection.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="relative overflow-hidden mb-4">
              <Image
                src={collection.image || "/placeholder.png"}
                alt={collection.title}
                width={400}
                height={600}
                className="object-cover w-full h-[500px] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-start p-8">
                <Button variant="outline" className="bg-white text-black hover:bg-black hover:text-white border-white">
                  Explore Collection
                </Button>
              </div>
            </div>
            <h3 className="text-xl font-light tracking-wider">{collection.title}</h3>
            <p className="text-sm text-gray-500 mt-2">
              Discover the essence of luxury with our meticulously crafted pieces.
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

