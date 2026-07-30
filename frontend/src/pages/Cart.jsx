import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@base-ui/react';
import { Input } from '@base-ui/react';
import { Separator } from '@/components/ui/separator';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { setCart } from '@/redux/productSlice';

function Cart() {
    const { cart } = useSelector(store => store.product);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const accessToken = localStorage.getItem("accessToken");
    const API_BASE = "http://localhost:8000/api/v1/cart";

    // Calculate totals
    const subTotal = cart?.items?.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0) || 0;

    const shipping = subTotal > 299 ? 0 : 10;
    const tax = subTotal * 0.05;
    const total = subTotal + shipping + tax;

    const handleUpdateQuantity = async (productId, type) => {
        try {
            const res = await axios.put(`${API_BASE}/update`, 
                { 
                    productId, 
                    type: type.toLowerCase()   // "increase" or "decrease"
                }, 
                { 
                    headers: { Authorization: `Bearer ${accessToken}` } 
                }
            );

            if (res.data.success) {
                dispatch(setCart(res.data.cart));
                toast.success(`Quantity ${type}d successfully`);
            }
        } catch (error) {
            console.error(error.response?.data);
            toast.error(error.response?.data?.message || "Failed to update quantity");
        }
    };

    // const handleRemove = async (productId) => {
    //     try {
    //         const res = await axios.delete(`${API_BASE}/remove`, {
    //             data: { productId },  // DELETE request body
    //             headers: { Authorization: `Bearer ${accessToken}` }
    //         });

    //         if (res.data.success) {
    //             dispatch(setCart(res.data.cart));
    //             toast.success("Product removed from cart!");
    //         }
    //     } catch (error) {
    //         console.error(error.response?.data);
    //         toast.error(error.response?.data?.message || "Failed to remove product");
    //     }
    // };

    const handleRemove = async (productId) => {
    if (!productId) return;

    try {
        const res = await axios.delete(`${API_BASE}/remove/${productId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Product removed from cart!");
        }
    } catch (error) {
        console.error(error.response?.data);
        toast.error(error.response?.data?.message || "Failed to remove product");
    }
    };


    // Empty Cart
    if (!cart || cart.items?.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-5">
                <ShoppingCart size={80} className="text-gray-300 mb-6" />
                <h2 className="text-3xl font-semibold text-gray-700 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <Button onClick={() => navigate('/products')} className="mt-8 p-3 text-lg text-white bg-black hover:bg-gray-950 cursor-pointer">
                    Start Shopping
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 py-8 md:py-10">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <ShoppingCart size={32} />
                Your Cart ({cart.items.length} items)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                   
                {cart.items.map((item) => {
                        const key = item._id || item.productId?._id || item.productId; // More robust key

                        return (
                            <div 
                                key={key}   // ← Improved key
                                className="flex flex-col sm:flex-row gap-4 bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all"
                            >
                                {/* Image */}
                                <div className="w-24 h-24 shrink-0">
                                    <img
                                        src={item.productId?.productImg?.[0]?.url || '/placeholder.jpg'}
                                        alt={item.productId?.productName || 'Product'}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-lg leading-tight line-clamp-2">
                                        {item.productId?.productName || 'Unknown Product'}
                                    </h3>
                                    <p className="text-gray-600 mt-1">₹ {item.price}</p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2">
                                    <Button 
                                        onClick={() => handleUpdateQuantity(item.productId?._id || item.productId, 'decrease')}
                                        variant="outline" 
                                        size="icon" 
                                        className="h-9 w-9 cursor-pointer"
                                    >
                                        <Minus size={18} />
                                    </Button>

                                    <span className="font-semibold w-10 text-center text-lg">
                                        {item.quantity}
                                    </span>

                                    <Button 
                                        onClick={() => handleUpdateQuantity(item.productId?._id || item.productId, 'increase')}
                                        variant="outline" 
                                        size="icon" 
                                        className="h-9 w-9 cursor-pointer"
                                    >
                                        <Plus size={18} />
                                    </Button>
                                </div>

                                {/* Price & Remove */}
                                <div className="flex flex-col items-end gap-3 sm:gap-4 w-full sm:w-auto">
                                    <p className="font-bold text-xl whitespace-nowrap">
                                        ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                                    </p>
                                    <Button 
                                        onClick={() => handleRemove(item.productId?._id || item.productId)}
                                        variant="ghost" 
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                    >
                                        <Trash2 size={20} />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}

                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6">
                        <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                        
                        <div className="space-y-4 text-lg">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹ {subTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className={shipping === 0 ? "text-green-600" : ""}>
                                    {shipping === 0 ? "Free" : `₹${shipping}`}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax (5%)</span>
                                <span>₹ {tax.toFixed(2)}</span>
                            </div>

                            <Separator />
                            
                            <div className="flex justify-between font-bold text-2xl">
                                <span>Total</span>
                                <span>₹ {Math.round(total).toLocaleString('en-IN')}</span>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Input placeholder="Promo Code" />
                                <Button variant="outline">Apply</Button>
                            </div>
                        </div>

                        <Button onClick={()=>navigate('/address')} className="w-full mt-8 py-6 text-lg text-white bg-black hover:bg-gray-950 cursor-pointer">
                            PLACE ORDER
                        </Button>

                        <Button variant="outline" className="w-full mt-3 py-6 text-lg">
                            <Link to="/products">Continue Shopping</Link>
                        </Button>
                        <p className='text-gray-500'>*Free shippin on orders over ₹:299/-</p>
                        <p className='text-gray-500'>*30-days return policy.</p>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;