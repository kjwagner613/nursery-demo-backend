// Load environment variables and dependencies
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const connectDB = require('./config/db');
const cloudinary = require('./config/cloudinary');

// Import routers
const authRouter = require('./controllers/auth');
const testJwtRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const productsRouter = require('./controllers/products');

// Connect to MongoDB
connectDB();
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

// Routes
app.use('/api', authRouter);
app.use('/api/test-jwt', testJwtRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

// Log Cloudinary configuration
console.log('Cloudinary configured for:', process.env.CLOUDINARY_CLOUD_NAME);

// Start the server and listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
