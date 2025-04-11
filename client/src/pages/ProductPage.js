import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ProductShowcasePage() {
  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockFilter, setInStockFilter] = useState('all');

  const navigate = useNavigate();

  useEffect(() => {
    // const token = localStorage.getItem('token');
    // if (!token) {
    //   navigate('/login');
    // }
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:5000/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => fetchProducts())
    .catch(err => console.error('Delete failed', err));
  };

  const filteredProducts = products.filter((product) => {
    const matchCategory = categoryFilter ? product.category?.toLowerCase() === categoryFilter.toLowerCase() : true;
    const matchMin = minPrice ? Number(product.price) >= Number(minPrice) : true;
    const matchMax = maxPrice ? Number(product.price) <= Number(maxPrice) : true;
    const matchStock =
      inStockFilter === 'in'
        ? Number(product.stock) > 0
        : inStockFilter === 'out'
        ? Number(product.stock) <= 0
        : true;
    return matchCategory && matchMin && matchMax && matchStock;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Products</h1>
          <Link to={"/add-product"}>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded">
              <FaPlus />
              Add Product
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 text-white px-3 py-2 rounded border border-slate-700"
          />
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="bg-slate-800 text-white px-3 py-2 rounded border border-slate-700"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="bg-slate-800 text-white px-3 py-2 rounded border border-slate-700"
          />
          <select
            value={inStockFilter}
            onChange={(e) => setInStockFilter(e.target.value)}
            className="bg-slate-800 text-white px-3 py-2 rounded border border-slate-700"
          >
            
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-slate-800 rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left text-white">
            <thead className="bg-slate-700 text-slate-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Inventory</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Actions</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b border-slate-700 hover:bg-slate-700 transition">
                    <td className="px-4 py-3">
                      <Link to={`/productDetail/${product._id}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-600 rounded flex items-center justify-center text-xs text-slate-300">
                            <img src={product.media} alt={product.title} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-medium">{product.title}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${product.stock > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                        {product.stock > 0 ? 'Active' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{product.stock || 0} in stock</td>
                    <td className="px-4 py-3 text-slate-300">{product.category || 'Uncategorized'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/edit-product/${product._id}`}>
                        <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                          <FaEdit />
                          Edit
                        </button>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(product._id)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
                        <FaTrash />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-slate-400">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductShowcasePage;
