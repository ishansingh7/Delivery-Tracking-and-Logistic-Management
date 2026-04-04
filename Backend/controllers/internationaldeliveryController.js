const Delivery = require("../Models/InternationalDelivery");
const { v4: uuidv4 } = require("uuid");
const generatePDF = require("../Utils/generateInternationalPDF");

// CREATE INTERNATIONAL DELIVERY
exports.createDelivery = async (req, res) => {
  try {

    // Generate unique tracking ID
    const trackingId = "INT-" + uuidv4().slice(0, 8).toUpperCase();

    // Create delivery object
    const delivery = new Delivery({
      ...req.body,
      trackingId
    });

    // Save to MongoDB
    await delivery.save();

    // Generate PDF
    const pdfPath = await generatePDF(delivery);

    // Send PDF to frontend for download
    return res.download(pdfPath, `${trackingId}.pdf`);

  } catch (error) {

    console.error("Create International Delivery Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create international shipment",
      error: error.message
    });

  }
};


// TRACK INTERNATIONAL DELIVERY
exports.trackDelivery = async (req, res) => {

  try {

    const { trackingId } = req.params;

    const delivery = await Delivery.findOne({ trackingId });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Tracking ID not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: delivery
    });

  } catch (error) {

    console.error("International Tracking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error tracking international shipment"
    });

  }

};

// GET AVAILABLE INTERNATIONAL ORDERS
exports.getAvailableOrders = async (req, res) => {
  try {
    const availableOrders = await Delivery.find({
      approvalStatus: { $regex: /^\s*approved\s*$/i },
      $or: [
        { assignedTo: null },
        { assignedTo: { $exists: false } }
      ]
    });

    return res.status(200).json({
      success: true,
      data: availableOrders
    });
  } catch (error) {
    console.error("Error fetching available international orders:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching available orders",
      error: (error && error.message) || String(error)
    });
  }
};

// ACCEPT/ASSIGN INTERNATIONAL ORDER
exports.acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryPersonId, deliveryPersonName, deliveryPersonPhone, deliveryPersonLicense, deliveryPersonPhoto } = req.body;

    const delivery = await Delivery.findByIdAndUpdate(
      orderId,
      {
        assignedTo: deliveryPersonId,
        deliveryPersonName,
        deliveryPersonPhone,
        deliveryPersonLicense,
        deliveryPersonPhoto,
        assignedAt: new Date(),
        deliveryStatus: "In Transit"
      },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order accepted successfully",
      data: delivery
    });
  } catch (error) {
    console.error("Error accepting international order:", error);
    return res.status(500).json({
      success: false,
      message: "Error accepting order"
    });
  }
};

// GET MY ASSIGNED INTERNATIONAL ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const myOrders = await Delivery.find({
      assignedTo: userId
    });

    return res.status(200).json({
      success: true,
      data: myOrders
    });
  } catch (error) {
    console.error("Error fetching my international orders:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching your orders"
    });
  }
};