const Delivery=require("../Models/DomesticDelivery");

exports.getDeliveries=async(req,res)=>{
const deliveries=await Delivery.find().populate("assignedTo");
res.json(deliveries);
};

exports.getDeliveriesWithAgent=async(req,res)=>{
try {
  const deliveries = await Delivery.find({
    approvalStatus: "Approved"
  }).populate("assignedTo");
  
  res.json(deliveries);
} catch (error) {
  res.status(500).json({ message: "Error fetching deliveries", error });
}
};

exports.approveDelivery=async(req,res)=>{
const delivery=await Delivery.findById(req.params.id);
delivery.approvalStatus="Approved";
await delivery.save();
res.json(delivery);
};

exports.rejectDelivery=async(req,res)=>{
const delivery=await Delivery.findById(req.params.id);
delivery.approvalStatus="Rejected";
await delivery.save();
res.json(delivery);
};

exports.updateDelivery=async(req,res)=>{
try {
  const { id } = req.params;
  const { deliveryStatus, lastLocation, trackingNotes } = req.body;
  
  console.log("Update request. ID:", id, "Payload:", { deliveryStatus, lastLocation, trackingNotes });
  
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
    console.error("Delivery not found for ID:", id);
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  
  console.log("Order updated successfully:", delivery._id, "Status:", delivery.deliveryStatus);
  res.status(200).json({ 
    success: true, 
    message: "Order updated successfully", 
    data: delivery,
    delivery: delivery
  });
} catch (error) {
  console.error("Error updating order:", error.message, error.stack);
  res.status(500).json({ 
    success: false, 
    message: "Error updating order",
    error: error.message 
  });
}
};

exports.deleteDelivery=async(req,res)=>{
await Delivery.findByIdAndDelete(req.params.id);
res.json({message:"Deleted"});
};