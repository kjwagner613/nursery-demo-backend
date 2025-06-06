const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ["Desert", "Mountain", "Tropical", "Forest"] },
  subcategory: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  images: { type: [String], default: [] },
  active: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;