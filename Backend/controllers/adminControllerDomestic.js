const Delivery=require("../Models/DomesticDelivery");

exports.getDeliveries=async(req,res)=>{
const deliveries=await Delivery.find();
res.json(deliveries);
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

const delivery=await Delivery.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
);

res.json(delivery);

};

exports.deleteDelivery=async(req,res)=>{
await Delivery.findByIdAndDelete(req.params.id);
res.json({message:"Deleted"});
};