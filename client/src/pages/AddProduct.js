import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const AddProduct = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    media: null,
    status: "draft",
    category: "",
    price: "",
    stock: "",
  });

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
const [imageResults, setImageResults] = useState([]);

const fetchImages = async () => {
  try {
    console.log("Unsplash Key:", process.env.NEXT_PUBLIC_UNSPLASH_KEY);
    const res = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: { query: searchTerm, per_page: 6 },
      headers: {
        Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_KEY}`
      },
    });
    setImageResults(res.data.results);
    console.log("Image results:", res.data.results);
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
      const response = await axios.post("http://localhost:5000/api/products/add", form, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Product added:", response.data);
      navigate("/products");
      // Optionally reset form here
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product");
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
        {/* Left Side */}
        <div className="flex-1 space-y-6">
          {/* Title */}
          <div className="bg-white bg-opacity-20 backdrop-blur-lg p-4 rounded-xl shadow-lg">
            <label className="block text-sm font-medium text-white mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Product title"
              className="w-full p-2 rounded bg-white bg-opacity-20 placeholder-white text-white focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Description */}
          <div className="bg-white bg-opacity-20 backdrop-blur-lg p-4 rounded-xl shadow-lg">
            <label className="block text-sm font-medium text-white mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              placeholder="Write product description..."
              className="w-full p-2 rounded bg-white bg-opacity-20 placeholder-white text-white focus:outline-none focus:ring focus:ring-blue-300"
            ></textarea>
          </div>

          {/* Media */}
          {/* Media from Unsplash */}
<div className="bg-white/5 backdrop-blur p-4 rounded-xl shadow-sm">
  <label className="block text-sm font-medium mb-2 text-white">Search for Product Image</label>
  <div className="flex gap-2">
    <input
      type="text"
      className="p-2 rounded bg-slate-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
      placeholder="Search e.g. shoes, headphones"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <button
      onClick={fetchImages}
      type="button"
      className="bg-yellow-500 hover:bg-yellow-600 px-4 rounded text-black font-medium"
    >
      Search
    </button>
  </div>
   
  {/* Show Image Options */}
  <div className="grid grid-cols-3 gap-3 mt-4">
    {imageResults.map((img) => (
      <img
        key={img.id}
        src={img.urls.small}
        alt={img.alt_description}
        className={`rounded border-2 cursor-pointer hover:border-yellow-400 ${
          form.media === img.urls.small ? "border-yellow-500" : "border-slate-700"
        }`}
        onClick={() =>
            setForm((prev) => ({
              ...prev,
              media: img.urls.small, // Set image URL in the 'media' field
            }))
          }
          
      />
    ))}
  </div>

  {/* Selected Image Preview many */}
  {form.media && (
    <div className="mt-4">
      <label className="block mb-1 text-sm text-white">Selected Image</label>
      <img src={form.media} className="w-32 rounded" alt="Selected" />
    </div>
  )}
</div>


          {/*  Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="w-full lg:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition"
          >
            Add Product
          </motion.button>
        </div>

        
        <div className="w-full lg:w-80 space-y-4">
          {/* Status */}
          <div className="bg-white bg-opacity-20 backdrop-blur-lg p-4 rounded-xl shadow-lg">
            <label className="block text-sm font-medium text-white mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white bg-opacity-20 text-black focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </div>

          {/* Category */}
          <div className="bg-white bg-opacity-20 backdrop-blur-lg p-4 rounded-xl shadow-lg">
            <label className="block text-sm font-medium text-white mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 rounded  bg-opacity-20 text-black focus:outline-none focus:ring focus:ring-blue-300">
              <option value="">Choose a category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="beauty">Beauty</option>
              <option value="home">Home</option>
              <option value="gadgets">Gadgets</option>
            </select>
          </div>

          {/* Price */}
          <div className="bg-white bg-opacity-20 backdrop-blur-lg p-4 rounded-xl shadow-lg">
            <label className="block text-sm font-medium text-white mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="$0.00"
              className="w-full p-2 rounded bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Stock */}
          <div className="bg-white bg-opacity-20 backdrop-blur-lg p-4 rounded-xl shadow-lg">
            <label className="block text-sm font-medium text-white mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock quantity"
              className="w-full p-2 rounded bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default AddProduct;
