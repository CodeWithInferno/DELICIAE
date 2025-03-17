"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Search, ShoppingBag, User, X, LogOut, Settings, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@auth0/nextjs-auth0/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function LuxuryHeader() {
  const [activeMenu, setActiveMenu] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, error, isLoading } = useUser()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMouseEnter = (menu) => {
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

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full py-6 px-12 flex justify-between items-center z-50 transition-all duration-500",
          isScrolled ? "bg-white/90 backdrop-blur-md text-black shadow-sm" : "bg-white text-black",
        )}
      >
        <div className="text-2xl font-light tracking-[0.2em] uppercase">
          <Link href="/">DELICIAE</Link>
        </div>

        <nav className="hidden lg:flex space-x-10 text-sm tracking-wider uppercase">
          <div className="relative py-2 cursor-pointer" onMouseEnter={() => handleMouseEnter("women")}>
            <div className="flex items-center space-x-1 hover:text-gray-500 transition-colors duration-300">
              <span>Women</span>
              <ChevronDown
                className={cn("w-4 h-4 transition-transform duration-300", activeMenu === "women" && "rotate-180")}
              />
            </div>
          </div>

          <div className="relative py-2 cursor-pointer" onMouseEnter={() => handleMouseEnter("men")}>
            <div className="flex items-center space-x-1 hover:text-gray-500 transition-colors duration-300">
              <span>Men</span>
              <ChevronDown
                className={cn("w-4 h-4 transition-transform duration-300", activeMenu === "men" && "rotate-180")}
              />
            </div>
          </div>

          <div className="relative py-2 cursor-pointer" onMouseEnter={() => handleMouseEnter("collections")}>
            <div className="flex items-center space-x-1 hover:text-gray-500 transition-colors duration-300">
              <span>Collections</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-300",
                  activeMenu === "collections" && "rotate-180",
                )}
              />
            </div>
          </div>

          <div className="relative py-2 cursor-pointer" onMouseEnter={() => handleMouseLeave()}>
            <span className="hover:text-gray-500 transition-colors duration-300">About</span>
          </div>
        </nav>

        <div className="flex items-center space-x-6">
          <Search className="w-5 h-5 cursor-pointer hover:text-gray-500 transition-colors duration-300" />

          {isLoading ? (
            <div className="w-5 h-5 rounded-full animate-pulse  bg-gray-200"></div>
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
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              0
            </span>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {activeMenu && (
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
              {activeMenu === "women" && <LuxuryMegaMenu title="Women" />}
              {activeMenu === "men" && <LuxuryMegaMenu title="Men" />}
              {activeMenu === "collections" && <CollectionsMegaMenu />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-24"></div>
    </>
  )
}

function LuxuryMegaMenu({ title }) {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl font-light tracking-wider uppercase mb-12 border-b border-gray-200 pb-4"
      >
        {title}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-lg font-light tracking-wider uppercase border-b border-gray-200 pb-2">Categories</h3>
          <ul className="space-y-4 text-sm text-gray-700">
            <li className="hover:text-black transition-colors duration-300 group">
              <Link href="#" className="group-hover:pl-2 transition-all duration-300 flex items-center">
                New Arrivals
                <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <ChevronDown className="w-4 h-4 rotate-270 ml-1" />
                </span>
              </Link>
            </li>
            <li className="hover:text-black transition-colors duration-300 group">
              <Link href="#" className="group-hover:pl-2 transition-all duration-300 flex items-center">
                Exclusive Pieces
                <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <ChevronDown className="w-4 h-4 rotate-270 ml-1" />
                </span>
              </Link>
            </li>
            <li className="hover:text-black transition-colors duration-300 group">
              <Link href="#" className="group-hover:pl-2 transition-all duration-300 flex items-center">
                Limited Edition
                <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <ChevronDown className="w-4 h-4 rotate-270 ml-1" />
                </span>
              </Link>
            </li>
            <li className="hover:text-black transition-colors duration-300 group">
              <Link href="#" className="group-hover:pl-2 transition-all duration-300 flex items-center">
                Signature Collection
                <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <ChevronDown className="w-4 h-4 rotate-270 ml-1" />
                </span>
              </Link>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <h3 className="text-lg font-light tracking-wider uppercase border-b border-gray-200 pb-2">Accessories</h3>
          <ul className="space-y-4 text-sm text-gray-700">
            <li className="hover:text-black transition-colors duration-300 group">
              <Link href="#" className="group-hover:pl-2 transition-all duration-300 flex items-center">
                Handbags
                <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <ChevronDown className="w-4 h-4 rotate-270 ml-1" />
                </span>
              </Link>
            </li>
            <li className="hover:text-black transition-colors duration-300 group">
              <Link href="#" className="group-hover:pl-2 transition-all duration-300 flex items-center">
                Fine Jewelry
                <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <ChevronDown className="w-4 h-4 rotate-270 ml-1" />
                </span>
              </Link>
            </li>
            <li className="hover:text-black transition-colors duration-300 group">
              <Link href="#" className="group-hover:pl-2 transition-all duration-300 flex items-center">
                Footwear
                <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <ChevronDown className="w-4 h-4 rotate-270 ml-1" />
                </span>
              </Link>
            </li>
            <li className="hover:text-black transition-colors duration-300 group">
              <Link href="#" className="group-hover:pl-2 transition-all duration-300 flex items-center">
                Timepieces
                <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <ChevronDown className="w-4 h-4 rotate-270 ml-1" />
                </span>
              </Link>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="col-span-1 md:col-span-2 space-y-6"
        >
          <h3 className="text-lg font-light tracking-wider uppercase border-b border-gray-200 pb-2">Featured</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative overflow-hidden group">
                <Image
                  src="/placeholder.png"
                  alt="Luxury item"
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
              <h4 className="text-sm font-medium">Signature Silk Dress</h4>
              <p className="text-sm text-gray-500">$12,500</p>
            </div>
            <div className="space-y-4">
              <div className="relative overflow-hidden group">
                <Image
                  src="/placeholder.png"
                  alt="Luxury item"
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
              <h4 className="text-sm font-medium">Artisan Crafted Handbag</h4>
              <p className="text-sm text-gray-500">$18,900</p>
            </div>
          </div>
        </motion.div>
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

