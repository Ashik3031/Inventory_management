import { useEffect, useState } from 'react';
import axios from 'axios';

function ProductShowcasePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products/').then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-800 to-slate-900 py-10 px-4 text-white mt-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">Explore Products</h1>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
            >
              <div className="p-5 flex flex-col h-full">
                {/* Placeholder Image */}
                <div className="w-full h-40 bg-slate-600 rounded mb-4 flex items-center justify-center text-slate-400">
                  <span className="text-sm">Image</span>
                </div>

                <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
                <p className="text-sm text-slate-300 mb-2">{product.description.slice(0, 60)}...</p>
                <p className="font-bold text-green-400 mb-1">${product.price}</p>
                <p className="text-xs italic text-slate-400">Category: {product.category}</p>

                <button className="mt-auto bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded mt-4">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-slate-300 mt-20">No products available right now.</p>
        )}
      </div>
    </div>
  );
}

export default ProductShowcasePage;
