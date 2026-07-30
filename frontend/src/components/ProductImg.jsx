import React, { useState, useEffect } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

function ProductImg({ images = [] }) {     // Default empty array
    const [mainImg, setMainImg] = useState(null)

    // Safely set initial image when images are available
    useEffect(() => {
        if (images.length > 0 && !mainImg) {
            setMainImg(images[0].url)
        }
    }, [images, mainImg])

    // Show loading or placeholder while images are not ready
    if (images.length === 0) {
        return (
            <div className="w-full h-[400px] bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
                <span className="text-gray-500">Loading images...</span>
            </div>
        )
    }

    return (
        <div className="flex gap-6">
            {/* Thumbnails */}
            <div className="flex flex-col gap-4">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img.url}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-20 h-20 rounded-lg cursor-pointer border-2 transition-all
                            ${mainImg === img.url ? 'border-black scale-105' : 'border-gray-200 hover:border-gray-400'}`}
                        onClick={() => setMainImg(img.url)}
                    />
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-1">
                <Zoom>

               
                <img
                    src={mainImg}
                    alt="Product main view"
                    className="w-full max-h-[500px] object-contain rounded-2xl shadow-md"
                />
                 </Zoom>
             
            </div>
        </div>
    )
}

export default ProductImg