// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//   Area,
//   AreaChart,
//   CartesianGrid,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// function AdminSales() {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalProducts: 0,
//     totalOrders: 0,
//     totalSales: 0,
//     sales: [],
//   });

//   const fetchStats = async () => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/v1/orders/sales`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       if (res.data.success) {
//         setStats(res.data);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 ml-[280px]">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Page Title */}
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//           Admin Sales Dashboard
//         </h1>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
//           {/* Total Users */}
//           <Card className="bg-white shadow-sm">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">
//                 Total Users
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl sm:text-3xl font-bold text-gray-900">
//                 {stats.totalUsers}
//               </p>
//             </CardContent>
//           </Card>

//           {/* Total Products */}
//           <Card className="bg-white shadow-sm">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">
//                 Total Products
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl sm:text-3xl font-bold text-gray-900">
//                 {stats.totalProducts}
//               </p>
//             </CardContent>
//           </Card>

//           {/* Total Orders */}
//           <Card className="bg-white shadow-sm">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">
//                 Total Orders
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl sm:text-3xl font-bold text-gray-900">
//                 {stats.totalOrders}
//               </p>
//             </CardContent>
//           </Card>

//           {/* Total Sales */}
//           <Card className="bg-white shadow-sm">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">
//                 Total Sales
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl sm:text-3xl font-bold text-gray-900">
//                 ₹{stats.totalSales?.toLocaleString()}
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Sales Chart */}
//         <Card className="bg-white shadow-sm">
//           <CardHeader>
//             <CardTitle className="text-lg font-semibold text-gray-900">
//               Sales (Last 30 Days)
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[300px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={stats.sales || []}>
//                   <defs>
//                     <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#030712" stopOpacity={0.3} />
//                       <stop offset="95%" stopColor="#030712" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                   <XAxis
//                     dataKey="date"
//                     tick={{ fontSize: 12 }}
//                     tickLine={false}
//                   />
//                   <YAxis
//                     tick={{ fontSize: 12 }}
//                     tickLine={false}
//                     tickFormatter={(value) => `₹${value}`}
//                   />
//                   <Tooltip
//                     formatter={(value) => [`₹${value.toLocaleString()}`, "Sales"]}
//                     labelStyle={{ color: "#030712" }}
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="amount"
//                     stroke="#030712"
//                     fill="url(#colorSales)"
//                     strokeWidth={2}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// export default AdminSales;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function AdminSales() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    sales: [],
  });

  const fetchStats = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/orders/sales`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <section className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Sales Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor users, products, orders and revenue.
          </p>
        </div>

        {/* Cards */}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-500 text-sm">
                Total Users
              </CardTitle>
            </CardHeader>

            <CardContent>
              <h2 className="text-3xl font-bold">
                {stats.totalUsers}
              </h2>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-500 text-sm">
                Total Products
              </CardTitle>
            </CardHeader>

            <CardContent>
              <h2 className="text-3xl font-bold">
                {stats.totalProducts}
              </h2>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-500 text-sm">
                Total Orders
              </CardTitle>
            </CardHeader>

            <CardContent>
              <h2 className="text-3xl font-bold">
                {stats.totalOrders}
              </h2>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-500 text-sm">
                Total Revenue
              </CardTitle>
            </CardHeader>

            <CardContent>
              <h2 className="text-3xl font-bold">
                ₹{stats.totalSales.toLocaleString()}
              </h2>
            </CardContent>
          </Card>

        </div>

        {/* Chart */}

        <Card className="mt-8 shadow-sm">

          <CardHeader>
            <CardTitle>
              Sales (Last 30 Days)
            </CardTitle>
          </CardHeader>

          <CardContent>

            {stats.sales.length === 0 ? (
              <div className="h-80 flex items-center justify-center text-gray-400">
                No sales data available.
              </div>
            ) : (
              <div className="w-full overflow-x-auto">

                <div className="min-w-[600px] h-[300px] sm:h-[380px]">

                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.sales}>

                      <defs>
                        <linearGradient
                          id="salesGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#111827"
                            stopOpacity={0.35}
                          />

                          <stop
                            offset="95%"
                            stopColor="#111827"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `₹${value}`}
                        tickLine={false}
                      />

                      <Tooltip
                        formatter={(value) => [
                          `₹${Number(value).toLocaleString()}`,
                          "Sales",
                        ]}
                      />

                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#111827"
                        fill="url(#salesGradient)"
                        strokeWidth={2}
                      />

                    </AreaChart>
                  </ResponsiveContainer>

                </div>

              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default AdminSales;