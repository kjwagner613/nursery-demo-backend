const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');

// Multer setup for file uploads (in-memory storage)
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Get products with optional category filter
router.get('/', verifyToken, async (req, res) => {
  try {
    const filter = { deleted: false, active: true };
    if (req.query.category) filter.category = req.query.category;
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new product
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, category, subcategory, price, stock, active } = req.body;
    const product = await Product.create({
      name,
      category,
      subcategory,
      price,
      stock,
      active
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Upload image for a product
router.post('/:productId/upload', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'products'
    });
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { $push: { images: result.secure_url } },
      { new: true }
    );
    res.json({ image: result.secure_url, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;