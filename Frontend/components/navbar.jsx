import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../src/AuthContext";

const Navbar = () => {
  const [activeNav, setActiveNav] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinkClass = (index) => {
    const baseClass = "block py-2 px-3 rounded md:p-0 md:text-gray-700 hover:text-purple-600 transition-colors duration-200";
    return activeNav === index
      ? `${baseClass} text-purple-600 font-semibold`
      : `${baseClass} text-gray-700`;
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-20 top-0 start-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg" // Consider replacing with a local asset
            className="h-7"
            alt="WaveSRT Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-800">
            WaveSRT
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded={isOpen ? "true" : "false"}
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor" // Changed to currentColor for consistency
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Navigation links */}
        <div
          className={`w-full md:block md:w-auto ${isOpen ? 'block' : 'hidden'}`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
            {/* Home Link */}
            <li>
              <Link
                to="/"
                className={getLinkClass(0)}
                onClick={() => { setActiveNav(0); setIsOpen(false); }}
              >
                Home
              </Link>
            </li>

            {/* About Link */}
            <li>
              <Link
                to="/about"
                className={getLinkClass(1)}
                onClick={() => { setActiveNav(1); setIsOpen(false); }}
              >
                About
              </Link>
            </li>

            {/* Login Button - Only show if NOT logged in */}
            {!isLoggedIn && (
              <li>
                <Link
                  to="/login"
                  className={getLinkClass(2)}
                  onClick={() => { setActiveNav(2); setIsOpen(false); }}
                >
                  Login
                </Link>
              </li>
            )}

            {/* Logout Button - Only show if logged in */}
            {isLoggedIn && (
              <li className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm">
                  {user?.name || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="block py-2 px-3 rounded md:p-0 text-gray-700 hover:text-purple-600 cursor-pointer transition-colors duration-200"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
