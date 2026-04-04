const Delivery = require("../Models/InternationalDelivery");

exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find().populate("assignedTo");
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

exports.updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryStatus, lastLocation, trackingNotes } = req.body;
    
    console.log("International update. ID:", id, "Payload:", { deliveryStatus, lastLocation, trackingNotes });
    
    if (!id) {
      console.error("Error: Order ID is missing");
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }
    
    const updateData = {};
    if (deliveryStatus !== undefined && deliveryStatus !== null) updateData.deliveryStatus = deliveryStatus;
    if (lastLocation !== undefined && lastLocation !== null) updateData.lastLocation = lastLocation;
    if (trackingNotes !== undefined && trackingNotes !== null) updateData.trackingNotes = trackingNotes;
    
    console.log("Update data:", updateData);
    
    const delivery = await Delivery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: false }
    ).exec();
    
    if (!delivery) {
      console.error("International delivery not found for ID:", id);
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    console.log("International order updated:", delivery._id, "Status:", delivery.deliveryStatus);
    res.status(200).json({ 
      success: true, 
      message: "Order updated successfully", 
      data: delivery,
      delivery: delivery
    });
  } catch (error) {
    console.error("Error updating international order:", error.message, error.stack);
    res.status(500).json({ 
      success: false, 
      message: "Error updating order",
      error: error.message 
    });
  }
};