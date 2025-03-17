"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Hero() {
  const [isLeftHovered, setIsLeftHovered] = useState(false)
  const [isRightHovered, setIsRightHovered] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionTarget, setTransitionTarget] = useState("")
  const leftVideoRef = useRef(null)
  const rightVideoRef = useRef(null)
  const router = useRouter()

  // Handle left video play/pause based on hover state
  useEffect(() => {
    if (!leftVideoRef.current) return

    if (isLeftHovered) {
      leftVideoRef.current.play()
    } else {
      leftVideoRef.current.pause()
    }
  }, [isLeftHovered])

  // Handle right video play/pause based on hover state
  useEffect(() => {
    if (!rightVideoRef.current) return

    if (isRightHovered) {
      rightVideoRef.current.play()
    } else {
      rightVideoRef.current.pause()
    }
  }, [isRightHovered])

  // Handle transition and navigation
  useEffect(() => {
    if (isTransitioning && transitionTarget) {
      const timer = setTimeout(() => {
        router.push(transitionTarget)
      }, 800) // Wait for animation to complete before redirecting

      return () => clearTimeout(timer)
    }
  }, [isTransitioning, transitionTarget, router])

  const handleNavigation = (path) => {
    setIsTransitioning(true)
    setTransitionTarget(path)
  }

  return (
    <section className="flex w-full h-screen overflow-hidden relative">
      {/* Transition Overlay */}
      <div
        className={`fixed inset-0 bg-white z-50 transition-opacity duration-800 ease-in-out pointer-events-none ${
          isTransitioning ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDuration: "800ms",
          visibility: isTransitioning ? "visible" : "hidden",
        }}
      />

      {/* Left Box (Video) */}
      <div
        className="w-1/2 h-full relative overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsLeftHovered(true)}
        onMouseLeave={() => setIsLeftHovered(false)}
        onClick={() => handleNavigation("/womens")}
      >
        <div
          className={`absolute inset-0 transition-transform duration-700 ease-out ${isLeftHovered ? "scale-105" : "scale-100"}`}
        >
          <video ref={leftVideoRef} className="w-full h-full object-cover" muted loop playsInline preload="auto">
            <source src="/LeftHero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Elegant overlay that appears on hover */}
        <div
          className={`absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-500 ${
            isLeftHovered ? "opacity-100" : ""
          }`}
        />

        {/* Optional: Add subtle text on the left side */}
        <div
          className={`absolute bottom-10 left-10 text-white transition-all duration-500 ease-out transform ${
            isLeftHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <h2 className="text-2xl font-light tracking-wider">WOMENS</h2>
        </div>
      </div>

      {/* Right Box (Video) */}
      <div
        className="w-1/2 h-full relative overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsRightHovered(true)}
        onMouseLeave={() => setIsRightHovered(false)}
        onClick={() => handleNavigation("/mens")}
      >
        <div
          className={`absolute inset-0 transition-transform duration-700 ease-out ${isRightHovered ? "scale-105" : "scale-100"}`}
        >
          <video ref={rightVideoRef} className="w-full h-full object-cover" muted loop playsInline preload="auto">
            <source src="/RightHero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Elegant overlay that appears on hover */}
        <div
          className={`absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-500 ${
            isRightHovered ? "opacity-100" : ""
          }`}
        />

        {/* Optional: Add subtle text on the right side */}
        <div
          className={`absolute bottom-10 right-10 text-white transition-all duration-500 ease-out transform ${
            isRightHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <h2 className="text-2xl font-light tracking-wider">MENS</h2>
        </div>
      </div>

      {/* Centered Brand Name */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          {/* Decorative line above */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-px h-6 bg-white/70"></div>

          {/* Brand name with elegant styling */}
          <h1 className="text-white text-6xl font-extralight tracking-[0.3em] uppercase relative">
            <span className="relative">
              DELICIAE
              <span className="absolute -bottom-2 left-0 w-full h-px bg-white/40"></span>
            </span>
          </h1>

          {/* Decorative line below */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-px h-6 bg-white/70"></div>
        </div>
      </div>
    </section>
  )
}

