// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { Button } from "./ui/button";
// import { ArrowLeft } from "lucide-react";

// function MyOrder() {
//   const [userOrder, setUserOrder] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const accessToken = localStorage.getItem("accessToken");

//   const getUserOrders = async () => {
//   try {
//     setLoading(true);
//     const { data } = await axios.get(
//       `${import.meta.env.VITE_URL}/api/v1/orders/myorder`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     if (data.success) {
//       setUserOrder(data.orders);
//     }
//   } catch (error) {
//     console.error(error);
//     toast.error("Failed to load your orders");
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     getUserOrders();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-lg text-gray-600">Loading your orders...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-5xl mx-auto">
//         <Button className='rounded bg-black hover:bg-blue-700 transition cursor-pointer' onClick={()=>{navigate(-1)}}><ArrowLeft/></Button>
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">  My Orders</h1>

//         {userOrder?.length === 0 ? (
//           <div className="bg-white rounded-md shadow p-10 text-center">
//             <p className="text-gray-500 text-lg mb-6">You have no orders yet.</p>
            
//             <Button
//               onClick={() => navigate("/products")}
//               className="px-6 py-3 bg-blck  rounded bg-black hover:bg-blue-700 transition cursor-pointer"
//             >
//               Continue Shopping
//             </Button>
//           </div>
//         ) : (
//           <div className="space-y-6">

//             {userOrder.map((order) => (
//               <div
//                 key={order._id}
//                 className="bg-white rounded-2xl shadow-md overflow-hidden"
//               >
//                 {/* Order Header */}
//                 <div className="bg-gray-100 px-6 py-4 flex flex-wrap justify-between items-center gap-3">
//                   <div>
//                     <h2 className="text-sm text-gray-500">Order ID</h2>
//                     <span className="font-medium text-gray-800">{order._id}</span>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Date & Time </p>
//                     <p className="font-medium text-gray-800">
//                       {new Date(order.createdAt).toLocaleDateString("en-IN", {day: "2-digit",month: "short",year: "numeric",hour: "2-digit",minute: "2-digit",hour12: true,})} 
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Status</p>
//                     <span
//                       className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
//                         order.status === "Paid"
//                           ? "bg-green-100 text-green-700"
//                           : order.status === "Failed"
//                           ? "bg-red-100 text-red-700"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {order.status}
//                     </span>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Total</p>
//                     <p className="font-bold text-gray-900">
//                       {order.currency} {order.amount?.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>


//                 {/* user info */}
//                 <div className="p-4 space-y-2">
//                  <span>
//                    User : {order.user?.firstName || "Unknow"} {order.user?.lastName}
//                   ||
//                    Email: {order.user?.email || "N/A"}
//                  </span>
                
//                 </div>


//                 {/* Products details */}
//                 <div className="p-6 space-y-4">
//                   {order.products?.map((product, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center gap-4 border-b last:border-0 pb-4 last:pb-0"
//                     >
//                       <img
//                         src={product.productId?.productImg?.[0].url}
//                         alt="My Order Img"
//                         className="w-20 h-20 object-cover rounded-lg"
//                       />
//                       <div className="flex-1">
//                         <h3 className="font-medium text-gray-900">
//                           {product.productId?.productName}
//                         </h3>
//                         <p className="text-sm text-gray-500">
//                           Qty: {product.quantity}
//                         </p>
//                       </div>
//                       <p className="font-semibold text-gray-800">
//                         ₹{product.productId?.productPrice?.toLocaleString()}
//                       </p>
//                     </div>
//                   ))}
//                 </div>


//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default MyOrder;




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
        `${import.meta.env.VITE_URL}/api/v1/orders/myorder`,
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