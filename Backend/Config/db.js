const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4, // 🔥 IMPORTANT: fixes DNS / ReplicaSetNoPrimary error
    });

    console.log("✅ MongoDB Connected");

  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;