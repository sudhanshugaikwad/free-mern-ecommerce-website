import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useDispatch } from "react-redux";
import axios from 'axios'
import { toast } from "sonner";           // Assuming you're using react-hot-toast
import { setCart } from "@/redux/productSlice";       // ← Import your action

function ProductDesc({ product }) {
    const dispatch = useDispatch()
    const accessToken = localStorage.getItem('accessToken')
    
    const [loadingCart, setLoadingCart] = useState(false)   // Added this

    const addToCart = async (productId) => {
        try {
            setLoadingCart(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/cart/add`, { productId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (res.data.success) {
                toast.success("Product added to cart!")
                dispatch(setCart(res.data.cart));
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to add to cart")
        } finally {
            setLoadingCart(false)
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <h1 className="font-bold text-2xl md:text-1xl text-gray-950 leading-tight">
                {product.productName}
            </h1>

            <p className="text-gray-600 text-sm md:text-base">
                Category: <span className="font-medium">{product.category}</span> | 
                Brand: <span className="font-medium">{product.brand}</span>
            </p>

            <h2 className="text-2xl font-semibold text-gray-900">
                ₹ {product.productPrice}
            </h2>

            <p className="text-gray-600 leading-relaxed text-[15px] md:text-base line-clamp-12">
                {product.productDesc}
            </p>

            {/* Quantity Selector - Responsive */}
            <div className="flex items-center gap-3 mt-2">
                <p className="font-medium text-gray-700 whitespace-nowrap">Quantity:</p>
                <Input 
                    type="number" 
                    defaultValue={1}
                    min={1}
                    className="w-24 text-center" 
                />
            </div>

            {/* Add to Cart Button */}
            <Button 
                onClick={() => addToCart(product._id)}
                disabled={loadingCart}
                className="mt-4 w-full sm:w-auto px-10 py-6 text-base coursor-pointer font-medium bg-black hover:bg-gray-950 active:scale-95 transition-all disabled:opacity-70"
            >
                {loadingCart ? "Adding to Cart..." : "Add To Cart"}
            </Button>
        </div>
    )
}

export default ProductDesc