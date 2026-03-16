const express = require("express");
const router = express.Router();

const {
createDelivery,
trackDelivery
} = require("../controllers/internationaldeliveryController");

router.post("/create",createDelivery);

router.get("/track/:trackingId",trackDelivery);

module.exports = router;