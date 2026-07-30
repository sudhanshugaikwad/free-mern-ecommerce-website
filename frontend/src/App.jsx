import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Pages import here
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import NotFound from './pages/NotFound'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import AdminSales from './pages/admin/AdminSales'
import AdminOrders from './pages/admin/AdminOrders'
import ShowUserOrders from './pages/admin/ShowUserOrders'
import AddProduct from './pages/admin/AddProduct'
import AdminUsers from './pages/admin/AdminUsers'
import UserInfo from './pages/admin/UserInfo'
import ProtectedRoute from './components/ProtectedRoute'
import SingleProdcuct from './pages/SingleProdcuct'
import AdminProduct from './pages/admin/AdminProduct'
import AddressForm from './pages/AddressForm'
import OrderSuccess from './pages/OrderSuccess'


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
        <Footer/>
      </>
    ),
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify",
    element: <Verify />,
  },
 {
  path: "/verify/:token",
  element: <VerifyEmail />,
 },
 {
  path: "/profile/:userId",
  element:<ProtectedRoute> <Navbar/> <Profile /> <Footer/> </ProtectedRoute>,
 },
 {
  path: "/products",
  element:<><Navbar/> <Products /> <Footer/></>,
 },
 {
  path: "/products/:id",
  element:<><Navbar/> <SingleProdcuct /> <Footer/></>,
 },
 {
  path: "/cart",
  element:<><Navbar/> <Cart /> <Footer/></>,
 },
 {
  path: "/address",
  element:<><Navbar/> <AddressForm /> <Footer/></>,
 },
 {
  path: "/order-success",
  element:<><Navbar/> <OrderSuccess /> <Footer/></>,
 },
 {
    path: "*",
    element:<><Navbar/> <NotFound /> <Footer/></> ,
  },
  {
  path: "/dashboard",
  element:<ProtectedRoute adminOnly={true}><Navbar/> <Dashboard/> </ProtectedRoute>,
  children:[
    {path:"sales", element:<AdminSales/>},
    {path:"add-product", element:<AddProduct/>},
    {path:"products",element:<AdminProduct/>},
    {path:"orders", element:<AdminOrders/>},
    {path:"users/orders/:userId",element:<ShowUserOrders/>}, 
    {path:"users",element:<AdminUsers/>},
    {path: "users/:userId", element: <UserInfo /> } 
  ]
 },
  
])

export default function App() {
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}
