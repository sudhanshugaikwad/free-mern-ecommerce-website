import { Edit, LayoutDashboard, PackagePlus, PackageSearch, Users } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <div className="hidden mt-10 md:block fixed left-0 top-0 border-r border-gray-200 bg-gray-50 w-72 h-screen p-6 overflow-y-auto">
      
      <div className="space-y-2 mt-8">
        
        <NavLink 
          to="/dashboard/sales" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 text-[17px] font-medium rounded transition-all
             ${isActive 
               ? 'bg-black text-white shadow-sm' 
               : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
             }`
          }
        >
          <LayoutDashboard size={22} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/dashboard/add-product" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 text-[17px] font-medium rounded transition-all
             ${isActive 
               ? 'bg-black text-white shadow-sm' 
               : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
             }`
          }
        >
          <PackagePlus size={22} />
          <span>Add Product</span>
        </NavLink>

        <NavLink 
          to="/dashboard/products" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 text-[17px] font-medium rounded transition-all
             ${isActive 
               ? 'bg-black text-white shadow-sm' 
               : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
             }`
          }
        >
          <PackageSearch size={22} />
          <span>Products</span>
        </NavLink>

        <NavLink 
          to="/dashboard/users" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 text-[17px] font-medium rounded transition-all
             ${isActive 
               ? 'bg-black text-white shadow-sm' 
               : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
             }`
          }
        >
          <Users size={22} />
          <span>Users</span>
        </NavLink>

        <NavLink 
          to="/dashboard/orders" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 text-[17px] font-medium rounded transition-all
             ${isActive 
               ? 'bg-black text-white shadow-sm' 
               : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
             }`
          }
        >
          <Edit size={22} />
          <span>Orders</span>
        </NavLink>

      </div>
    </div>
  )
}

export default Sidebar