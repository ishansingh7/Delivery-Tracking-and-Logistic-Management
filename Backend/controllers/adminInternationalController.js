const Delivery = require("../Models/InternationalDelivery");

exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveDelivery = async (req, res) => {
  const delivery = await Delivery.findById(req.params.id);
  delivery.approvalStatus = "Approved";
  await delivery.save();
  res.json(delivery);
};

exports.rejectDelivery = async (req, res) => {
  const delivery = await Delivery.findById(req.params.id);
  delivery.approvalStatus = "Rejected";
  await delivery.save();
  res.json(delivery);
};

exports.deleteDelivery = async (req, res) => {
  await Delivery.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};