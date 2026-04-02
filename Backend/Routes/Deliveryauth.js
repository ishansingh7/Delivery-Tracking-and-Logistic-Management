const router = require("express").Router();
const User = require("../Models/DeliveryUser");
const bcrypt = require("bcryptjs");
const upload = require("../middleware/upload");

// Helper function to build photo URL
const buildPhotoUrl = (filename) => {
  if (!filename) return "https://via.placeholder.com/150?text=No+Photo";
  return `http://localhost:5000/uploads/${filename}`;
};

// REGISTER
router.post("/register", upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "licenseImage", maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, email, password, phone, address, city, latitude, longitude, licenseNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      city,
      latitude,
      longitude,
      licenseNumber,
      licenseImage: req.files["licenseImage"]?.[0]?.filename,
      photo: req.files["photo"]?.[0]?.filename
    });

    await newUser.save();

    // Convert to object and add full URLs
    const userData = newUser.toObject();
    userData.photo = buildPhotoUrl(newUser.photo);
    userData.licenseImage = newUser.licenseImage ? `http://localhost:5000/uploads/${newUser.licenseImage}` : null;

    res.json({ 
      message: "Registered Successfully",
      user: userData
    });

  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Invalid password");

    // Convert user to object and add full photo URL
    const userData = user.toObject();
    userData.photo = buildPhotoUrl(user.photo);
    userData.licenseImage = user.licenseImage ? `http://localhost:5000/uploads/${user.licenseImage}` : null;

    res.json({
      message: "Login Success",
      user: userData
    });

  } catch (err) {
    res.status(500).json("Server Error");
  }
});

// UPDATE PROFILE
router.put("/profile/:id", upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "licenseImage", maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, city, licenseNumber } = req.body;

    console.log("Update request received for user:", id);
    console.log("Files received:", req.files ? Object.keys(req.files) : "none");
    console.log("Body:", req.body);

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields - only if they are provided and different
    if (name && name !== user.name) user.name = name;
    if (email && email !== user.email) {
      // Check if email already exists in database
      const existingUser = await User.findOne({ email: email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }
    if (phone && phone !== user.phone) user.phone = phone;
    if (address && address !== user.address) user.address = address;
    if (city && city !== user.city) user.city = city;
    if (licenseNumber && licenseNumber !== user.licenseNumber) user.licenseNumber = licenseNumber;

    // Update photo if provided
    if (req.files && req.files["photo"] && req.files["photo"].length > 0) {
      const photoFile = req.files["photo"][0];
      user.photo = photoFile.filename;
      console.log("Photo updated:", photoFile.filename);
    }

    // Update license image if provided
    if (req.files && req.files["licenseImage"] && req.files["licenseImage"].length > 0) {
      const licenseFile = req.files["licenseImage"][0];
      user.licenseImage = licenseFile.filename;
      console.log("License image updated:", licenseFile.filename);
    }

    // Save updated user
    await user.save();
    console.log("User saved successfully");

    // Convert to object and add full URLs
    const userData = user.toObject();
    userData.photo = buildPhotoUrl(user.photo);
    userData.licenseImage = user.licenseImage ? `http://localhost:5000/uploads/${user.licenseImage}` : null;

    res.json({
      message: "Profile updated successfully",
      user: userData
    });

  } catch (err) {
    console.error("Error in profile update:", err.message);
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// GET USER PROFILE
router.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert to object and add full URLs
    const userData = user.toObject();
    userData.photo = buildPhotoUrl(user.photo);
    userData.licenseImage = user.licenseImage ? `http://localhost:5000/uploads/${user.licenseImage}` : null;

    res.json({
      success: true,
      user: userData
    });

  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET ALL DELIVERY AGENTS (FOR ADMIN)
router.get("/all-agents", async (req, res) => {
  try {
    const agents = await User.find().select("-password");
    
    // Convert each agent to object and add full URLs
    const agentsWithUrls = agents.map(agent => {
      const agentObj = agent.toObject();
      agentObj.photo = buildPhotoUrl(agent.photo);
      agentObj.licenseImage = agent.licenseImage ? `http://localhost:5000/uploads/${agent.licenseImage}` : null;
      return agentObj;
    });

    res.json({
      success: true,
      count: agentsWithUrls.length,
      agents: agentsWithUrls
    });

  } catch (err) {
    console.error("Error fetching all agents:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE DELIVERY AGENT (FOR ADMIN)
router.delete("/delete-agent/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json({
      success: true,
      message: "Agent deleted successfully",
      deletedAgent: user.name
    });

  } catch (err) {
    console.error("Error deleting agent:", err);
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// VERIFY DELIVERY AGENT (FOR ADMIN)
router.put("/verify-agent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { adminName } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Agent not found" });
    }

    user.verified = true;
    user.verifiedAt = new Date();
    user.verifiedBy = adminName || "Admin";

    await user.save();

    const userData = user.toObject();
    userData.photo = buildPhotoUrl(user.photo);
    userData.licenseImage = user.licenseImage ? `http://localhost:5000/uploads/${user.licenseImage}` : null;

    res.json({
      success: true,
      message: "Agent verified successfully",
      user: userData
    });

  } catch (err) {
    console.error("Error verifying agent:", err);
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// UNVERIFY DELIVERY AGENT (FOR ADMIN)
router.put("/unverify-agent/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Agent not found" });
    }

    user.verified = false;
    user.verifiedAt = null;
    user.verifiedBy = null;

    await user.save();

    const userData = user.toObject();
    userData.photo = buildPhotoUrl(user.photo);
    userData.licenseImage = user.licenseImage ? `http://localhost:5000/uploads/${user.licenseImage}` : null;

    res.json({
      success: true,
      message: "Agent unverified successfully",
      user: userData
    });

  } catch (err) {
    console.error("Error unverifying agent:", err);
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

module.exports = router;