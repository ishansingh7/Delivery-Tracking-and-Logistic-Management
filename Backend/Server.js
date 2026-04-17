require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./Config/db");

const deliveryRoutes = require("./Routes/deliveryRoutesDomestic");
const adminRoutes = require("./Routes/adminRoutes");

const internationalRoutes = require("./Routes/internationaldeliveryRoutes");
const adminInternationalRoutes = require("./Routes/adminInternationalRoutes");
 
const trackingRoutes = require("./Routes/trackingRoutes");
const deliveryAuthRoutes = require("./Routes/Deliveryauth");


const app = express();

connectDB();

app.use(cors());
app.use(express.json());

/* Root endpoint - for health checks */
app.get("/", (req, res) => {
  res.json({ message: "Delivery App Backend is Running ✅" });
});

/* Delivery Personnel Auth Routes - MUST be mounted first */
app.use("/api/delivery/auth", deliveryAuthRoutes);

/* Domestic Routes */
app.use("/api/delivery", deliveryRoutes);
app.use("/api/admin", adminRoutes);

/* International Routes */

app.use("/api/international", internationalRoutes);
app.use("/api/admin/international", adminInternationalRoutes);

/* Tracking Routes */
app.use("/api/track", trackingRoutes);

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});