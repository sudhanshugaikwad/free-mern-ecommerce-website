import { setUser } from "@/redux/userSlice";
import { Button } from "@base-ui/react";
import axios from "axios";
import { ShoppingCart, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function Navbar() {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product);

  const accessToken = localStorage.getItem("accessToken");

  const dispatch = useDispatch();

  const admin = user?.role === "admin";

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(setUser(null));
        localStorage.removeItem("accessToken");
        toast.success(res.data.message);
      }
    } catch (error) {
      dispatch(setUser(null));
      localStorage.removeItem("accessToken");
      toast.error(error.response?.data?.message || "Logout Failed");
    }

    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navbar */}
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" onClick={closeMenu}>
            <img
              src="/eKart.png"
              alt="eKart Logo"
              className="h-10 sm:h-11 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">

            <nav>
              <ul className="flex items-center gap-7 font-medium text-gray-700">

                <li>
                  <Link
                    to="/"
                    className="hover:text-black transition"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    to="/products"
                    className="hover:text-black transition"
                  >
                    Products
                  </Link>
                </li>

                {user && (
                  <li>
                    <Link
                      to={`/profile/${user._id}`}
                      className="hover:text-black transition"
                    >
                      Hello, {user.firstName}
                    </Link>
                  </li>
                )}

                {admin && (
                  <li>
                    <Link
                      to="/dashboard/sales"
                      className="hover:text-black transition"
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            {/* Cart */}

            <Link
              to="/cart"
              className="relative rounded-full p-2 hover:bg-gray-100 transition"
            >
              <ShoppingCart className="w-6 h-6" />

              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-[11px]">
                {cart?.items?.length || 0}
              </span>
            </Link>

            {/* Button */}

            {user ? (
              <Button
                onClick={logoutHandler}
                className="cursor-pointer rounded-lg bg-black hover:bg-blue-700 text-white px-5 py-2 transition"
              >
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button className="cursor-pointer rounded-lg bg-black hover:bg-blue-700 text-white px-5 py-2 transition">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Right */}

          <div className="flex md:hidden items-center gap-3">

            {/* Cart */}

            <Link
              to="/cart"
              className="relative p-2"
              onClick={closeMenu}
            >
              <ShoppingCart className="w-6 h-6" />

              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-[10px]">
                {cart?.items?.length || 0}
              </span>
            </Link>

            {/* Menu */}

            <button
              aria-label="Toggle Menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X size={28} />
              ) : (
                <Menu size={28} />
              )}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-[450px] py-4" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col gap-5 text-gray-700 font-medium">

            <li>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>

            <li>
              <Link to="/products" onClick={closeMenu}>
                Products
              </Link>
            </li>

            {user && (
              <li>
                <Link
                  to={`/profile/${user._id}`}
                  onClick={closeMenu}
                >
                  Hello, {user.firstName}
                </Link>
              </li>
            )}

            {admin && (
              <li>
                <Link
                  to="/dashboard/sales"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
              </li>
            )}

            <li>
              <Link
                to="/cart"
                onClick={closeMenu}
                className="flex items-center gap-3"
              >
                <ShoppingCart size={20} />

                Cart

                <span className="rounded-full bg-black text-white text-xs px-2 py-0.5">
                  {cart?.items?.length || 0}
                </span>
              </Link>
            </li>

            <li>
              {user ? (
                <Button
                  onClick={logoutHandler}
                  className="w-full rounded-lg bg-black hover:bg-blue-700 text-white py-3"
                >
                  Logout
                </Button>
              ) : (
                <Link to="/login" onClick={closeMenu}>
                  <Button className="w-full rounded-lg bg-black hover:bg-blue-700 text-white py-3">
                    Login
                  </Button>
                </Link>
              )}
            </li>
          </ul>
        </div>

      </div>
    </header>
  );
}

export default Navbar;