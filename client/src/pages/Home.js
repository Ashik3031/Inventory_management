import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState([]);

  const [inventoryStats, setInventoryStats] = useState({totalProducts: 0, lowStockItems: 0, totalValue: 0});

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('token');
    // console.log("Token:", token)
    // if (!token) {
    //   navigate('/login');
    // }
    // Simulate loading time
    const timer = setTimeout(() => {
      const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      setUser(userData);
      setIsLoading(false);
    }, 800);

    axios.get('http://localhost:5000/api/products/recent')
      .then(res => setRecentProducts(res.data))
      .catch(err => console.error('Error loading recent products:', err));

    axios.get('http://localhost:5000/api/products/stats')
      .then(res => {
        setInventoryStats(res.data);
        
      })
      .catch(err => {
        console.error("Failed to fetch inventory stats:", err);
        // Fallback to calculate from all products if stats endpoint doesn't exist 
        axios.get('http://localhost:5000/api/products')
          .then(res => {
            const products = res.data;
            const lowStockThreshold = 10; // Default threshold
            
            const stats = {
              totalProducts: products.length,
              lowStockItems: products.filter(p => p.stock <= lowStockThreshold).length,
              totalValue: products.reduce((sum, p) => sum + (parseFloat(p.price) * p.stock), 0)
            };
            
            setInventoryStats(stats);
            
          })
          .catch(err => {
            console.error("Failed to fetch all products for stats calculation:", err);
            
          });
      })
    
    return () => clearTimeout(timer);
  }, []);

  

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-900 to-purple-800">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-800 text-white pt-20 ">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          <motion.div 
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold mb-6">Welcome to ProductMaster</h1>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Manage your product inventory with ease. Add, edit, and track all your products in one place.
            </p>
          </motion.div>

          {/* Main Product Actions */}
          <motion.div
            variants={itemVariants} 
            className="grid md:grid-cols-2 gap-6 mb-16"
          >
            <Link to="/products">
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-lg border border-white border-opacity-20 h-full"
              >
                <div className="h-16 w-16 rounded-xl bg-blue-500 mb-6 flex items-center justify-center">
                  <span className="text-3xl">📦</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Browse Products</h3>
                <p className="text-blue-200 mb-6">
                  View your complete product catalog, filter by categories, and check inventory status.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">View all products</span>
                  <span className="text-2xl">→</span>
                </div>
              </motion.div>
            </Link>

            <Link to="/add-product">
              <motion.div
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-lg border border-white border-opacity-20 h-full"
              >
                <div className="h-16 w-16 rounded-xl bg-green-500 mb-6 flex items-center justify-center">
                  <span className="text-3xl">➕</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Add New Product</h3>
                <p className="text-blue-200 mb-6">
                  Add new products to your inventory with detailed information, pricing, and stock levels.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Create product</span>
                  <span className="text-2xl">→</span>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Quick Stats Section */}
          {user && (
               <motion.div 
               variants={itemVariants}
               initial="hidden"
               animate="visible"
               className="bg-black bg-opacity-30 rounded-2xl p-8 mb-16"
             >
               <h2 className="text-2xl font-bold mb-6">Your Inventory at a Glance</h2>
             
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 {[
                   { label: 'Total Products', value: inventoryStats.totalProducts, format: 'number' },
                   { label: 'Low Stock Items', value: inventoryStats.lowStockItems, format: 'number' },
                   { label: 'Total Value', value: inventoryStats.totalValue, format: 'currency' }
                 ].map((stat, index) => (
                   <motion.div 
                     key={stat.label}
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: 0.2 + index * 0.2 }}
                     className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg p-4"
                   >
                     <p className="text-blue-300 text-sm">{stat.label}</p>
                     <p className="text-2xl font-bold">
                       {stat.format === 'currency' 
                         ? new Intl.NumberFormat('en-US', {
                             style: 'currency',
                             currency: 'INR',
                             minimumFractionDigits: 2
                           }).format(stat.value)
                         : stat.value.toLocaleString()}
                     </p>
                   </motion.div>
                 ))}
               </div>
             </motion.div>
          )}

       {recentProducts?.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="mt-12 bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Recently Added</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentProducts.map((p, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="bg-white bg-opacity-10 rounded-lg overflow-hidden"
              >
                <div className="aspect-square bg-gray-700">
                  <img
                    src={p.media || '/api/placeholder/200/200'}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/api/placeholder/200/200';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{p.name}</h3>
                  <p className="text-blue-300">${parseFloat(p.price).toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-black bg-opacity-30 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-300">© 2025 ProductMall.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;