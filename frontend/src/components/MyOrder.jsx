
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import OrderCard from "./OrderCard";

function MyOrder() {
  const [userOrder, setUserOrder] = useState([]);
  const [loading, setLoading] = useState(true);
 

  const accessToken = localStorage.getItem("accessToken");

  const getUserOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/orders/myorder`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (data.success) {
        setUserOrder(data.orders);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-base sm:text-lg text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  return (
    <>
    <OrderCard userOrder={userOrder}/>
    </>
  );
}

export default MyOrder;