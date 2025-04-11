const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,           // matches form.title
  description: String,
  status: String,          // should be String instead of Boolean to support values like "draft", "active"
  stock: Number,
  price: Number,
  category: String,
  media: String,           // renamed from image to match form.media
});

module.exports = mongoose.model("Product", productSchema); 
 