import { setUser } from '@/redux/userSlice';
import { Button } from '@base-ui/react';
import axios from 'axios';
import { ShoppingCart, Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Navbar() {
  const { user } = useSelector((store) => store.user);
  const {cart} = useSelector(store=>store.product)
  const accessToken = localStorage.getItem('accessToken');
  const admin = user?.role === "admin" ? true : false;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (res.data.success) {
        dispatch(setUser(null));
        localStorage.removeItem('accessToken');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Logout Error:", error.response?.data || error);
      dispatch(setUser(null));
      localStorage.removeItem('accessToken');
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/eKart.png"
              alt="eKart"
              className="w-24 sm:w-28 h-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <ul className="flex items-center gap-8 text-sm font-medium text-gray-700">
              <li>
                <Link to="/" className="hover:text-black transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-black transition-colors duration-200">
                  Products
                </Link>
              </li>
              {user && (
                <li>
                  {/* here we have get user id */}
                  <Link to={`/profile/${user._id}`} className="hover:text-black transition-colors duration-200">
                    Hello, {user.firstName}
                  </Link>
                </li>
              )}
              {admin && (
                <li>
                 
                  <Link to={`/dashboard/sales`} className="hover:text-black transition-colors duration-200">
                    Dashbord 
                  </Link>
                </li>
              )}
              
            </ul>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                {cart?.items?.length || 0}
              </span>
            </Link>

            {/* Auth Button */}
            {user ? (
              <Button
                onClick={logoutHandler}
                type="button"
                className="px-5 py-2.5 text-sm font-medium bg-gray-900 hover:bg-blue-700 text-white rounded transition-all duration-200 hover:shadow-md active:scale-[0.97] cursor-pointer"
              >
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button
                  type="button"
                  className="px-5 py-2.5 text-sm font-medium bg-gray-900 hover:bg-blue-700 text-white rounded transition-all duration-200 hover:shadow-md active:scale-[0.97] cursor-pointer"
                >
                  Login
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white">
            <ul className="flex flex-col gap-6 text-base font-medium text-gray-700 px-2">
              <li>
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-black">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" onClick={() => setIsMenuOpen(false)} className="hover:text-black">
                  Products
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="hover:text-black">
                    Hello, {user.firstName}
                  </Link>
                </li>
              )}

              {/* Cart in Mobile */}
              <li>
                <Link 
                  to="/cart" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Cart
                  <span className="bg-black text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    0
                  </span>
                </Link>
              </li>
            </ul>

            {/* Auth Button in Mobile */}
            <div className="mt-6 px-2">
              {user ? (
                <Button
                  onClick={() => {
                    logoutHandler();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-3 text-base font-medium text-white bg-blue-700 hover:bg-blue-900 rounded transition-all"
                >
                  Logout
                </Button>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full py-3 text-base font-medium text-white bg-blue-700 hover:bg-blue-900 rounded transition-all">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;