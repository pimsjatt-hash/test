import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // re-check login status whenever route changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="w-full bg-white/40 shadow sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 shadow-[-0px_20px_22px_-15px_rgba(0,0,0,0.1)]">
        
        {/* Logo */}
        <Link to="/">
          <div className="flex items-center space-x-2 ml-40">
            <div className="bg-green-700 text-white p-2 rounded-xl">
              <BookOpen size={20} />
            </div>
            <span className="font-bold text-xl text-gray-800">Larnik</span>
            <span className="font-medium text-sm text-gray-800 bg-green-100 px-2 py-0.5 rounded-2xl">
              LMS
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium ml-30">
          <Link to="/" className="hover:text-green-600 ml-40">Home</Link>
          <Link to="/courses" className="hover:text-green-600 ml-40">Courses</Link>
          <Link to="/about" className="hover:text-green-600">About</Link>
          <Link to="/contact" className="hover:text-green-600">Contact</Link>
          <Link to="/admin" className="hover:text-green-600">Dashboard</Link>
        </nav>

        {/* Login/Signup OR Logout */}
        <div className="hidden md:flex items-center space-x-3 text-green-800 ml-y">
          {isLoggedIn ? (
            <button 
              onClick={handleLogout} 
              className="hover:text-red-600 ml-40"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">
                <button className="hover:text-green-600 ml-40">Login</button>
              </Link>
              <Link to="/signup">
                <button className="hover:text-green-600">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
