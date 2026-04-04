const express = require("express");
const router = express.Router();

const {
  createDelivery,
  trackDelivery,
  getAvailableOrders,
  acceptOrder,
  getMyOrders
} = require("../controllers/deliveryControllerDomestic");

router.post("/create", createDelivery);
router.get("/track/:trackingId", trackDelivery);
router.get("/available", getAvailableOrders);
router.post("/accept/:orderId", acceptOrder);
router.get("/myorders/:userId", getMyOrders);

module.exports = router;
