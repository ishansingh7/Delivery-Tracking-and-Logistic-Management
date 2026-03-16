const express = require("express");
const router = express.Router();

const {
  getDeliveries,
  approveDelivery,
  rejectDelivery,
  deleteDelivery
} = require("../Controllers/adminInternationalController");

router.get("/deliveries", getDeliveries);

router.put("/approve/:id", approveDelivery);

router.put("/reject/:id", rejectDelivery);

router.delete("/delete/:id", deleteDelivery);

module.exports = router;