"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductZoom({ images, initialImage, alt }) {
  const [isOpen, setIsOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState(initialImage || 0);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const sliderKnobRef = useRef(null);
  
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  
  // Handle opening the modal
  const openZoomModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };
  
  // Handle closing the modal
  const closeZoomModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };
  
  // Handle mouse movement for panning when zoomed in
  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      const { clientX, clientY } = e;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      
      // Calculate relative position within container (0 to 1)
      const relativeX = (clientX - left) / width;
      const relativeY = (clientY - top) / height;
      
      // Calculate new position based on zoom level
      const newX = Math.max(Math.min(0, (1 - zoomLevel) * width * relativeX), (1 - zoomLevel) * width);
      const newY = Math.max(Math.min(0, (1 - zoomLevel) * height * relativeY), (1 - zoomLevel) * height);
      
      setPosition({ x: newX, y: newY });
    }
    
    // Update cursor position for the custom cursor
    if (containerRef.current) {
      const { left, top } = containerRef.current.getBoundingClientRect();
      setCursorPosition({ 
        x: e.clientX - left, 
        y: e.clientY - top 
      });
    }
  };
  
  // Handle zoom level changes via the slider
  const handleZoomChange = (e) => {
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const sliderHeight = sliderRect.height;
    const clickY = e.clientY - sliderRect.top;
    
    // Calculate zoom level based on click position (inverted: top = max, bottom = min)
    const newZoomLevel = MAX_ZOOM - (clickY / sliderHeight) * (MAX_ZOOM - MIN_ZOOM);
    setZoomLevel(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoomLevel)));
    
    // Update knob position
    updateKnobPosition(newZoomLevel);
  };
  
  // Update the knob position based on zoom level
  const updateKnobPosition = (zoom) => {
    if (sliderKnobRef.current && sliderRef.current) {
      const sliderHeight = sliderRef.current.getBoundingClientRect().height;
      const percentage = (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM);
      const knobPosition = (1 - percentage) * sliderHeight;
      sliderKnobRef.current.style.top = `${knobPosition}px`;
    }
  };
  
  // Handle direct zoom in/out button clicks
  const handleZoomIn = () => {
    const newZoom = Math.min(MAX_ZOOM, zoomLevel + 0.5);
    setZoomLevel(newZoom);
    updateKnobPosition(newZoom);
  };
  
  const handleZoomOut = () => {
    const newZoom = Math.max(MIN_ZOOM, zoomLevel - 0.5);
    setZoomLevel(newZoom);
    updateKnobPosition(newZoom);
  };
  
  // Handle click to zoom at specific point
  const handleZoomClick = (e) => {
    if (zoomLevel < MAX_ZOOM) {
      const { clientX, clientY } = e;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      
      // Calculate relative position within container (0 to 1)
      const relativeX = (clientX - left) / width;
      const relativeY = (clientY - top) / height;
      
      // Increase zoom level
      const newZoom = Math.min(MAX_ZOOM, zoomLevel + 0.5);
      setZoomLevel(newZoom);
      updateKnobPosition(newZoom);
      
      // Set position to zoom in on clicked area
      const newX = (0.5 - relativeX) * width * (newZoom - 1) / newZoom;
      const newY = (0.5 - relativeY) * height * (newZoom - 1) / newZoom;
      
      setPosition({ x: newX, y: newY });
    }
  };
  
  // Navigate to previous image
  const prevImage = () => {
    if (images && images.length > 1) {
      setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      resetZoom();
    }
  };
  
  // Navigate to next image
  const nextImage = () => {
    if (images && images.length > 1) {
      setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      resetZoom();
    }
  };
  
  // Reset zoom and position
  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    updateKnobPosition(1);
  };
  
  // Select a specific image from thumbnails
  const selectImage = (index) => {
    setSelectedImage(index);
    resetZoom();
  };
  
  // Update knob position when zoom level changes
  useEffect(() => {
    updateKnobPosition(zoomLevel);
  }, [zoomLevel]);
  
  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeZoomModal();
      } else if (e.key === "ArrowLeft" && isOpen) {
        prevImage();
      } else if (e.key === "ArrowRight" && isOpen) {
        nextImage();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);
  
  // Update selected image when initialImage prop changes
  useEffect(() => {
    if (initialImage !== undefined) {
      setSelectedImage(initialImage);
    }
  }, [initialImage]);
  
  // Ensure we have an array of images
  const imageArray = Array.isArray(images) ? images : [images].filter(Boolean);
  const currentImage = imageArray[selectedImage] || "/placeholder.svg";
  
  return (
    <>
      {/* Product image with custom cursor */}
      <div 
        className="relative w-full h-full cursor-none"
        onClick={openZoomModal}
        onMouseMove={(e) => {
          const { left, top } = e.currentTarget.getBoundingClientRect();
          setCursorPosition({ 
            x: e.clientX - left, 
            y: e.clientY - top 
          });
        }}
      >
        <img 
          src={currentImage || "/placeholder.svg"} 
          alt={alt} 
          className="w-full h-full object-contain"
        />
        
        {/* Custom cursor */}
        <div 
          className="absolute pointer-events-none w-10 h-10 border border-black rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-30"
          style={{ 
            left: `${cursorPosition.x}px`, 
            top: `${cursorPosition.y}px`,
            opacity: cursorPosition.x ? 1 : 0
          }}
        >
          <Plus size={16} strokeWidth={1.5} />
        </div>
      </div>
      
      {/* Zoom Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#faf8f3] flex items-center justify-center">
          <button 
            className="absolute top-6 right-6 z-10"
            onClick={closeZoomModal}
          >
            <X size={24} strokeWidth={1} />
          </button>
          
          {/* Image gallery navigation */}
          {imageArray.length > 1 && (
            <div className="absolute left-6 top-1/2 -translate-y-1/2 h-[80vh] flex flex-col justify-between">
              {/* Thumbnails */}
              <div className="flex flex-col gap-4 items-center max-h-[60vh] overflow-y-auto py-4 px-2">
                {imageArray.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`w-16 h-16 border cursor-pointer ${selectedImage === idx ? 'border-black' : 'border-[#e5e5e5]'}`}
                    onClick={() => selectImage(idx)}
                  >
                    <img 
                      src={img || "/placeholder.svg"} 
                      alt={`${alt} thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              {/* Navigation arrows */}
              <div className="flex flex-col gap-4 items-center mt-4">
                <button 
                  className="w-10 h-10 rounded-full border border-black flex items-center justify-center"
                  onClick={prevImage}
                >
                  <ChevronLeft size={16} strokeWidth={1.5} />
                </button>
                <button 
                  className="w-10 h-10 rounded-full border border-black flex items-center justify-center"
                  onClick={nextImage}
                >
                  <ChevronRight size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )}
          
          {/* Image container */}
          <div 
            ref={containerRef}
            className="relative w-full h-full max-w-[70vw] max-h-[80vh] overflow-hidden cursor-none"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onClick={handleZoomClick}
          >
            <div
              ref={imageRef}
              className="relative w-full h-full flex items-center justify-center"
            >
              <img 
                src={currentImage || "/placeholder.svg"} 
                alt={alt} 
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{ 
                  transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                  transformOrigin: 'center'
                }}
              />
              
              {/* Custom cursor in modal */}
              <div 
                className="absolute pointer-events-none w-10 h-10 border border-black rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-30"
                style={{ 
                  left: `${cursorPosition.x}px`, 
                  top: `${cursorPosition.y}px`,
                  opacity: cursorPosition.x ? 1 : 0
                }}
              >
                <Plus size={16} strokeWidth={1} />
              </div>
            </div>
          </div>
          
          {/* Zoom control slider */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 h-64 flex flex-col items-center">
            {/* Zoom in button */}
            <button 
              className="w-10 h-10 rounded-full border border-black flex items-center justify-center mb-2"
              onClick={handleZoomIn}
            >
              <Plus size={16} strokeWidth={1.5} />
            </button>
            
            {/* Slider track */}
            <div 
              ref={sliderRef}
              className="w-0.5 h-40 bg-black relative my-2"
              onClick={handleZoomChange}
            >
              {/* Slider knob */}
              <div 
                ref={sliderKnobRef}
                className="absolute w-4 h-4 rounded-full border border-black bg-white -translate-x-1/2 -translate-y-1/2 left-1/2"
                style={{ top: '50%' }}
              ></div>
            </div>
            
            {/* Zoom out button */}
            <button 
              className="w-10 h-10 rounded-full border border-black flex items-center justify-center mt-2"
              onClick={handleZoomOut}
            >
              <Minus size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
