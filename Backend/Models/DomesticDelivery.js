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
  }

},{timestamps:true});

module.exports = mongoose.model("DomesticDelivery",deliverySchema);