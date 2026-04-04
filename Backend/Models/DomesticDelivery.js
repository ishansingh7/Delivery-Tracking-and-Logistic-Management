const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({

  trackingId:{
    type:String,
    unique:true
  },

  senderName:String,
  senderPhone:String,
  senderAddress:String,

  receiverName:String,
  receiverPhone:String,
  receiverAddress:String,

  originCity:String,
  destinationCity:String,

  packageType:String,
  weight:Number,

  deliveryType:String,
  paymentMethod:String,

  approvalStatus:{
    type:String,
    default:"Pending"
  },

  deliveryStatus:{
    type:String,
    default:"Processing"
  },

  // Delivery Person Assignment
  assignedTo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    default:null
  },

  deliveryPersonName:String,
  deliveryPersonPhone:String,
  deliveryPersonLicense:String,
  deliveryPersonPhoto:String,
  assignedAt:Date,

  lastLocation:String,
  trackingNotes:String

},{timestamps:true});

module.exports = mongoose.model("DomesticDelivery",deliverySchema);