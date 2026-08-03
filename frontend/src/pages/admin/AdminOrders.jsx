import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");

  const getAllOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/orders/all`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // ========== DELETE ORDER ==========
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Order deleted successfully");
        // Remove from UI immediately
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        // Close expanded view if it was open
        if (expandedOrder === orderId) {
          setExpandedOrder(null);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading all orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Admin - All Orders
        </h1>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">
                    User
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">
                    Products
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-10 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <React.Fragment key={order._id}>
                      {/* Main Row */}
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-4 py-4 text-sm text-gray-700 break-all max-w-[180px]">
                          {order._id}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-700">
                          {order.user?.email || "N/A"}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-700">
                          × {order.products?.length || 0}
                        </td>

                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          ₹{order.amount?.toLocaleString()}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                              order.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-700">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN"
                          )}
                        </td>

                        {/* ACTION COLUMN */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {/* View Products */}
                            <button
                              onClick={() => toggleExpand(order._id)}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {expandedOrder === order._id
                                ? "Hide Details"
                                : "View Products"}
                            </button>

                            {/* Delete Order */}
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 hover:underline"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Product Details */}
                      {expandedOrder === order._id && (
                        <tr className="bg-gray-50">
                          <td colSpan="7" className="px-4 py-4">
                            <div className="space-y-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Product Details:
                              </p>

                              {order.products?.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3 rounded-lg border"
                                >
                                  <img
                                    src={item.productId?.productImg?.[0]?.url}
                                    alt={item.productId?.productName}
                                    className="w-16 h-16 object-cover rounded-md cursor-pointer"
                                    onClick={() =>
                                      navigate(
                                        `/products/${item.productId?._id}`
                                      )
                                    }
                                  />

                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                      {item.productId?.productName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>

                                  <p className="font-semibold text-gray-800">
                                    ₹
                                    {item.productId?.productPrice?.toLocaleString()}
                                  </p>
                                </div>
                              ))}

                              {/* User extra info */}
                              <div className="text-sm text-gray-600 pt-2">
                                <span className="font-medium">Customer: </span>
                                {order.user?.firstName} {order.user?.lastName}{" "}
                                ({order.user?.email})
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;