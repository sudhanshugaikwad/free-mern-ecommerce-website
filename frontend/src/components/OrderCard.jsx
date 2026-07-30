import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function OrderCard({userOrder}) {
     const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-3 sm:px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <Button
              className="rounded bg-black hover:bg-blue-700 transition cursor-pointer p-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Orders
            </h1>
          </div>

          {userOrder?.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6 sm:p-10 text-center">
              <p className="text-gray-500 text-base sm:text-lg mb-6">
                You have no orders yet.
              </p>

              <Button
                onClick={() => navigate("/products")}
                className="px-5 py-2.5 sm:px-6 sm:py-3 rounded bg-black hover:bg-blue-700 transition cursor-pointer"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-5 sm:space-y-6">
              {userOrder.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gray-100 px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <h2 className="text-xs sm:text-sm text-gray-500">
                        Order ID
                      </h2>
                      <span className="font-medium text-gray-800 text-sm break-all">
                        {order._id}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Date & Time
                      </p>
                      <p className="font-medium text-gray-800 text-sm">
                        {new Date(order.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Status</p>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          order.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Total</p>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">
                        {order.currency} {order.amount?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* User info */}
                 <div className="px-4 sm:px-6 py-3 border-b text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span>
                    <span className="font-medium text-gray-800">User:</span>{" "}
                    {order.user?.firstName || "Unknown"} {order.user?.lastName}
                  </span>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <span>
                    <span className="font-medium text-gray-800">Email:</span>{" "}
                    {order.user?.email || "N/A"}
                  </span>
                </div>

                  {/* Products */}
                  <div className="p-4 sm:p-6 space-y-4">
                    {order.products?.map((product, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b last:border-0 pb-4 last:pb-0"
                      >
                        <img
                          onClick={() => {
                            navigate(`/products/${product?.productId?._id}`);
                          }}
                          src={product.productId?.productImg?.[0].url}
                          alt="My Order Img"
                          className="w-full sm:w-20 h-40 sm:h-20 object-cover rounded-lg cursor-pointer"
                        />

                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-base">
                            {product.productId?.productName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Qty: {product.quantity}
                          </p>
                        </div>

                        <p className="font-semibold text-gray-800 text-base sm:text-right">
                          ₹{product.productId?.productPrice?.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default OrderCard;
