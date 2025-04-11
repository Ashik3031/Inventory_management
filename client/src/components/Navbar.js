import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [isScrolled, setIsScrolled] = useState(false);
  console.log("user:", user);

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-filter backdrop-blur-lg transition-all duration-300 
      ${
        isScrolled
          ? "bg-black bg-opacity-70 shadow-lg"
          : "bg-black bg-opacity-30"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            to="/"
            className="text-2xl md:text-3xl font-bold text-white tracking-tight"
          >
            ProductMall
          </Link>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center space-x-2 md:space-x-6"
        >
          {token ? (
            <>
              <div className="flex items-center space-x-3 ml-3">
                {user && (
                  <div className="hidden md:flex items-center">
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-green-400 border border-purple-800"></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-blue-100 hidden lg:inline">
                      {user.email}
                    </span>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:shadow-lg transition duration-300"
                >
                  Logout
                </motion.button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-blue-200 hover:text-white font-medium transition duration-300"
              >
                Login
              </Link>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition duration-300"
                >
                  Register
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
