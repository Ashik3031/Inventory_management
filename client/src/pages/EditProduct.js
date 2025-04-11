import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    media: null,
    status: "draft",
    category: "",
    price: "",
    stock: "",
  });

 
  const [searchTerm, setSearchTerm] = useState("");
  const [imageResults, setImageResults] = useState([]);

  // Fetch product on mount
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/products/${id}`);
          setForm(res.data);
        } catch (err) {
          console.error("Error fetching product:", err);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query: searchTerm, per_page: 6 },
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_KEY}`,
        },
      });
      setImageResults(res.data.results);
    } catch (error) {
      console.error("Error fetching images from Unsplash:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/products/edit/${id}`, form, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      navigate("/products"); 
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-800 flex items-center justify-center p-6 mt-16">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl"
      >
        <div className="flex-1 space-y-6">
          {/* Title */}
          <div className="bg-white/20 backdrop-blur-lg p-4 rounded-xl shadow-lg">
            <label className="text-white block mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white/20 text-white placeholder-white"
              placeholder="Product title"
            />
          </div>

          {/* Description */}
          <div className="bg-white/20 backdrop-blur-lg p-4 rounded-xl shadow-lg">
            <label className="text-white block mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              className="w-full p-2 rounded bg-white/20 text-white placeholder-white"
              placeholder="Write product description..."
            ></textarea>
          </div>

          {/* Unsplash Image Selector */}
          <div className="bg-white/10 backdrop-blur p-4 rounded-xl shadow-sm">
            <label className="text-white block mb-2">Search Product Image</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="p-2 rounded bg-slate-700 text-white w-full"
                placeholder="Search e.g. shoes, bags"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="button"
                className="bg-yellow-500 px-4 rounded text-black"
                onClick={fetchImages}
              >
                Search
              </button>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {imageResults.map((img) => (
                <img
                  key={img.id}
                  src={img.urls.small}
                  alt={img.alt_description}
                  className={`rounded border-2 cursor-pointer hover:border-yellow-400 ${
                    form.media === img.urls.small ? "border-yellow-500" : "border-slate-700"
                  }`}
                  onClick={() => setForm((prev) => ({ ...prev, media: img.urls.small }))}
                />
              ))}
            </div>

            {/* Preview Selected */}
            {form.media && (
              <div className="mt-4">
                <label className="text-white block text-sm mb-1">Selected Image</label>
                <img src={form.media} className="w-32 rounded" alt="Selected" />
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="w-full lg:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition"
          >
            Update Product
          </motion.button>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-80 space-y-4">
          <div className="bg-white/20 p-4 rounded-xl">
            <label className="text-white block mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white/20 text-black"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </div>

          <div className="bg-white/20 p-4 rounded-xl">
            <label className="text-white block mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white/20 text-black"
            >
              <option value="">Choose a category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="beauty">Beauty</option>
              <option value="home">Home</option>
              <option value="gadgets">Gadgets</option>
            </select>
          </div>

          <div className="bg-white/20 p-4 rounded-xl">
            <label className="text-white block mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white/20 text-white placeholder-white"
              placeholder="$0.00"
            />
          </div>

          <div className="bg-white/20 p-4 rounded-xl">
            <label className="text-white block mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white/20 text-white placeholder-white"
              placeholder="Stock quantity"
            />
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default EditProduct;
