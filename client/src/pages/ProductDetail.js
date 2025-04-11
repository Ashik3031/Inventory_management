import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setQuantity(1); // Reset quantity when product changes
        setError(null);
      })
      .catch(err => {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product details");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
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

  

  const handleEdit = () => {
    navigate(`/products/edit/${id}`);
  };

  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-900 to-purple-800">
        <div className="text-white text-2xl">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-900 to-purple-800 text-white">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-8">{error || "The product you're looking for doesn't exist or has been removed."}</p>
        <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-800 text-white pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-blue-300 hover:text-white transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link to="/products" className="text-blue-300 hover:text-white transition duration-300">
                    Products
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-blue-100">{product.name}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl border border-white border-opacity-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left: Product Details */}
              <motion.div variants={itemVariants} className="flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold">{product.title}</h1>
                    <div className="flex items-center">
                    <Link to={`/edit-product/${id}`} className="flex items-center">
                      <button onClick={handleEdit}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition duration-300">
                        
                        <span className="text-sm">✏️ Edit</span>
                      </button>
                      </Link>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className={`px-3 py-1 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'} text-white text-sm font-medium`}>
                        {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </div>
                      <div className="ml-4 text-blue-200">
                        SKU: {product.sku || 'N/A'}
                      </div>
                    </div>

                    <div className="text-3xl font-bold mb-4">
                      ${parseFloat(product.price).toFixed(2)}
                    </div>

                    <p className="text-blue-100 mb-6">{product.description}</p>

                    {product.categories && product.categories.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-medium mb-3">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                          {product.categories.map((category, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-blue-800 bg-opacity-40 rounded-full text-sm"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 bg-black bg-opacity-20 rounded-xl p-6">
                  <h3 className="text-lg font-medium mb-3">Inventory Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-blue-300 text-sm">Current Stock</p>
                      <p className="text-2xl font-bold">{product.stock}</p>
                    </div>
                    <div>
                      <p className="text-blue-300 text-sm">Value</p>
                      <p className="text-2xl font-bold">${(parseFloat(product.price) * product.stock).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-blue-300 text-sm">Min. Level</p>
                      <p className="text-xl font-medium">{product.minLevel || 10}</p>
                    </div>
                    <div>
                      <p className="text-blue-300 text-sm">Reorder Status</p>
                      <p className={`text-xl font-medium ${product.stock <= (product.minLevel || 10) ? 'text-yellow-400' : 'text-green-400'}`}>
                        {product.stock <= (product.minLevel || 10) ? 'Reorder Soon' : 'Good'}
                      </p>
                    </div>
                  </div>
                </div>

             
              </motion.div>

              {/* Right: Product Image */}
              <motion.div variants={itemVariants} className="flex flex-col">
                <div className="bg-black bg-opacity-20 rounded-xl p-4 mb-4 aspect-square flex items-center justify-center">
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={product.image || product.media || '/api/placeholder/500/500'}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/api/placeholder/500/500';
                    }}
                  />
                </div>

                
              </motion.div>
            </div>
          </div>
 
        </motion.div>
      </div>
    </div>
  );
}

export default ProductDetail;