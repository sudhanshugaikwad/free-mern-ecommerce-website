import React from "react";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful 🎉
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 mb-8">
          Thank you for your purchase! Your order has been placed successfully.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/products")}
            className="w-full py-3 px-6 rounded-full bg-black hover:bg-blue-700 cursor-pointer text-white font-medium transition-colors"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="w-full py-3 px-6 rounded-full border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50 font-medium transition-colors"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;