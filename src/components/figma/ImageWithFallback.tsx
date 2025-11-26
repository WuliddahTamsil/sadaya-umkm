import React, { useState, useEffect } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setDidError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const { src, alt, style, className, ...rest } = props

  // Clean and decode URL if needed
  const cleanSrc = src ? decodeURIComponent(src.replace(/&amp;/g, '&')) : src

  // Merge default HD image styles with provided styles
  const defaultHDStyles = {
    imageRendering: 'high-quality' as any,
    ...style
  };

  // Reset error state when src changes
  useEffect(() => {
    setDidError(false)
    setIsLoading(true)
  }, [src])

  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={defaultHDStyles}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src={ERROR_IMG_SRC} 
            alt="Error loading image" 
            {...rest} 
            data-original-url={cleanSrc}
            style={{ imageRendering: 'high-quality' }}
          />
        </div>
      </div>
    )
  }

  if (!cleanSrc) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={defaultHDStyles}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src={ERROR_IMG_SRC} 
            alt="No image" 
            {...rest} 
            style={{ imageRendering: 'high-quality' }}
          />
        </div>
      </div>
    )
  }

  return (
    <img 
      src={cleanSrc} 
      alt={alt} 
      className={className} 
      style={defaultHDStyles} 
      {...rest} 
      onError={handleError}
      onLoad={handleLoad}
    />
  )
}
