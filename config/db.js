const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
  mongoose.connection.on("error", (err) => console.error("❌ MongoDB Error:", err));
};

module.exports = connectDB;
