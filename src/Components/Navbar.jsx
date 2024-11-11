import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [user, setUser] = useState();
  const [login, setLogin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessTokken");
    if (token) {
      try {
        setLogin(!login);
        const decodedToken = jwtDecode(token);
        console.log("decode", decodedToken);
        setUser(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessTokken");
    setLogin(false);
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="border-gray-200 bg-transparent w-[100vw] overflow-hidden">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <Link to={"/"}>
          <span className="logoHeading self-center text-2xl font-extrabold whitespace-nowrap text-[#CF9FFF] tracking-wide">
            LearnSphere
          </span>
          </Link>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            {login && (
              <Link to={"/userprofile"}>
                <img src={user?.avatar} className="w-10 h-10 rounded-full" alt="Profile" />
              </Link>
            )}
            {login ? (
              <span
                className="text-sm text-purple-400 hover:underline cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </span>
            ) : (
              <Link to={"/loginuser"}>
                <span className="text-sm text-purple-400 hover:underline">Login</span>
              </Link>
            )}
            {/* Hamburger Icon for mobile */}
            <button
              onClick={toggleMobileMenu}
              className="text-gray-400 hover:text-purple-400 lg:hidden"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
        {/* Menu items */}
        <nav className={`bg-transparent flex justify-center ${isMobileMenuOpen ? "block" : "hidden"} lg:flex`}>
          <div className="max-w-screen-xl px-4 py-3 mx-auto">
            <div className="flex items-center">
              <ul className="flex flex-col lg:flex-row font-medium mt-0 space-y-4 lg:space-y-0 lg:space-x-8 text-sm">
                <li>
                  <Link to={"/"}>
                    <span className="text-gray-400 hover:underline" aria-current="page">
                      Home
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to={"/teachers"}>
                    <span className="text-gray-400 hover:underline">Teachers</span>
                  </Link>
                </li>
                <li>
                  <Link to={"/videos"}>
                    <span className="text-gray-400 hover:underline">Videos</span>
                  </Link>
                </li>
                <li>
                  <Link to={"/aboutus"}>
                    <span className="text-gray-400 hover:underline">About</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </nav>
    </>
  );
}
