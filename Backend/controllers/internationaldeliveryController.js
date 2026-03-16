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