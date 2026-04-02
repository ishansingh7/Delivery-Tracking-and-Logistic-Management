const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: String,

  phone: String,

  address: String,
  city: String,
  latitude: Number,
  longitude: Number,

  licenseNumber: String,
  licenseImage: String,

  photo: String,
  
  // Verification status
  verified: { type: Boolean, default: false },
  verifiedAt: Date,
  verifiedBy: String
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);