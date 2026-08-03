// import { Edit, LayoutDashboard, PackagePlus, PackageSearch, Users } from 'lucide-react'
// import React from 'react'
// import { NavLink } from 'react-router-dom'

// function Sidebar() {
//   return (
//     <div className="hidden mt-10 md:block fixed left-0 top-0 border-r border-gray-200 bg-gray-50 w-72 h-screen p-6 overflow-y-auto">
      
//       <div className="space-y-2 mt-8">
        
//         <NavLink 
//           to="/dashboard/sales" 
//           className={({ isActive }) => 
//             `flex items-center gap-3 px-4 py-3 text-[17px] font-medium rounded transition-all
//              ${isActive 
//                ? 'bg-black text-white shadow-sm' 
//                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
//              }`
//           }
//         >
//           <LayoutDashboard size={22} />
//           <span>Dashboard</span>
//         </NavLink>

//         <NavLink 
//           to="/dashboard/add-product" 
//           className={({ isActive }) => 
//             `flex items-center gap-3 px-4 py-3 text-[17px] font-medium rounded transition-all
//              ${isActive 
//                ? 'bg-black text-white shadow-sm' 
//                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
//              }`
//           }
//         >
//           <PackagePlus size={22} />
//           <span>Add Product</span>
//         </NavLink>

//         <NavLink 
//           to="/dashboard/products" 
//           className={({ isActive }) => 
//             `flex items-center gap-3 px-4 py-3 text-[17px] font-medium rounded transition-all
//              ${isActive 
//                ? 'bg-black text-white shadow-sm' 
//                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
//              }`
//           }
//         >
//           <PackageSearch size={22} />
//           <span>Products</span>
//         </NavLink>

//         <NavLink 
//           to="/dashboard/users" 
//           className={({ isActive }) => 
//             `flex items-center gap-3 px-4 py-3 text-[17px] font-medium rounded transition-all
//              ${isActive 
//                ? 'bg-black text-white shadow-sm' 
//                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
//              }`
//           }
//         >
//           <Users size={22} />
//           <span>Users</span>
//         </NavLink>

//         <NavLink 
//           to="/dashboard/orders" 
//           className={({ isActive }) => 
//             `flex items-center gap-3 px-4 py-3 text-[17px] font-medium rounded transition-all
//              ${isActive 
//                ? 'bg-black text-white shadow-sm' 
//                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
//              }`
//           }
//         >
//           <Edit size={22} />
//           <span>Orders</span>
//         </NavLink>

//       </div>
//     </div>
//   )
// }

// export default Sidebar


import React, { useState } from "react";
import {
  Edit,
  LayoutDashboard,
  Menu,
  PackagePlus,
  PackageSearch,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const [open, setOpen] = useState(false);

  const menus = [
    {
      name: "Dashboard",
      path: "/dashboard/sales",
      icon: LayoutDashboard,
    },
    {
      name: "Add Product",
      path: "/dashboard/add-product",
      icon: PackagePlus,
    },
    {
      name: "Products",
      path: "/dashboard/products",
      icon: PackageSearch,
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: Users,
    },
    {
      name: "Orders",
      path: "/dashboard/orders",
      icon: Edit,
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}

      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-black text-white p-2 rounded shadow-lg"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed top-0 left-0
          z-50
          h-screen
          w-72
          bg-white
          border-r
          shadow-lg
          transition-transform
          duration-300
          overflow-y-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          lg:static
          lg:block
          lg:shadow-none
        `}
      >
        {/* Header */}

        <div className="flex items-center justify-between p-6 border-b">

          <h2 className="text-xl font-bold">
            Admin Panel
          </h2>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden"
          >
            <X />
          </button>

        </div>

        {/* Navigation */}

        <nav className="p-4 space-y-2">

          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <NavLink
                key={menu.path}
                to={menu.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded px-4 py-3 transition-all duration-200

                  ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={21} />

                <span className="font-medium">
                  {menu.name}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;