const Product = require("../models/product");

exports.getProducts = async (req, res) => {
  const { category, min, max, search } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (min || max) filter.price = { ...(min && { $gte: min }), ...(max && { $lte: max }) };
  if (search) filter.name = { $regex: search, $options: "i" };

  const products = await Product.find(filter);
  res.json(products);
};

exports.addProduct = async (req, res) => {
  const newProduct = new Product(req.body);
  const saved = await newProduct.save();
  res.status(201).json(saved);
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(404).json({ message: 'Product not found' });
  }
};

exports.editProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: "Product deleted" });
};

exports.getInventoryStats = async (req, res) => {
  try {
    // Set default low stock threshold (can be made configurable)
    const lowStockThreshold = 10;
    
    // Get all products
    const products = await Product.find({});
    
    // Calculate statistics
    const stats = {
      totalProducts: products.length,
      lowStockItems: products.filter(product => product.stock <= lowStockThreshold).length,
      totalValue: products.reduce((sum, product) => sum + (parseFloat(product.price) * product.stock), 0).toFixed(2)
    };
    
    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch inventory statistics',
      message: error.message 
    });
  }
};

// Node.js (Express example)
exports.getRecentProducts = async (req, res) => {
  const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(4);
  res.json(recentProducts);
};

