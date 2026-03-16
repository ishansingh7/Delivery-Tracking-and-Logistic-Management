const DomesticDelivery = require("../Models/DomesticDelivery");
const InternationalDelivery = require("../Models/InternationalDelivery");

exports.trackShipment = async (req, res) => {

  try {

    const trackingId = req.params.trackingId;

    let shipment = await DomesticDelivery.findOne({ trackingId });

    if (!shipment) {
      shipment = await InternationalDelivery.findOne({ trackingId });
    }

    if (!shipment) {
      return res.status(404).json({
        message: "Tracking ID not found"
      });
    }

    res.json(shipment);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};